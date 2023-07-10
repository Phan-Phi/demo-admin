import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import { CommonFilterTableProps } from "interfaces";
import { BoxWithShadow, FilterByTimeRange } from "components";
import { TabListingOrderHistoryFilterType } from "./TabListingOrderHistory";

type FilterProps = CommonFilterTableProps<TabListingOrderHistoryFilterType> & {};

const FilterTabListingOrderHistory = (props: FilterProps) => {
  const { filter, resetFilter, onDateEndChange, onDateStartChange, onFilterByTime } =
    props;
  return (
    <BoxWithShadow>
      <Stack divider={<Divider />} spacing={2}>
        <Box>
          <Typography fontWeight={700} marginBottom={1}>
            Ngày tạo
          </Typography>

          <FilterByTimeRange
            onDateStartChange={onDateStartChange}
            onDateEndChange={onDateEndChange}
            dateStart={filter.date_placed_start}
            dateEnd={filter.date_placed_end}
            onClickFilter={onFilterByTime}
          />
        </Box>

        <Box>
          <Button fullWidth variant="outlined" color="error" onClick={resetFilter}>
            Bỏ Lọc
          </Button>
        </Box>
      </Stack>
    </BoxWithShadow>
  );
};

export default FilterTabListingOrderHistory;
