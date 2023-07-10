import { Box, Grid, Stack } from "@mui/material";
import { cloneDeep, get, set } from "lodash";
import { useCallback, useMemo, useState } from "react";

import {
  useFetch,
  usePermission,
  useConfirmation,
  useNotification,
  useGetHeightForTable,
} from "hooks";
import { Sticky } from "hocs";
import axios from "axios.config";
import { PATHNAME } from "routes";
import { SAFE_OFFSET } from "constant";
import queryString from "query-string";
import { useRouter } from "next/router";
import { NOTIFICATIONS_FILE_NOTIFICATIONS } from "apis";
import { setFilterValue, transformDate, transformUrl } from "libs";
import IconButton from "components/Button/IconButton";
import { Container, SearchField, type PropsForAction } from "components";
import { ADMINS_ITEM, NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM } from "interfaces";
import NotificationTable from "./NotificationTable";
import FilterNotification from "./FilterNotification";

export type PartnerFilterType = {
  limit: number;
  with_count: boolean;
  offset: number;
  search?: string;
  date_created_start: Date | null;
  date_created_end: Date | null;
  app_type: string | null;
};

const defaultFilterValue: PartnerFilterType = {
  limit: 25,
  with_count: true,
  offset: 0,
  search: "",
  date_created_start: null,
  date_created_end: null,
  app_type: null,
};

export default function ListingNotification() {
  const router = useRouter();
  const [ref, { height }] = useGetHeightForTable();
  const { hasPermission } = usePermission("write_merchant");
  const { onConfirm, onClose } = useConfirmation();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM>(
      transformUrl(NOTIFICATIONS_FILE_NOTIFICATIONS, filter)
    );

  const onGotoHandler = useCallback(() => {
    router.push(`${router.pathname}/${PATHNAME.TAO_MOI}`);
  }, [router]);

  const onViewHandler = useCallback(
    (props: PropsForAction<NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM>) => {
      const { row } = props;

      const self = get(row, "original.self");

      const id = self
        .split("/")
        .filter((el: string) => {
          return el !== "";
        })
        .pop();

      const { url } = queryString.parseUrl(router.asPath);

      window.open(`${url}/${id}`, "_blank");
    },
    []
  );

  const onDeleteHandler = useCallback(
    (props: PropsForAction<NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM>) => {
      const handler = async () => {
        try {
          const self = get(props, "row.original.self");

          await axios.delete(self);

          enqueueSnackbarWithSuccess("Xóa danh mục thành công");

          refreshData();
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
          onClose();
        }
      };

      const firstName = get(props, "row.original.title");

      const message = `Hãy xác nhận bạn muốn xóa tài khoản ${firstName}, đây là hành động không thể hoàn tác`;

      onConfirm(handler, {
        message,
      });
    },
    []
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        if (key === "app_type") {
          set(cloneFilter, key, value);
        }

        setFilter(cloneFilter);

        if (["date_created_start", "date_created_end"].includes(key)) return;

        const params = cloneDeep(cloneFilter);

        set(params, "app_type", get(params, "app_type[0]"));

        changeKey(transformUrl(NOTIFICATIONS_FILE_NOTIFICATIONS, params));
      };
    },
    [filter]
  );

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(NOTIFICATIONS_FILE_NOTIFICATIONS, defaultFilterValue));
  }, [filter]);

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    let dateStart: any = get(filter, "date_created_start");
    let dateEnd: any = get(filter, "date_created_end");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    set(cloneFilter, "app_type", get(cloneFilter, "app_type[0]"));

    changeKey(
      transformUrl(NOTIFICATIONS_FILE_NOTIFICATIONS, {
        ...cloneFilter,
        date_created_start: dateStart,
        date_created_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  return (
    <Container>
      <Grid container>
        <Grid item xs={3}>
          <FilterNotification
            filter={filter}
            onAppTypeChange={onFilterChangeHandler("app_type")}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onDateStartChange={onFilterChangeHandler("date_created_start")}
            onDateEndChange={onFilterChangeHandler("date_created_end")}
          />
        </Grid>

        <Grid item xs={9}>
          <Sticky>
            <Stack spacing={3}>
              <Stack
                columnGap={3}
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <Stack flexGrow={1}>
                  <SearchField
                    onChange={onFilterChangeHandler("search")}
                    initSearch={filter.search}
                  />
                </Stack>

                {hasPermission && <IconButton onClick={onGotoHandler} />}
              </Stack>

              <Box ref={ref}>
                <NotificationTable
                  data={data ?? []}
                  count={itemCount}
                  isLoading={isLoading}
                  pagination={pagination}
                  onPageChange={onFilterChangeHandler("page")}
                  onPageSizeChange={onFilterChangeHandler("pageSize")}
                  maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
                  onViewHandler={onViewHandler}
                  onDeleteHandler={onDeleteHandler}
                />
              </Box>
            </Stack>
          </Sticky>
        </Grid>
      </Grid>
    </Container>
  );
}
