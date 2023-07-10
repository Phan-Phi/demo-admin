import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import { BoxWithShadow, FilterByTimeRange } from "components";

import { CommonFilterTableProps } from "interfaces";
import { OrderHistoryWithDetailStoreFilterType } from "./OrderHistoryWithDetailStore";

type FilterProps = CommonFilterTableProps<OrderHistoryWithDetailStoreFilterType> & {};

const FilterTransactionHistoryWithDetailPartner = (props: FilterProps) => {
  const { filter, resetFilter, onDateEndChange, onDateStartChange, onFilterByTime } =
    props;

  return (
    <BoxWithShadow>
      <Stack divider={<Divider />} spacing={2}>
        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
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

export default FilterTransactionHistoryWithDetailPartner;
