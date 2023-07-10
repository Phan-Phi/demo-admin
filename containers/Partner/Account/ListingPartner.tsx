import queryString from "query-string";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";

import { Box, Grid, Stack } from "@mui/material";

import { cloneDeep, get, set } from "lodash";

import { Container, WrapperTable, type PropsForAction } from "components";

import IconButton from "components/Button/IconButton";
import SearchField from "components/Filter/SearchField";

import Filter from "./Filter";
import { MERCHANTS } from "apis";
import axios from "axios.config";
import { PATHNAME } from "routes";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { ADMINS_ITEM, MERCHANTS_ITEM } from "interfaces";
import {
  useConfirmation,
  useNotification,
  usePermission,
  useGetHeightForTable,
  useFetch,
} from "hooks";
import { Sticky } from "hocs";
import { SAFE_OFFSET } from "constant";
import PartnerTable from "./PartnerTable";

export type PartnerFilterType = {
  limit: number;
  with_count: boolean;
  offset: number;
  search?: string;
  date_joined_start: Date | null;
  date_joined_end: Date | null;
  activated_by_person: ADMINS_ITEM | null;
  is_active: string;
};

const defaultFilterValue: PartnerFilterType = {
  limit: 25,
  with_count: true,
  offset: 0,
  search: "",
  date_joined_start: null,
  date_joined_end: null,
  activated_by_person: null,
  is_active: "",
};

const ListingPartner = () => {
  const router = useRouter();

  const { hasPermission } = usePermission("write_merchant");

  const { onConfirm, onClose } = useConfirmation();

  const [ref, { height }] = useGetHeightForTable();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState(defaultFilterValue);
  const { data, isLoading, itemCount, changeKey, refreshData } = useFetch<MERCHANTS_ITEM>(
    transformUrl(MERCHANTS, filter)
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

        enqueueSnackbarWithSuccess("Xóa tài khoản thành công");

        refreshData();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        onClose();
      }
    };

    const firstName = get(props, "row.original.first_name");

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

        if (key === "activated_by_person") {
          set(cloneFilter, key, value);
        }

        setFilter(cloneFilter);

        if (["date_joined_start", "date_joined_end"].includes(key)) return;

        const params = cloneDeep(cloneFilter);

        set(params, "activated_by_person", get(params, "activated_by_person.self"));

        changeKey(transformUrl(MERCHANTS, params));
      };
    },
    [filter]
  );

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(MERCHANTS, defaultFilterValue));
  }, [filter]);

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    let dateStart: any = get(filter, "date_joined_start");
    let dateEnd: any = get(filter, "date_joined_end");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    set(cloneFilter, "activated_by_person", get(cloneFilter, "activated_by_person.self"));

    changeKey(
      transformUrl(MERCHANTS, {
        ...cloneFilter,
        date_joined_start: dateStart,
        date_joined_end: dateEnd,
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
          <Filter
            filter={filter}
            onActiveAccountChange={onFilterChangeHandler("activated_by_person")}
            onActiveChange={onFilterChangeHandler("is_active")}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onDateStartChange={onFilterChangeHandler("date_joined_start")}
            onDateEndChange={onFilterChangeHandler("date_joined_end")}
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

              <WrapperTable>
                <Box ref={ref}>
                  <PartnerTable
                    data={data ?? []}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    pagination={pagination}
                    maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
                    isLoading={isLoading}
                    count={itemCount}
                    onDeleteHandler={onDeleteHandler}
                    onViewHandler={onViewHandler}
                  />
                </Box>
              </WrapperTable>
            </Stack>
          </Sticky>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ListingPartner;
