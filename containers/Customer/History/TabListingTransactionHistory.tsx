import useSWR from "swr";
import { useRouter } from "next/router";
import { Grid, Typography, Stack, Box } from "@mui/material";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import { cloneDeep, get } from "lodash";

import {
  Loading,
  InputNumber,
  WrapperTable,
  BoxWithShadow,
  type PropsForAction,
} from "components";
import SearchField from "components/Filter/SearchField";
import TransactionHistoryTable from "./TransactionHistoryTable";
import FilterTabListingTransactionHistory from "./FilterTabListingTransactionHistory";

import {
  responseSchema,
  CUSTOMERS_ITEM,
  CUSTOMERS_WALLETS_ITEM,
  CUSTOMERS_TRANSACTIONS_ITEM,
} from "interfaces";

import { Sticky } from "hocs";
import { CUSTOMERS } from "apis";
import { PATHNAME } from "routes";
import { SAFE_OFFSET } from "constant";
import { useFetch, useGetHeightForTable } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";

export type TabListingTransactionHistoryFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  search?: string;
  date_created_start: Date | null;
  date_created_end: Date | null;
  transaction_type: string;
};

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
  date_created_start: null,
  date_created_end: null,
  transaction_type: "",
};

const TabListingTransactionHistory = () => {
  const router = useRouter();

  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { data: customerData } = useSWR<CUSTOMERS_ITEM>(`${CUSTOMERS}${router.query.id}`);

  const { data: customerWalletData } = useSWR<responseSchema<CUSTOMERS_WALLETS_ITEM>>(
    () => {
      if (customerData) {
        const { wallet } = customerData;

        return wallet;
      }
    }
  );

  const { data, itemCount, isLoading, changeKey } = useFetch<CUSTOMERS_TRANSACTIONS_ITEM>(
    transformUrl(customerData?.transactions, filter)
  );

  useEffect(() => {
    if (customerData == undefined) return;

    changeKey(transformUrl(customerData.transactions, filter));
  }, [customerData, filter]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (["date_created_start", "date_created_end"].includes(key)) return;

        const params = cloneDeep(cloneFilter);

        changeKey(transformUrl(customerData?.transactions, params));
      };
    },
    [filter, customerData]
  );

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    let dateStart: any = get(filter, "date_created_start");
    let dateEnd: any = get(filter, "date_created_end");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    changeKey(
      transformUrl(customerData?.transactions, {
        ...cloneFilter,
        date_created_start: dateStart,
        date_created_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter, customerData]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(customerData?.transactions, defaultFilterValue));
  }, [filter, customerData]);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  const onViewHandler = useCallback(
    (props: PropsForAction<CUSTOMERS_TRANSACTIONS_ITEM>) => {
      const { row } = props;

      const sourceType = row.original.source_type;

      if (sourceType === "cash.pointnote") {
        const pointNoteId = row.original.source
          .split("/")
          .filter((el) => el !== "")
          .pop();

        if (pointNoteId) {
          window.open(
            `/${PATHNAME.DOI_TAC}/${PATHNAME.XU_LY_DIEM}/${pointNoteId}`,
            "_blank"
          );
        }
      } else if (sourceType === "store_order.order") {
        const orderId = row.original.source
          .split("/")
          .filter((el) => el !== "")
          .pop();

        if (orderId) {
          window.open(`/${PATHNAME.LICH_SU_DON_HANG}/${orderId}`, "_blank");
        }
      }
    },
    []
  );

  const onViewMerchantHandler = useCallback(
    (props: PropsForAction<CUSTOMERS_TRANSACTIONS_ITEM>) => {
      const { row } = props;

      const self = get(row, "original.self");

      const id = self.split("/").filter((el: string) => {
        return el !== "";
      })[2];

      if (id) {
        window.open(`/${PATHNAME.KHACH_HANG}/${PATHNAME.TAI_KHOAN}/${id}`);
      }
    },
    []
  );

  const renderCustomerInfo = useMemo(() => {
    if (customerData == undefined || customerWalletData == undefined) {
      return <Loading />;
    }

    const { first_name, last_name } = customerData;

    const fullName = `${last_name} ${first_name}`;

    const customerWallet = customerWalletData.results[0];

    let renderPoint = null;

    if (customerWallet) {
      const { point_in, point_out } = customerWallet;

      const point = point_in - point_out;

      renderPoint = (
        <InputNumber
          readOnly={true}
          NumberFormatProps={{
            value: point,
          }}
          InputProps={{
            sx: {
              WebkitTextFillColor: ({ palette }) => {
                return `${palette.primary2.main} !important`;
              },
            },
          }}
          FormLabelProps={{
            children: "Điểm Hiện Tại",
          }}
        />
      );
    }

    return (
      <Stack spacing={2}>
        <Typography color="primary2.main" variant="h2">
          {fullName}
        </Typography>

        {renderPoint}
      </Stack>
    );
  }, [customerData, customerWalletData]);

  if (customerData == undefined) return <Loading />;

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12}>
          <BoxWithShadow>{renderCustomerInfo}</BoxWithShadow>
        </Grid>

        <Grid item xs={3}>
          <FilterTabListingTransactionHistory
            filter={filter}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onTransactionChange={onFilterChangeHandler("transaction_type")}
            onDateStartChange={onFilterChangeHandler("date_created_start")}
            onDateEndChange={onFilterChangeHandler("date_created_end")}
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
                  <TransactionHistoryTable
                    data={data ?? []}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom) - 90}
                    count={itemCount}
                    isLoading={isLoading}
                    pagination={pagination}
                    onViewHandler={onViewHandler}
                    onViewMerchantHandler={onViewMerchantHandler}
                  />
                </Box>
              </WrapperTable>
            </Stack>
          </Sticky>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default TabListingTransactionHistory;
