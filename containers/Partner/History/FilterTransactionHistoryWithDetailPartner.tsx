import { Box, Button, Divider, Stack, Typography, MenuItem } from "@mui/material";

import { useChoice } from "hooks";
import { CommonFilterTableProps } from "interfaces";

import { BoxWithShadow, FilterByTimeRange, Select } from "components";
import { TransactionHistoryWithDetailPartnerFilterType } from "./TransactionHistoryWithDetailPartner";

type FilterProps =
  CommonFilterTableProps<TransactionHistoryWithDetailPartnerFilterType> & {
    onFilterSelect: (value: any) => void;
  };

const FilterTransactionHistoryWithDetailPartner = (props: FilterProps) => {
  const {
    onFilterSelect,
    resetFilter,
    onDateEndChange,
    onDateStartChange,
    filter,
    onFilterByTime,
  } = props;
  const { transaction_type } = useChoice();

  return (
    <BoxWithShadow>
      <Stack divider={<Divider />} spacing={2}>
        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
            Loại giao dịch
          </Typography>

          <Select
            renderItem={() => {
              return [["", "Tất cả"], ...transaction_type].map((el) => {
                return (
                  <MenuItem key={el[0]} value={el[0]}>
                    {el[1]}
                  </MenuItem>
                );
              });
            }}
            SelectProps={{
              onChange: (e) => {
                onFilterSelect(e.target.value);
              },
              value: filter.transaction_type,
            }}
          />
        </Box>
        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
            Ngày tạo
          </Typography>

          <FilterByTimeRange
            onDateStartChange={onDateStartChange}
            onDateEndChange={onDateEndChange}
            dateStart={filter.date_created_start}
            dateEnd={filter.date_created_end}
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
