import { millisecondsToSeconds } from "date-fns";
import React, { useCallback, useState } from "react";
import {
  Box,
  Stack,
  Button,
  Divider,
  MenuItem,
  Typography,
  FormControl,
} from "@mui/material";

import { CUSTOMERS } from "apis";
import { TIME_FRAME } from "constant";
import { CUSTOMERS_ITEM } from "interfaces";
import {
  DatePicker,
  FormLabel,
  Select,
  LazyAutocomplete,
  ProvinceFilter,
} from "components";

interface FilterProps {
  filter: Record<string, any>;
  onChange: (key: string) => (value: any) => void;
  onResetHandler: () => void;
  isShowCustomer?: boolean;
}

interface DateObjProps {
  date_start: Date | null;
  date_end: Date | null;
}

const FilterCustomer = (props: FilterProps) => {
  const { filter, onChange, isShowCustomer } = props;

  const [dateObj, setDateObj] = useState<DateObjProps>({
    date_start: null,
    date_end: new Date(),
  });

  const [isReady, setIsReady] = useState(true);

  const onResethandler = useCallback(() => {
    props.onResetHandler();

    setDateObj({
      date_start: null,
      date_end: null,
    });

    setIsReady(false);

    setTimeout(() => {
      setIsReady(true);
    }, 0);
  }, [props]);

  const onFilterHandler = useCallback((dateObj: DateObjProps) => {
    return () => {
      const { date_start, date_end } = dateObj;

      onChange("timeFrame")("");

      if (date_start) {
        onChange("date_start")(millisecondsToSeconds(date_start.getTime()));
      }

      if (date_end) {
        onChange("date_end")(millisecondsToSeconds(date_end.getTime()));
      }
    };
  }, []);

  if (!isReady) return null;

  return (
    <Stack divider={<Divider />} spacing={2}>
      {isShowCustomer && (
        <Box>
          <Typography fontWeight={700} marginBottom={1}>
            Khách hàng
          </Typography>

          <LazyAutocomplete<{}, CUSTOMERS_ITEM>
            {...{
              url: CUSTOMERS,
              placeholder: "Khách hàng",
              AutocompleteProps: {
                renderOption(props, option) {
                  return (
                    <MenuItem {...props} key={option.self} value={option.self}>
                      {option.email}
                    </MenuItem>
                  );
                },
                getOptionLabel: (option) => {
                  return option.email;
                },
                isOptionEqualToValue: (option, value) => {
                  return option?.["self"] === value?.["self"];
                },
                onChange: (e, value) => {
                  onChange("customer")(value || null);
                },
              },
              initValue: filter?.customer || null,
            }}
          />
        </Box>
      )}
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
          value: filter["timeFrame"],
          onChange: (e) => {
            onChange("timeFrame")(e.target.value);
            onChange("date_start")(null);
            onChange("date_end")(null);

            setDateObj({
              date_start: null,
              date_end: null,
            });
          },
        }}
        label="Chọn thời gian"
      />
      <FormControl>
        <FormLabel>Từ ngày</FormLabel>

        <DatePicker
          value={dateObj.date_start}
          onChange={(value) => {
            if (value instanceof Date) {
              setDateObj((prev) => {
                return {
                  ...prev,
                  date_start: value,
                };
              });
            }
          }}
          DatePickerProps={{
            maxDate: new Date(),
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Đến ngày</FormLabel>
        <DatePicker
          value={dateObj.date_end}
          onChange={(value) => {
            if (value instanceof Date) {
              setDateObj((prev) => {
                return {
                  ...prev,
                  date_end: value,
                };
              });
            }
          }}
          DatePickerProps={{
            maxDate: new Date(),
            minDate: filter.date_start,
          }}
        />
      </FormControl>
      <Button
        disabled={!dateObj.date_start || !dateObj.date_end}
        onClick={onFilterHandler(dateObj)}
      >
        Lọc
      </Button>
      <ProvinceFilter value={filter["province"]} onChange={onChange("province")} />
      <Button variant="outlined" color="error" onClick={onResethandler}>
        Bỏ Lọc
      </Button>
    </Stack>
  );
};

export default FilterCustomer;
