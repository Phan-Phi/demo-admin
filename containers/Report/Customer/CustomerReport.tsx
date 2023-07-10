import dynamic from "next/dynamic";
import React, { useCallback, useState } from "react";

import { Grid } from "@mui/material";

import { ConvertTimeFrameType } from "libs/dateUtils";
import { ChoiceItem, CUSTOMERS_ITEM } from "interfaces";

import CustomerReportByTable from "./CustomerReportByTable";
import { TabPanel, Container, Tabs, Loading, BoxWithShadow } from "components";
import FilterCustomer from "./FilterCustomer";

const CustomerReportChartByRegion = dynamic(
  () => import("./CustomerReportChartByRegion"),
  {
    loading: Loading,
  }
);

const CustomerReportChartByOrder = dynamic(() => import("./CustomerReportChartByOrder"), {
  loading: Loading,
});

const CustomerReportChartByFrequently = dynamic(
  () => import("./CustomerReportChartByFrequently"),
  {
    loading: Loading,
  }
);

const TAB_PANEL_DATA = [
  { id: 0, title: "Tổng quan" },
  { id: 1, title: "Khu vực" },
  { id: 2, title: "Hành vi khách hàng" },
  { id: 3, title: "Tần suất" },
];

const initState: IFilterProps = {
  timeFrame: "this_week",
  province: null,
  date_start: null,
  date_end: null,
  customer: null,
};

export interface IFilterProps {
  timeFrame: ConvertTimeFrameType;
  date_start: number | null;
  date_end: number | null;
  province: ChoiceItem | null;
  customer: CUSTOMERS_ITEM | null;
}

const CustomerReport = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const [filter, setFilter] = useState<IFilterProps>(initState);

  const onChangeTabHandler = useCallback((e: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  }, []);

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
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <Tabs data={TAB_PANEL_DATA} onChange={onChangeTabHandler} value={currentTab} />
        </Grid>

        {currentTab === 0 ? null : (
          <Grid item xs={3}>
            <BoxWithShadow>
              <FilterCustomer
                {...{
                  filter,
                  onChange: onFilterHandler,
                  isShowProvince: currentTab === 1 ? true : false,
                  isShowCustomer: currentTab === 3 ? true : false,
                  onResetHandler,
                }}
              />
            </BoxWithShadow>
          </Grid>
        )}

        <Grid item xs={currentTab === 0 ? 12 : 9}>
          <TabPanel value={currentTab} index={0}>
            <CustomerReportByTable />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <CustomerReportChartByRegion filter={filter} />
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <CustomerReportChartByOrder filter={filter} />
          </TabPanel>

          <TabPanel value={currentTab} index={3}>
            <CustomerReportChartByFrequently filter={filter} />
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerReport;
