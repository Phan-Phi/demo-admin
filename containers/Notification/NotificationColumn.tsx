import { get } from "lodash";
import { Column, CellProps } from "react-table";
import { Fragment, PropsWithChildren } from "react";

import {
  WrapperTableCell,
  ActionTableCell,
  TableCellWithFetch,
  TableCellForAvatar,
} from "components";

import { useChoice, usePermission } from "hooks";
import { NOTIFICATIONS_WALLETS_ITEM, responseSchema } from "interfaces";
import { formatDate, getDisplayValueFromChoiceItem, transformUrl } from "libs";

function columns<T extends Record<string, unknown> = {}>(loading?: boolean): Column<T>[] {
  return [
    {
      Header: "Banner",
      accessor: "image",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { cell } = props;

        return <TableCellForAvatar loading={loading} src={cell.value} />;
      },
      maxWidth: 90,
    },

    {
      Header: "Tiêu Đề",
      accessor: "title",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { cell } = props;

        const value = cell.value;

        return (
          <WrapperTableCell title={value} loading={loading}>
            {value}
          </WrapperTableCell>
        );
      },
      maxWidth: 300,
    },

    {
      Header: "Đối Tượng",
      accessor: "app_type",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const choice = useChoice();
        const { cell } = props;
        const { app_type } = choice;

        const value = getDisplayValueFromChoiceItem(app_type, cell.value);

        return (
          <WrapperTableCell justifyContent="left" loading={loading}>
            {value}
          </WrapperTableCell>
        );
      },
    },

    {
      Header: "Ngày tạo",
      accessor: "date_created",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { cell } = props;

        const value = cell.value;

        return (
          <WrapperTableCell loading={loading}>
            {formatDate(value, "dd/MM/yyyy hh:mm:ss")}
          </WrapperTableCell>
        );
      },
    },

    {
      Header: "Hành động",
      accessor: "",
      sticky: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { onDeleteHandler, onViewHandler, column, row } = props;
        const linkPushTime = get(props, "row.original.push_times");

        const { hasPermission } = usePermission("write_notification");

        return (
          <TableCellWithFetch<responseSchema<NOTIFICATIONS_WALLETS_ITEM>>
            url={transformUrl(linkPushTime, { limit: 1, with_count: true })}
            loading={loading}
          >
            {(data) => {
              const count = data.count;

              if (count !== undefined) {
                return (
                  <ActionTableCell
                    onViewHandler={onViewHandler}
                    onDeleteHandler={hasPermission ? onDeleteHandler : undefined}
                    column={column}
                    row={row}
                    loading={loading}
                    checkDeletePushTime={count}
                  />
                );
              } else {
                return <Fragment></Fragment>;
              }
            }}
          </TableCellWithFetch>
        );
      },
    },
  ];
}

export default columns;
