import { Column, CellProps } from "react-table";
import { Fragment, PropsWithChildren } from "react";

import { get } from "lodash";

import { WrapperTableCell, TableCellWithFetch, NumberFormat, Link } from "components";

import {
  RANKS_ITEM,
  responseSchema,
  MERCHANTS_STORES_ITEM,
  MERCHANTS_STORES_RANKBANDS_ITEM,
  MERCHANTS_STORES_BRANCHES_ORDERS_ITEM,
} from "interfaces";

import axios from "axios.config";
import { formatDate, transformUrl } from "libs";
import { usePermission } from "hooks";

function columns<T extends Record<string, unknown>>(loading?: boolean): Column<T>[] {
  return [
    {
      Header: "Tên Quán",
      accessor: "store",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { cell, onGotoHandler, row, column } = props;

        const { hasPermission } = usePermission("read_merchant");

        const value = cell.value;

        if (!hasPermission)
          return <WrapperTableCell loading={loading}>-</WrapperTableCell>;

        return (
          <TableCellWithFetch<MERCHANTS_STORES_ITEM> url={value} loading={loading}>
            {(data) => {
              const { name } = data;

              return (
                <WrapperTableCell title={`${name}`} loading={loading}>
                  <Link href="#" onClick={onGotoHandler?.({ row, column })}>
                    {name}
                  </Link>
                </WrapperTableCell>
              );
            }}
          </TableCellWithFetch>
        );
      },
      colSpan: 3,
    },

    {
      Header: "Hạng",
      accessor: "rank",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const rankData: RANKS_ITEM[] = props.rankData;

        const pointEarn = get(row, "original.point_earn");
        const storeUrl = get(row, "original.store");

        return (
          <TableCellWithFetch<MERCHANTS_STORES_ITEM> url={storeUrl} loading={loading}>
            {(data) => {
              const { rank_bands } = data;

              return (
                <TableCellWithFetch<responseSchema<MERCHANTS_STORES_RANKBANDS_ITEM>>
                  url={rank_bands}
                  loading={loading}
                >
                  {(data) => {
                    const rankbandData = data.results;

                    let name = "";

                    const index = rankbandData.findIndex((el, idx, arr) => {
                      if (idx === arr.length - 1 && pointEarn > el.band_amount) {
                        return true;
                      }

                      return pointEarn <= el.band_amount;
                    });

                    if (index >= 0) {
                      const item = rankData[index];

                      name = item["name"];
                    }

                    return (
                      <WrapperTableCell title={`${name}`} loading={loading}>
                        {name}
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
      Header: "Điểm Tích Lũy",
      accessor: "point_earn",
      textAlign: "right",

      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { cell } = props;

        const value = cell.value;

        return (
          <WrapperTableCell title={value} loading={loading} justifyContent={"flex-end"}>
            <NumberFormat value={value} />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: "Số Đơn Hàng",
      accessor: "order",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row, orderUrl } = props;

        const store = get(row, "original.store");

        return (
          <TableCellWithFetch<responseSchema<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM>>
            url={transformUrl(orderUrl, {
              store: store.replace(axios.defaults.baseURL, ""),
              limit: 1,
              with_count: true,
            })}
          >
            {(data) => {
              if (data.count == undefined) {
                return <Fragment></Fragment>;
              }

              return (
                <WrapperTableCell
                  title={data.count}
                  loading={loading}
                  justifyContent="flex-end"
                  display="flex"
                >
                  <NumberFormat value={data.count} />
                </WrapperTableCell>
              );
            }}
          </TableCellWithFetch>
        );
      },
    },
    {
      Header: "Thành Viên Từ",
      accessor: "date_joined",

      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { cell } = props;

        const value = cell.value;

        return (
          <WrapperTableCell title={formatDate(value, "dd/MM/yyyy")} loading={loading}>
            {formatDate(value, "dd/MM/yyyy")}
          </WrapperTableCell>
        );
      },
    },
  ];
}

export default columns;
