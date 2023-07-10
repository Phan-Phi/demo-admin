import queryString from "query-string";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";

import get from "lodash/get";
import axios from "axios.config";
import { cloneDeep, set } from "lodash";
import { Box, Grid, Stack } from "@mui/material";

import AccountTable from "./AccountTable";
import FilterListingAccount from "./FilterListingAccount";
import { Container, type PropsForAction, SearchField, WrapperTable } from "components";

import { Sticky } from "hocs";
import { CUSTOMERS } from "apis";
import { SAFE_OFFSET } from "constant";
import { CUSTOMERS_ITEM } from "interfaces";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { useConfirmation, useNotification, useGetHeightForTable, useFetch } from "hooks";

export type ListingAccountFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  search?: string;
  is_active: string;
  date_joined_start: Date | null;
  date_joined_end: Date | null;
};

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
  is_active: "",
  date_joined_start: null,
  date_joined_end: null,
};

const ListingAccount = () => {
  const router = useRouter();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, itemCount, isLoading, changeKey, refreshData } = useFetch<CUSTOMERS_ITEM>(
    transformUrl(CUSTOMERS, filter)
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (["date_joined_start", "date_joined_end"].includes(key)) return;

        const params = cloneDeep(cloneFilter);

        changeKey(transformUrl(CUSTOMERS, params));
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    let dateStart: any = get(filter, "date_joined_start");
    let dateEnd: any = get(filter, "date_joined_end");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    set(cloneFilter, "is_active", get(cloneFilter, "is_active"));

    changeKey(
      transformUrl(CUSTOMERS, {
        ...cloneFilter,
        date_joined_start: dateStart,
        date_joined_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(CUSTOMERS, defaultFilterValue));
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  const onViewHandler = useCallback((props: PropsForAction<CUSTOMERS_ITEM>) => {
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

  const onDeleteHandler = useCallback((props: PropsForAction<CUSTOMERS_ITEM>) => {
    const handler = async () => {
      try {
        const self = get(props, "row.original.self");

        await axios.delete(self);

        enqueueSnackbarWithSuccess("Xóa tài khoản thành công");

        refreshData();
      } catch (err) {
        const message = get(err, "response.data.message");

        enqueueSnackbarWithError(message);
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

  return (
    <Container>
      <Grid container>
        <Grid item xs={3}>
          <FilterListingAccount
            filter={filter}
            resetFilter={resetFilterHandler}
            onActiveChange={onFilterChangeHandler("is_active")}
            onFilterByTime={onClickFilterByTime}
            onDateStartChange={onFilterChangeHandler("date_joined_start")}
            onDateEndChange={onFilterChangeHandler("date_joined_end")}
          />
        </Grid>
        <Grid item xs={9}>
          <Sticky>
            <Stack spacing={3}>
              <SearchField
                initSearch={filter.search}
                onChange={onFilterChangeHandler("search")}
              />

              <WrapperTable>
                <Box ref={ref}>
                  <AccountTable
                    data={data ?? []}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
                    count={itemCount}
                    isLoading={isLoading}
                    pagination={pagination}
                    onViewHandler={onViewHandler}
                    onDeleteHandler={onDeleteHandler}
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

export default ListingAccount;
