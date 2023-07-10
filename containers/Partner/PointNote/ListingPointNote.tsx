import queryString from "query-string";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";

import { cloneDeep, get, set } from "lodash";
import { Box, Grid, Stack } from "@mui/material";

import PointNoteTable from "./PointNoteTable";
import SearchField from "components/Filter/SearchField";
import FilterListingPointNote from "./FilterListingPointNote";
import { Container, type PropsForAction, WrapperTable } from "components";

import { Sticky } from "hocs";
import { POINTNOTES } from "apis";
import { PATHNAME } from "routes";
import { SAFE_OFFSET } from "constant";
import { POINTNOTES_ITEM } from "interfaces";
import { useFetch, useGetHeightForTable } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";

export type ListingPointNoteFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  search?: string;
  date_placed_start: Date | null;
  date_placed_end: Date | null;
  flow_type: string;
  status: string;
};

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
  date_placed_start: null,
  date_placed_end: null,
  flow_type: "",
  status: "",
};

const ListingPointNote = () => {
  const router = useRouter();

  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, itemCount, isLoading, changeKey } = useFetch<POINTNOTES_ITEM>(
    transformUrl(POINTNOTES, filter)
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (["date_placed_start", "date_placed_end"].includes(key)) return;

        const params = cloneDeep(cloneFilter);

        changeKey(transformUrl(POINTNOTES, params));
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    let dateStart: any = get(filter, "date_placed_start");
    let dateEnd: any = get(filter, "date_placed_end");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    changeKey(
      transformUrl(POINTNOTES, {
        ...cloneFilter,
        date_placed_start: dateStart,
        date_placed_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(POINTNOTES, defaultFilterValue));
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  const onViewHandler = useCallback((props: PropsForAction<POINTNOTES_ITEM>) => {
    const { row } = props;

    const self = get(row, "original.self");

    const id = self
      .split("/")
      .filter((el: string) => {
        return el !== "";
      })
      .pop();

    const { url } = queryString.parseUrl(router.asPath);

    window.open(`${url}/${id}`, "_blank");
  }, []);

  const onGotoHandler = useCallback((props: PropsForAction<POINTNOTES_ITEM>) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault();

      const { row } = props;

      const self = get(row, "original.owner");

      const id = self
        .split("/")
        .filter((el: string) => {
          return el !== "";
        })
        .pop();

      window.open(`/${PATHNAME.DOI_TAC}/${PATHNAME.TAI_KHOAN}/${id}`, "_blank");
    };
  }, []);

  return (
    <Container>
      <Grid container>
        <Grid item xs={3}>
          <FilterListingPointNote
            filter={filter}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onDateStartChange={onFilterChangeHandler("date_placed_start")}
            onDateEndChange={onFilterChangeHandler("date_placed_end")}
            onFilterFlowType={onFilterChangeHandler("flow_type")}
            onFilterStatus={onFilterChangeHandler("status")}
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
                  <PointNoteTable
                    data={data ?? []}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
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
      </Grid>
    </Container>
  );
};

export default ListingPointNote;
