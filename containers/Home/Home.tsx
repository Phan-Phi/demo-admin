import { cloneDeep, get } from "lodash";
import { Box, Grid, Stack } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";

import { Container, SearchField, WrapperTable } from "components";

import Filter from "./Filter";
import { Sticky } from "hocs";
import { AUDITLOGS } from "apis";
import HomeTable from "./HomeTable";
import { SAFE_OFFSET } from "constant";
import { AUDITLOGS_ITEM } from "interfaces";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { useFetch, useGetHeightForTable } from "hooks";

export type HomeFilterType = {
  limit: number;
  with_count: boolean;
  offset: number;
  search?: string;
  action: string;
  date_created_start: Date | null;
  date_created_end: Date | null;
};

const defaultFilterValue: HomeFilterType = {
  limit: 25,
  with_count: true,
  offset: 0,
  search: "",
  action: "",
  date_created_end: null,
  date_created_start: null,
};

const Home = () => {
  const [ref, { height }] = useGetHeightForTable();

  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, resData } = useFetch<AUDITLOGS_ITEM>(
    transformUrl(AUDITLOGS, filter)
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (["date_created_start", "date_created_end"].includes(key)) return;

        changeKey(transformUrl(AUDITLOGS, cloneFilter));
      };
    },
    [filter]
  );

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(AUDITLOGS, defaultFilterValue));
  }, [filter]);

  const onClickFilterByTime = useCallback(() => {
    let dateStart: any = get(filter, "date_created_start");
    let dateEnd: any = get(filter, "date_created_end");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    changeKey(
      transformUrl(AUDITLOGS, {
        ...filter,
        date_created_start: dateStart,
        date_created_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  return (
    <Container>
      <Grid container>
        <Grid item xs={3}>
          <Filter
            filter={filter}
            resetFilter={resetFilterHandler}
            onDateStartChange={onFilterChangeHandler("date_created_start")}
            onDateEndChange={onFilterChangeHandler("date_created_end")}
            onChangeActionHandler={onFilterChangeHandler("action")}
            onFilterByTime={onClickFilterByTime}
          />
        </Grid>
        <Grid item xs={9}>
          <Sticky>
            <Stack spacing={3}>
              <SearchField onChange={onFilterChangeHandler("search")} />
              <WrapperTable>
                <Box ref={ref}>
                  <HomeTable
                    data={data ?? []}
                    count={itemCount}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    pagination={pagination}
                    maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
                    isLoading={isLoading}
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

export default Home;
