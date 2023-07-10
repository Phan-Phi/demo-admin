import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { Box, Grid, Stack } from "@mui/material";

import { BoxWithShadow, Loading } from "components";
import BranchChartByRegion from "./BranchChartByRegion";

import { ChoiceItem } from "interfaces";
import { ConvertTimeFrameType } from "libs/dateUtils";
import FilterRegion from "./FilterRegion";

const StoreChartByRegion = dynamic(() => import("./StoreChartByRegion"), {
  loading: Loading,
});

export interface IFilterProps {
  timeFrame: ConvertTimeFrameType;
  date_start: number | null;
  date_end: number | null;
  province: ChoiceItem | null;
}

const initState: IFilterProps = {
  timeFrame: "this_week",
  province: null,
  date_start: null,
  date_end: null,
};

const PartnerReportByChart = () => {
  const [filter, setFilter] = useState<IFilterProps>(initState);

  const onFilterHandler = useCallback((key: string) => {
    return (value: any) => {
      setFilter((prev) => {
        return {
          ...prev,
          [key]: value,
        };
      });
    };
  }, []);

  const onResetHandler = useCallback(() => {
    setFilter(initState);
  }, []);

  return (
    <Grid container>
      <Grid item xs={3}>
        <BoxWithShadow>
          <FilterRegion
            {...{
              filter,
              onChange: onFilterHandler,
              onResetHandler,
            }}
          />
        </BoxWithShadow>
      </Grid>

      <Grid item xs={9}>
        <Stack alignItems="center" columnGap={3}>
          <Box width="100%">
            <StoreChartByRegion filter={filter} />
          </Box>
          <Box width="100%">
            <BranchChartByRegion filter={filter} />
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default PartnerReportByChart;
