import { Box, Stack, Button, Divider, MenuItem } from "@mui/material";

import { TIME_FRAME } from "constant";
import { CommonFilterTableProps } from "interfaces";

import { FilterByTimeRange, Select } from "components";
import { CustomerReportByTableFilterType } from "./CustomerReportByTable";

type FilterProps = CommonFilterTableProps<CustomerReportByTableFilterType> & {
  onTimeFrameChange: (value: any) => void;
};

const FilterTable = (props: FilterProps) => {
  const {
    onTimeFrameChange,
    filter,
    resetFilter,
    onDateEndChange,
    onDateStartChange,
    onFilterByTime,
  } = props;

  return (
    <Stack divider={<Divider />} spacing={2}>
      <Select
        renderItem={() => {
          return TIME_FRAME.map((el) => {
            return (
              <MenuItem key={el[0]} value={el[0]}>
                {el[1]}
              </MenuItem>
            );
          });
        }}
        SelectProps={{
          value: filter.date_start && filter.date_end ? "" : filter.timeFrame,
          onChange: (e) => {
            onTimeFrameChange(e.target.value);
          },
        }}
        label="Chọn thời gian"
      />

      <FilterByTimeRange
        onDateStartChange={onDateStartChange}
        onDateEndChange={onDateEndChange}
        dateStart={filter.date_start}
        dateEnd={filter.date_end}
        onClickFilter={onFilterByTime}
      />

      <Button variant="outlined" color="error" onClick={resetFilter}>
        Bỏ Lọc
      </Button>
    </Stack>
  );
};

export default FilterTable;
