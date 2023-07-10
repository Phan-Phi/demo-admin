import { PropsWithChildren } from "react";

import { Column, CellProps } from "react-table";

import { WrapperTableCell, ActionTableCell, Image } from "components";

import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { useChoice, usePermission } from "hooks";

function columns<T extends Record<string, unknown> = {}>(loading?: boolean): Column<T>[] {
  return [
    {
      Header: "Banner",
      accessor: "banner",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { value } = props;
        return (
          <WrapperTableCell loading={loading}>
            <Image width={60} height={60} src={value} alt="" />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: "Tiêu Đề",
      accessor: "title",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { cell } = props;

        const value = cell.value;

        if (value) {
          return (
            <WrapperTableCell title={value} loading={loading}>
              {value}
            </WrapperTableCell>
          );
        } else {
          return null;
        }
      },
      maxWidth: 300,
    },

    {
      Header: "Vị Trí",
      accessor: "position",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { cell } = props;

        const choice = useChoice();

        const { positions } = choice;

        const value = getDisplayValueFromChoiceItem(positions, cell.value[0]);

        const displayValueList = cell.value.map((el: string) => {
          return getDisplayValueFromChoiceItem(positions, el);
        });

        return (
          <WrapperTableCell title={value} loading={loading}>
            {displayValueList.join(", ")}
          </WrapperTableCell>
        );
      },
    },

    {
      Header: "Đối Tượng",
      accessor: "app_type",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const choice = useChoice();
        const { cell } = props;
        const { app_type } = choice;

        const value = getDisplayValueFromChoiceItem(app_type, cell.value[0]);
        if (value) {
          return (
            <WrapperTableCell justifyContent="left" loading={loading}>
              {value}
            </WrapperTableCell>
          );
        } else {
          return null;
        }
      },
    },

    {
      Header: "Độ Ưu Tiên",
      accessor: "sort_order",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { cell } = props;

        const value = cell.value || "-";

        return (
          <WrapperTableCell display="flex" justifyContent="flex-end" loading={loading}>
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

        const { hasPermission } = usePermission("write_advertisement");

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
