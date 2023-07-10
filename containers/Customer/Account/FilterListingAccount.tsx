import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import { CommonFilterTableProps } from "interfaces";
import { ListingAccountFilterType } from "./ListingAccount";
import { BoxWithShadow, FilterByTimeRange, Radio, RadioItem } from "components";

const ACTIVE_DATA = [
  { title: "Tất cả", value: "" },
  { title: "Kích hoạt", value: "true" },
  { title: "Chưa kích hoạt", value: "false" },
];

type FilterProps = CommonFilterTableProps<ListingAccountFilterType> & {
  onActiveChange: (value: any) => void;
};

const FilterListingAccount = (props: FilterProps) => {
  const {
    onActiveChange,
    filter,
    resetFilter,
    onFilterByTime,
    onDateEndChange,
    onDateStartChange,
  } = props;

  return (
    <BoxWithShadow>
      <Stack divider={<Divider />} spacing={2}>
        <Box>
          <Typography fontWeight={700} marginBottom={1}>
            Trạng thái
          </Typography>

          <Radio
            RadioGroupProps={{
              value: filter.is_active,
              onChange(event, value) {
                onActiveChange(value);
              },
            }}
            renderItem={() => {
              return ACTIVE_DATA.map((el) => {
                return (
                  <RadioItem
                    label={el.title}
                    key={el.value}
                    RadioProps={{
                      value: el.value,
                    }}
                  />
                );
              });
            }}
          />
        </Box>

        <Box>
          <Typography fontWeight={700} marginBottom={1}>
            Ngày tạo
          </Typography>

          <FilterByTimeRange
            onDateStartChange={onDateStartChange}
            onDateEndChange={onDateEndChange}
            dateStart={filter.date_joined_start}
            dateEnd={filter.date_joined_end}
            onClickFilter={onFilterByTime}
          />
        </Box>

        <Box>
          <Button fullWidth variant="outlined" color="error" onClick={resetFilter}>
            {"Bỏ Lọc"}
          </Button>
        </Box>
      </Stack>
    </BoxWithShadow>
  );
};

export default FilterListingAccount;
