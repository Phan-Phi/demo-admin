import { Box, Grid, Stack } from "@mui/material";
import { cloneDeep, get, set } from "lodash";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";

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
import { ADMINS, ADVERTISEMENTS } from "apis";
import { setFilterValue, transformDate, transformUrl } from "libs";
import IconButton from "components/Button/IconButton";
import { Container, SearchField, type PropsForAction } from "components";
import { ADMINS_ITEM, MERCHANTS_ITEM } from "interfaces";
import AdvertisementTable from "./AdvertisementTable";
import FilterAdvertisement from "./FilterAdvertisement";
// import AdminTable from "./AdminTable";
// import FilterAdmin from "./FilterAdmin";

export type PartnerFilterType = {
  limit: number;
  with_count: boolean;
  offset: number;
  search?: string;
  date_created_start: Date | null;
  date_created_end: Date | null;
  position_contain: string | null;
  app_type_contain: string | null;
};

const defaultFilterValue: PartnerFilterType = {
  limit: 25,
  with_count: true,
  offset: 0,
  search: "",
  date_created_start: null,
  date_created_end: null,
  app_type_contain: null,
  position_contain: null,
};

export default function ListingAdvertisement() {
  const router = useRouter();
  const [ref, { height }] = useGetHeightForTable();
  const { hasPermission } = usePermission("write_merchant");
  const { onConfirm, onClose } = useConfirmation();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, isLoading, itemCount, changeKey, refreshData } = useFetch<MERCHANTS_ITEM>(
    transformUrl(ADVERTISEMENTS, filter)
  );

  const { data: groupData } = useSWR(
    "/admin/advertisements/?app_type_contain=Customer&date_created_end&date_created_start&limit=25&offset=0&position_contain=News&search=&with_count=true"
  );

  const onGotoHandler = useCallback(() => {
    router.push(`${router.pathname}/${PATHNAME.TAO_MOI}`);
  }, [router]);

  const onViewHandler = useCallback((props: PropsForAction<MERCHANTS_ITEM>) => {
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
  }, []);

  const onDeleteHandler = useCallback((props: PropsForAction<MERCHANTS_ITEM>) => {
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

    const firstName = get(props, "row.original.name");

    const message = `Hãy xác nhận bạn muốn xóa tài khoản ${firstName}, đây là hành động không thể hoàn tác`;

    onConfirm(handler, {
      message,
    });
  }, []);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        if (key === "app_type_contain") {
          set(cloneFilter, key, value);
        }
        if (key === "position_contain") {
          set(cloneFilter, key, value);
        }

        setFilter(cloneFilter);

        if (["date_created_start", "date_created_end"].includes(key)) return;

        const params = cloneDeep(cloneFilter);

        set(params, "app_type_contain", get(params, "app_type_contain[0]"));
        set(params, "position_contain", get(params, "position_contain[0]"));

        changeKey(transformUrl(ADVERTISEMENTS, params));
      };
    },
    [filter]
  );

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(ADVERTISEMENTS, defaultFilterValue));
  }, [filter]);

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    let dateStart: any = get(filter, "date_created_start");
    let dateEnd: any = get(filter, "date_created_end");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    set(cloneFilter, "app_type_contain", get(cloneFilter, "app_type_contain[0]"));
    set(cloneFilter, "position_contain", get(cloneFilter, "position_contain[0]"));

    changeKey(
      transformUrl(ADVERTISEMENTS, {
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
          <FilterAdvertisement
            filter={filter}
            onAppTypeContainChange={onFilterChangeHandler("app_type_contain")}
            onPositionContainChange={onFilterChangeHandler("position_contain")}
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
                <AdvertisementTable
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
