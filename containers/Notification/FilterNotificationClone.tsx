// import React from "react";
// import { Box, Button, Divider, MenuItem, Stack, Typography } from "@mui/material";

// import { useChoice } from "hooks";
// import { BoxWithShadow, FilterByTimeRange, Select } from "components";

// interface FilterProps {
//   params: Record<string, any>;
//   resetParams: () => void;
//   onFilterHandler: (key: string) => (value: any) => void;
// }

// const Filter = (props: FilterProps) => {
//   const { params, onFilterHandler, resetParams } = props;

//   const { app_type } = useChoice();

//   return (
//     <BoxWithShadow>
//       <Stack divider={<Divider />} spacing={2}>
//         <Box>
//           <Typography variant="h3" fontWeight={700} marginBottom={1}>
//             Đối tượng
//           </Typography>

//           <Select
//             renderItem={() => {
//               return [["", "Tất cả"], ...app_type].map((el) => {
//                 return (
//                   <MenuItem key={el[0]} value={el[0]}>
//                     {el[1]}
//                   </MenuItem>
//                 );
//               });
//             }}
//             SelectProps={{
//               onChange: (e) => {
//                 onFilterHandler("app_type")(e.target.value);
//               },
//               value: params?.app_type || "",
//             }}
//           />
//         </Box>

//         <Box>
//           <Typography variant="h3" fontWeight={700} marginBottom={1}>
//             Ngày tạo
//           </Typography>

//           <FilterByTimeRange
//             onChangeDateStart={onFilterHandler("date_created_start")}
//             onChangeDateEnd={onFilterHandler("date_created_end")}
//             initDateStart={params?.date_created_start || null}
//             initDateEnd={params?.date_created_end || null}
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

// export default Filter;
export {};
