import {
  Row,
  Column,
  useSortBy,
  TableInstance,
  usePagination,
  ColumnInstance,
} from "react-table";

import { useUpdateEffect } from "react-use";
import { useSticky } from "react-table-sticky";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { Stack } from "@mui/material";

import { transformUrl } from "libs";
import { Loading } from "components";
import { ResponseType } from "interfaces";
import { useTable, ExtendTableOptions, useFetch } from "hooks";
import CompoundTable, { Props as CompoundTableProps } from "./CompoundTable";

import Pagination from "./StatefulPagination";

type CompoundTablePropsWithoutPrepareRow<T extends Record<string, unknown>> = Omit<
  CompoundTableProps<T>,
  "prepareRow" | "tableInstance"
>;

export interface ExtendableTableInstanceProps<T extends Record<string, unknown> = {}>
  extends TableInstance<T> {
  mutate: () => void;
  setUrl: (newKey: string) => void;
}

interface Props<T extends Record<string, unknown>>
  extends CompoundTablePropsWithoutPrepareRow<T> {
  url?: string;
  columnFn: (loading?: boolean) => Column<T>[];
  passHandler?: (tableInstance: ExtendableTableInstanceProps<T>) => void;

  [key: string]: any;
}

export interface PropsForAction<T extends Record<string, unknown> = {}> {
  row: Row<T>;
  column: ColumnInstance<T>;
}

export default function CompoundTableWithFunction<T extends Record<string, unknown>>(
  props: Props<T>
) {
  const {
    columnFn,
    url: initUrl,
    passHandler: externalPassHandler,
    ...restProps
  } = props;
  const tableState = useRef<TableInstance<T>>();

  const pageRef = useRef<number>(1);
  const limitRef = useRef<number>(25);

  const { data, isLoading, fetchNextPage, fetchPreviousPage, changeKey, refreshData } =
    useFetch<
      T,
      ResponseType<T> & {
        count: number;
      }
    >(
      initUrl
        ? transformUrl(initUrl, {
            limit: limitRef.current,
            with_count: true,
          })
        : undefined
    );

  const columns = useMemo(() => columnFn(isLoading), [isLoading, columnFn]);

  const fetchData = useCallback(
    ({ pageSize, pageIndex }: { pageSize: number; pageIndex: number }) => {
      const currentPage = pageRef.current;

      if (pageIndex + 1 > currentPage) {
        fetchNextPage();
      } else if (pageIndex + 1 < currentPage) {
        fetchPreviousPage();
      }

      pageRef.current = pageIndex + 1;

      if (pageSize !== limitRef.current) {
        changeKey(
          transformUrl(initUrl, {
            limit: pageSize,
            with_count: true,
          })
        );
      }

      limitRef.current = pageSize;
    },
    [initUrl]
  );

  const setUrl = useCallback((newKey: string) => {
    pageRef.current = 1;
    changeKey(
      transformUrl(newKey, {
        with_count: true,
      })
    );
  }, []);

  useUpdateEffect(() => {
    if (externalPassHandler && tableState.current) {
      externalPassHandler({
        ...tableState.current,
        mutate: refreshData,
        setUrl,
      });
    }
  }, []);

  const passHandler = useCallback((tableInstance: TableInstance<T>) => {
    tableState.current = tableInstance;

    if (externalPassHandler) {
      externalPassHandler({
        ...tableInstance,
        mutate: refreshData,
        setUrl,
      });
    }
  }, []);

  if (data == undefined) {
    return (
      <Stack alignItems="center">
        <Loading />
      </Stack>
    );
  }

  return (
    <CustomTable<T>
      data={data}
      columns={columns}
      // totalCount={(previousRawData && previousRawData.count) || 0}
      passHandler={passHandler}
      initialState={{
        pageSize: limitRef.current,
        pageIndex: pageRef.current - 1,
      }}
      // pageCount={previousRawData && Math.ceil(previousRawData.count / limitRef.current)}
      fetchData={fetchData}
      {...restProps}
    />
  );
}

interface ExtendFunctionTableOptions<T extends Record<string, unknown>>
  extends ExtendTableOptions<T>,
    CompoundTablePropsWithoutPrepareRow<T> {
  passHandler?: (tableInstance: TableInstance<T>) => void;
  totalCount: number;
  fetchData: ({ pageSize, pageIndex }: { pageSize: number; pageIndex: number }) => void;
}

function CustomTable<T extends Record<string, unknown>>(
  props: ExtendFunctionTableOptions<T>
) {
  const {
    data,
    columns,
    fetchData,
    totalCount,
    TableProps,
    passHandler,
    initialState,
    bodyItemList,
    TableRowProps,
    TableCellProps,
    headerItemList,
    TableBodyProps,
    TableHeadProps,
    renderBodyItem,
    renderPagination,
    renderHeaderItem,
    TableContainerProps,
    renderHeaderContentForSelectedRow,
    ...restProps
  } = props;

  const tableInstance = useTable<T>({
    columns,
    data,
    hooks: [useSortBy, usePagination, useSticky],
    initialState,
    ...restProps,
  });

  useEffect(() => {
    passHandler?.(tableInstance);
  }, [tableInstance]);

  useUpdateEffect(() => {
    fetchData({
      pageIndex: tableInstance.state.pageIndex,
      pageSize: tableInstance.state.pageSize,
    });
  }, [fetchData, tableInstance.state.pageSize, tableInstance.state.pageIndex]);

  const renderpaginationCallback = useCallback(() => {
    return <Pagination tableInstance={tableInstance} totalCount={totalCount} />;
  }, [tableInstance, totalCount]);

  const { headerGroups, prepareRow, page } = tableInstance;

  return (
    <CompoundTable
      headerItemList={headerGroups}
      prepareRow={prepareRow}
      bodyItemList={page}
      renderPagination={renderpaginationCallback}
      TableBodyProps={TableBodyProps}
      TableCellProps={TableCellProps}
      TableContainerProps={TableContainerProps}
      TableHeadProps={TableHeadProps}
      TableProps={TableProps}
      TableRowProps={TableRowProps}
      renderBodyItem={renderBodyItem}
      renderHeaderItem={renderHeaderItem}
      tableInstance={tableInstance}
      renderHeaderContentForSelectedRow={renderHeaderContentForSelectedRow}
    />
  );
}
