import { PropsWithChildren } from "react";

import { Column, CellProps } from "react-table";

import { WrapperTableCell, ActionTableCell, TableCellForAvatar } from "components";
import { usePermission } from "hooks";

function columns<T extends Record<string, unknown> = {}>(loading?: boolean): Column<T>[] {
  return [
    {
      Header: "Ảnh Đại Diện",
      accessor: "icon_for_member",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { cell } = props;

        const value = cell.value;

        return <TableCellForAvatar src={value} loading={loading} />;
      },
    },
    {
      Header: "Tên Danh Mục",
      accessor: "name",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { value } = props;

        if (value == undefined) return null;

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
      colSpan: 1,
    },

    {
      Header: "Hành động",
      accessor: "",
      sticky: "right",
      colSpan: 3,
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { onDeleteHandler, onViewHandler, column, row } = props;

        const { hasPermission } = usePermission("write_store_category");

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
