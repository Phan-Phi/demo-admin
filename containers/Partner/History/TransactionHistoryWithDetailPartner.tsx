import useSWR from "swr";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";

import { cloneDeep, get, set } from "lodash";

import { Grid, Typography, Stack, Button, Box } from "@mui/material";

import {
  Container,
  BoxWithShadow,
  Loading,
  type PropsForAction,
  InputNumber,
  WrapperTable,
} from "components";

import SearchField from "components/Filter/SearchField";
import TransactionHistoryWithDetailPartnerTable from "./TransactionHistoryWithDetailPartnerTable";
import FilterTransactionHistoryWithDetailPartner from "./FilterTransactionHistoryWithDetailPartner";

import { Sticky } from "hocs";
import { MERCHANTS } from "apis";
import { PATHNAME } from "routes";
import { BUTTON, SAFE_OFFSET } from "constant";
import { useFetch, useGetHeightForTable } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";

import {
  MERCHANTS_ITEM,
  responseSchema,
  MERCHANTS_WALLETS_ITEM,
  MERCHANTS_TRANSACTIONS_ITEM,
} from "interfaces";

export type TransactionHistoryWithDetailPartnerFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  search?: string;
  date_created_start: Date | null;
  date_created_end: Date | null;
  transaction_type: string;
};

const defaultFilterValue: TransactionHistoryWithDetailPartnerFilterType = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
  date_created_start: null,
  date_created_end: null,
  transaction_type: "",
};

const TransactionHistoryWithDetailPartner = () => {
  const router = useRouter();

  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { data: merchantData } = useSWR<MERCHANTS_ITEM>(
    `${MERCHANTS}${router.query.merchantId}`
  );

  const { data: merchantWalletData } = useSWR<responseSchema<MERCHANTS_WALLETS_ITEM>>(
    () => {
      if (merchantData) {
        const { wallet } = merchantData;

        return wallet;
      }
    }
  );

  const { data, isLoading, itemCount, changeKey } = useFetch<MERCHANTS_TRANSACTIONS_ITEM>(
    transformUrl(`${MERCHANTS}${router.query.merchantId}/transactions/`, filter)
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        if (key === "transaction_type") {
          set(cloneFilter, key, value);
        }

        setFilter(cloneFilter);

        if (["date_created_start", "date_created_end"].includes(key)) return;

        const params = cloneDeep(cloneFilter);

        set(params, "transaction_type", get(params, "transaction_type"));

        changeKey(
          transformUrl(`${MERCHANTS}${router.query.merchantId}/transactions/`, params)
        );
      };
    },
    [filter, router]
  );

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    let dateStart: any = get(filter, "date_created_start");
    let dateEnd: any = get(filter, "date_created_end");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    set(cloneFilter, "transaction_type", get(cloneFilter, "transaction_type"));

    changeKey(
      transformUrl(`${MERCHANTS}${router.query.merchantId}/transactions/`, {
        ...cloneFilter,
        date_created_start: dateStart,
        date_created_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter, router]);

  const onViewHandler = useCallback(
    (props: PropsForAction<MERCHANTS_TRANSACTIONS_ITEM>) => {
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

  const onGotoHandler = useCallback((data: any) => {
    return async (e: React.SyntheticEvent) => {
      e.preventDefault();

      const sourceType = get(data, "source_type");

      if (sourceType === "cash.pointnote") {
        const url: string = get(data, "owner");

        const id = url
          .split("/")
          .filter((el) => el !== "")
          .pop();

        window.open(`/${PATHNAME.DOI_TAC}/${PATHNAME.TAI_KHOAN}/${id}`);
      } else if (sourceType === "store_order.order") {
        const url: string = get(data, "customer");

        const id = url
          .split("/")
          .filter((el) => el !== "")
          .pop();

        window.open(`/${PATHNAME.KHACH_HANG}/${PATHNAME.TAI_KHOAN}/${id}`);
      }
    };
  }, []);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(
        `${MERCHANTS}${router.query.merchantId}/transactions/`,
        defaultFilterValue
      )
    );
  }, [filter, router]);

  const onGobackHandler = useCallback(() => {
    router.push(`/${PATHNAME.DOI_TAC}/${PATHNAME.LICH_SU}`);
  }, []);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  const renderMerchantInfo = useMemo(() => {
    if (merchantData == undefined || merchantWalletData == undefined) {
      return <Loading />;
    }

    const { last_name, first_name } = merchantData;

    const merchantWallet = merchantWalletData.results[0];

    const fullName = `${last_name} ${first_name}`;

    let renderPoint = null;

    if (merchantWallet) {
      const { point_in, point_out } = merchantWallet;

      const point = point_in - point_out;

      renderPoint = (
        <InputNumber
          readOnly={true}
          NumberFormatProps={{
            value: point,
          }}
          FormLabelProps={{
            children: "Điểm Hiện Tại",
          }}
          InputProps={{
            sx: {
              WebkitTextFillColor: ({ palette }) => {
                return `${palette.primary2.main} !important`;
              },
            },
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
  }, [merchantData, merchantWalletData]);

  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <BoxWithShadow>{renderMerchantInfo}</BoxWithShadow>
        </Grid>

        <Grid item xs={3}>
          <FilterTransactionHistoryWithDetailPartner
            filter={filter}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onFilterSelect={onFilterChangeHandler("transaction_type")}
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
                  <TransactionHistoryWithDetailPartnerTable
                    data={data ?? []}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom) - 90}
                    count={itemCount}
                    isLoading={isLoading}
                    pagination={pagination}
                    onGotoHandler={onGotoHandler}
                    onViewHandler={onViewHandler}
                  />
                </Box>
              </WrapperTable>
            </Stack>
          </Sticky>
        </Grid>

        <Grid item xs={12}>
          <Stack alignItems="center">
            <Button variant="outlined" onClick={onGobackHandler}>
              {BUTTON.BACK}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TransactionHistoryWithDetailPartner;
