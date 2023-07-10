// import {
//   Box,
//   Button,
//   Divider,
//   MenuItem,
//   Skeleton,
//   Stack,
//   Typography,
// } from "@mui/material";
// import { GROUPS } from "apis";
// import { BoxWithShadow, FilterByTimeRange, Select } from "components";
// import { GROUPS_ITEM, responseSchema } from "interfaces";
// import { transformUrl } from "libs";
// import React, { useMemo } from "react";
// import useSWR from "swr";

// interface FilterProps {
//   params: Record<string, any>;
//   resetParams: () => void;
//   onFilterHandler: (key: string) => (value: any) => void;
// }

// const FilterAdmin = (props: FilterProps) => {
//   const { params, onFilterHandler, resetParams } = props;

//   const { data: groupData } = useSWR<responseSchema<GROUPS_ITEM>>(
//     transformUrl(GROUPS, {
//       get_all: true,
//     })
//   );

//   const renderPosition = useMemo(() => {
//     if (groupData == undefined) {
//       return (
//         <Stack spacing={2}>
//           <Skeleton width={"50%"} height={24} />
//           <Skeleton height={24} />
//         </Stack>
//       );
//     }

//     return (
//       <Box>
//         <Typography variant="h3" fontWeight={700} marginBottom={1}>
//           Nhân sự
//         </Typography>

//         <Select
//           SelectProps={{
//             value: params?.group || "",
//             onChange: (e) => {
//               onFilterHandler("group")(e.target.value);
//             },
//           }}
//           renderItem={() => {
//             return [{ name: "Tất cả", self: "" }, ...groupData.results].map((el) => {
//               return (
//                 <MenuItem key={el.self} value={el.self}>
//                   {el.name}
//                 </MenuItem>
//               );
//             });
//           }}
//         />
//       </Box>
//     );
//   }, [groupData, params]);

//   return (
//     <BoxWithShadow>
//       <Stack divider={<Divider />} spacing={2}>
//         {renderPosition}

//         <Box>
//           <Typography variant="h3" fontWeight={700} marginBottom={1}>
//             Ngày tạo
//           </Typography>

//           <FilterByTimeRange
//             onChangeDateStart={onFilterHandler("date_joined_start")}
//             onChangeDateEnd={onFilterHandler("date_joined_end")}
//             initDateStart={params?.date_joined_start || null}
//             initDateEnd={params?.date_joined_end || null}
//           />
//         </Box>

//         <Box>
//           <Button fullWidth variant="outlined" color="error" onClick={resetParams}>
//             Bỏ Lọc
//           </Button>
//         </Box>
//       </Stack>
//     </BoxWithShadow>
//   );
// };

// export default FilterAdmin;
export {};
