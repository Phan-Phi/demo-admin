import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useSortBy, useTable } from "react-table";

import { get } from "lodash";
import { Box } from "@mui/material";

import { useChoice, usePermission } from "hooks";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { POINTNOTES_ITEM, CommonTableProps } from "interfaces";

import {
  ActionTableCell,
  Link,
  NumberFormat,
  RenderBody,
  RenderHeader,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  WrapperTableCell,
} from "components";

type PointNoteTableProps = CommonTableProps<POINTNOTES_ITEM> & Record<string, any>;

const PointNoteTable = (props: PointNoteTableProps) => {
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
        Header: "Tên Đối Tác",
        accessor: "owner_name",
        Cell: (props: PropsWithChildren<CellProps<POINTNOTES_ITEM, any>>) => {
          const { hasPermission } = usePermission("read_merchant");

          const { cell, onGotoHandler, row, column } = props;

          const value = cell.value;

          return (
            <WrapperTableCell title={value}>
              {hasPermission ? (
                <Link
                  href="#"
                  onClick={onGotoHandler({
                    row,
                    column,
                  })}
                >
                  {value}
                </Link>
              ) : (
                value
              )}
            </WrapperTableCell>
          );
        },
        colSpan: 2,
      },
      {
        Header: "Số Điểm",
        accessor: "point_amount",
        textAlign: "right",
        minWidth: 100,
        Cell: (props: PropsWithChildren<CellProps<POINTNOTES_ITEM, any>>) => {
          const { cell, row } = props;

          const flowType = get(row, "original.flow_type");

          const value = cell.value;

          return (
            <WrapperTableCell title={value}>
              <NumberFormat
                value={value}
                prefix={flowType === "Point_To_Cash" ? "-" : "+"}
              />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Loại Yêu Cầu",
        accessor: "flow_type",
        Cell: (props: PropsWithChildren<CellProps<POINTNOTES_ITEM, any>>) => {
          const { point_note_flow_types } = useChoice();

          const { cell } = props;

          const value = cell.value;

          const displayValue =
            getDisplayValueFromChoiceItem(point_note_flow_types, value) ?? "-";

          return <WrapperTableCell title={displayValue}>{displayValue}</WrapperTableCell>;
        },
      },
      {
        Header: "Trạng Thái",
        accessor: "status",
        minWidth: 100,
        Cell: (props: PropsWithChildren<CellProps<POINTNOTES_ITEM, any>>) => {
          const { point_note_statuses } = useChoice();

          const { cell } = props;

          const value = cell.value;

          const displayValue =
            getDisplayValueFromChoiceItem(point_note_statuses, value) ?? "-";

          return (
            <WrapperTableCell
              title={displayValue}
              color={value === "Confirmed" ? "primary2.main" : "primary.main"}
            >
              {displayValue}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Ngày Tạo",
        accessor: "date_placed",
        textAlign: "center",
        Cell: (props: PropsWithChildren<CellProps<POINTNOTES_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return <WrapperTableCell>{formatDate(value, "dd/MM/yyyy")}</WrapperTableCell>;
        },
      },
      {
        Header: "Người duyệt",
        accessor: "reviewer_name",
        Cell: (props: PropsWithChildren<CellProps<POINTNOTES_ITEM, any>>) => {
          const { cell } = props;

          const value = cell.value;

          return <WrapperTableCell>{value || "-"}</WrapperTableCell>;
        },
      },
      {
        Header: "Hành động",
        accessor: "",
        sticky: "right",
        Cell: (props: PropsWithChildren<CellProps<POINTNOTES_ITEM, any>>) => {
          const { onDeleteHandler, onViewHandler, column, row } = props;

          return (
            <ActionTableCell
              onViewHandler={onViewHandler}
              onDeleteHandler={onDeleteHandler}
              column={column}
              row={row}
            />
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

export default PointNoteTable;
