import { PropsWithChildren } from "react";

import { Column, CellProps } from "react-table";

import { Image, WrapperTableCell, ActionTableCell } from "components";
import { usePermission } from "hooks";

function columns<T extends Record<string, unknown> = {}>(loading?: boolean): Column<T>[] {
  return [
    {
      Header: "Ảnh Đại Diện",
      accessor: "image",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { cell } = props;

        const value = cell.value;

        return (
          <WrapperTableCell loading={loading}>
            <Image width={60} height={60} src={value} alt="" />
          </WrapperTableCell>
        );
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
      colSpan: 3,
    },

    {
      Header: "Hành động",
      accessor: "",
      sticky: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { hasPermission } = usePermission("write_avatar_category");

        const { onDeleteHandler, onViewHandler, column, row } = props;

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
