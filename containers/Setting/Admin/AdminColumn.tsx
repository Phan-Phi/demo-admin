import { PropsWithChildren } from "react";
import { Column, CellProps } from "react-table";
import CircleIcon from "@mui/icons-material/Circle";

import { get } from "lodash";

import { ActionTableCell, WrapperTableCell, TableCellWithFetch } from "components";

import { usePermission } from "hooks";
import { formatDate, formatPhoneNumber } from "libs";
import { GROUPS_ITEM, responseSchema } from "interfaces";

function columns<T extends Record<string, unknown> = {}>(loading?: boolean): Column<T>[] {
  return [
    {
      Header: "Họ",
      accessor: "last_name",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { value } = props;

        if (value == undefined) return null;
        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },
    {
      Header: "Tên",
      accessor: "first_name",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { value } = props;

        if (value == undefined) return null;

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },
    {
      Header: "SĐT",
      accessor: "phone_number",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { value } = props;
        return (
          <WrapperTableCell title={formatPhoneNumber(value)} loading={loading}>
            {formatPhoneNumber(value)}
          </WrapperTableCell>
        );
      },
    },
    {
      Header: "Email",
      accessor: "email",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { value } = props;
        return (
          <WrapperTableCell maxWidth={250} loading={loading}>
            {value}
          </WrapperTableCell>
        );
      },
    },

    {
      Header: "Vai trò",
      accessor: "groups",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { value } = props;

        return (
          <TableCellWithFetch<responseSchema<GROUPS_ITEM>> url={value}>
            {(data) => {
              const position = get(data, "results[0].name") || "-";

              return (
                <WrapperTableCell maxWidth={250} loading={loading}>
                  {position}
                </WrapperTableCell>
              );
            }}
          </TableCellWithFetch>
        );
      },
    },

    {
      Header: "Trạng thái",
      accessor: "is_active",
      textAlign: "center",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { cell } = props;
        const value = cell.value;

        return (
          <WrapperTableCell display="flex" justifyContent="center" loading={loading}>
            <CircleIcon color={value ? "primary2" : "primary"} />
          </WrapperTableCell>
        );
      },
    },

    {
      Header: "Ngày tạo",
      accessor: "date_joined",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { value } = props;

        if (value == undefined) return null;

        return (
          <WrapperTableCell loading={loading}>
            {formatDate(value, "dd/MM/yyyy")}
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

        const { hasPermission } = usePermission("write_admin");

        return (
          <ActionTableCell
            onViewHandler={onViewHandler}
            onDeleteHandler={hasPermission ? onDeleteHandler : undefined}
            column={column}
            row={row}
            loading={loading}
          />
        );
      },
    },
  ];
}

export default columns;
