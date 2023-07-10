import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { get } from "lodash";
import { Box } from "@mui/material";

import {
  REPORTS_CUSTOMERS_OVEWVIEW_ITEM,
  CommonTableProps,
  MERCHANTS_WALLETS_ITEM,
  responseSchema,
  MERCHANTS_STORES_ITEM,
  CUSTOMERS_ITEM,
  CUSTOMERS_WALLETS_ITEM,
} from "interfaces";

import {
  NumberFormat,
  RenderBody,
  RenderHeader,
  Table,
  TableBody,
  TableCellWithFetch,
  TableContainer,
  TableHead,
  TablePagination,
  VNDCurrency,
  WrapperTableCell,
} from "components";
import { useChoice } from "hooks";
import { getDisplayValueFromChoiceItem, transformUrl } from "libs";

type CustomerReportTableProps = CommonTableProps<REPORTS_CUSTOMERS_OVEWVIEW_ITEM> &
  Record<string, any>;

const CustomerReportTable = (props: CustomerReportTableProps) => {
  const {
    data,
    count,
    onPageChange,
    onPageSizeChange,
    pagination,
    maxHeight,
    isLoading,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        Header: "Tên Khách Hàng",
        accessor: "name",
        Cell: (
          props: PropsWithChildren<CellProps<REPORTS_CUSTOMERS_OVEWVIEW_ITEM, any>>
        ) => {
          const { row } = props;
          const fullName = get(row, "original.customer_name");

          return (
            <WrapperTableCell
              title={`${fullName}`}
              sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {fullName}
            </WrapperTableCell>
          );
        },
        maxWidth: 200,
      },
      {
        Header: "Giới Tính",
        accessor: "gender",
        Cell: (
          props: PropsWithChildren<CellProps<REPORTS_CUSTOMERS_OVEWVIEW_ITEM, any>>
        ) => {
          const { row } = props;

          const { genders } = useChoice();

          const customerUrl = get(row, "original.customer");

          return (
            <TableCellWithFetch<CUSTOMERS_ITEM> url={customerUrl}>
              {(data) => {
                const value = data.gender;

                const displayValue = getDisplayValueFromChoiceItem(genders, value);

                return (
                  <WrapperTableCell title={displayValue}>{displayValue}</WrapperTableCell>
                );
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: "Tổng điểm",
        accessor: "totalPoint",
        Cell: (
          props: PropsWithChildren<CellProps<REPORTS_CUSTOMERS_OVEWVIEW_ITEM, any>>
        ) => {
          const { row } = props;

          const customerUrl = get(row, "original.customer");

          return (
            <TableCellWithFetch<CUSTOMERS_ITEM> url={customerUrl}>
              {(data) => {
                const walletUrl = data.wallet;

                return (
                  <TableCellWithFetch<responseSchema<CUSTOMERS_WALLETS_ITEM>>
                    url={walletUrl}
                  >
                    {(data) => {
                      const pointIn: number = get(data, "results[0].point_in");

                      return (
                        <WrapperTableCell>
                          <NumberFormat value={pointIn} />
                        </WrapperTableCell>
                      );
                    }}
                  </TableCellWithFetch>
                );
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: "Điểm Hiện Tại",
        accessor: "wallet",
        Cell: (
          props: PropsWithChildren<CellProps<REPORTS_CUSTOMERS_OVEWVIEW_ITEM, any>>
        ) => {
          const { row } = props;
          const customerUrl = get(row, "original.customer");

          return (
            <TableCellWithFetch<CUSTOMERS_ITEM> url={customerUrl}>
              {(data) => {
                const wallerUrl = data.wallet;

                return (
                  <TableCellWithFetch<responseSchema<CUSTOMERS_WALLETS_ITEM>>
                    url={wallerUrl}
                  >
                    {(data) => {
                      const pointIn: number = get(data, "results[0].point_in");
                      const pointOut: number = get(data, "results[0].point_out");

                      return (
                        <WrapperTableCell>
                          <NumberFormat value={pointIn - pointOut} suffix="" />
                        </WrapperTableCell>
                      );
                    }}
                  </TableCellWithFetch>
                );
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: "Tổng đơn hàng",
        accessor: "orders",
        Cell: (
          props: PropsWithChildren<CellProps<REPORTS_CUSTOMERS_OVEWVIEW_ITEM, any>>
        ) => {
          const { row } = props;
          const customerUrl = get(row, "original.customer");

          return (
            <TableCellWithFetch<CUSTOMERS_ITEM> url={customerUrl}>
              {(data) => {
                const orderUrl = data.orders;

                return (
                  <TableCellWithFetch<responseSchema<CUSTOMERS_WALLETS_ITEM>>
                    url={transformUrl(orderUrl, {
                      with_count: true,
                    })}
                  >
                    {(data) => {
                      return (
                        <WrapperTableCell title={get(data, "count")}>
                          <NumberFormat value={get(data, "count")} />
                        </WrapperTableCell>
                      );
                    }}
                  </TableCellWithFetch>
                );
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: "Tổng giá trị đơn hàng",
        accessor: "total_order_cash",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<CellProps<REPORTS_CUSTOMERS_OVEWVIEW_ITEM, any>>
        ) => {
          const { cell } = props;
          const value = cell.value || "0";

          return (
            <WrapperTableCell title={value}>
              <VNDCurrency value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
    ];
  }, []);

  const table = useTable(
    {
      columns: columns as any,
      data,
      manualPagination: true,
      autoResetPage: false,
      ...restProps,
    },
    useSortBy,
    useSticky
  );

  return (
    <Box>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader table={table} />
          </TableHead>
          <TableBody>
            <RenderBody loading={isLoading} table={table} />
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end">
        <TablePagination
          count={count}
          page={pagination.pageIndex}
          rowsPerPage={pagination.pageSize}
          onPageChange={(_, page) => onPageChange(page)}
          onRowsPerPageChange={onPageSizeChange}
          rowsPerPageOptions={[25, 50, 75, 100]}
        />
      </Box>
    </Box>
  );
};

export default CustomerReportTable;
