// import queryString from "query-string";
// import { useRouter } from "next/router";
// import React, { useCallback, useRef } from "react";
// import { isPossiblePhoneNumber } from "react-phone-number-input";

// import { Box, Grid, Stack } from "@mui/material";

// import get from "lodash/get";

// import IconButton from "components/Button/IconButton";
// import SearchField from "components/Filter/SearchField";

// import {
//   Container,
//   Loading,
//   CompoundTableWithFunction,
//   type ExtendableTableInstanceProps,
//   type PropsForAction,
// } from "components";

// import { ADMINS } from "apis";
// import axios from "axios.config";
// import { PATHNAME } from "routes";
// import { transformUrl } from "libs";
// import AdminColumn from "./AdminColumn";
// import { ADMINS_ITEM } from "interfaces";
// import {
//   useParams,
//   useConfirmation,
//   useNotification,
//   usePermission,
//   useGetHeightForTable,
// } from "hooks";

// // import FilterAdmin from "./FilterAdmin";
// import { Sticky } from "hocs";
// import { SAFE_OFFSET } from "constant";
// import FilterAdmin from "./FilterAdminClone";
// import useSWR from "swr";

// const ListingSettingUser = () => {
//   const router = useRouter();
//   const { onConfirm, onClose } = useConfirmation();

//   const [ref, { height }] = useGetHeightForTable();

//   const { hasPermission } = usePermission("write_admin");

//   const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

//   const tableInstance = useRef<ExtendableTableInstanceProps<ADMINS_ITEM>>();

//   const { params, setParams, resetParams } = useParams({
//     callback: (params) => {
//       if (tableInstance.current) {
//         // const url = tableInstance.current.url;
//         const setUrl = tableInstance.current.setUrl;

//         setUrl(transformUrl(ADMINS, params));
//       }
//     },
//   });

//   const { data } = useSWR("/admin/groups/4/");

//   const passHandler = useCallback(
//     (_tableInstance: ExtendableTableInstanceProps<ADMINS_ITEM>) => {
//       tableInstance.current = _tableInstance;
//     },
//     []
//   );

//   const onGotoHandler = useCallback(() => {
//     router.push(`${router.pathname}/${PATHNAME.TAO_MOI}`);
//   }, [router]);

//   const onFilterHandler = useCallback((key) => {
//     return (value: any) => {
//       if (tableInstance.current) {
//         const { pageSize } = tableInstance.current.state;

//         if (key === "search") {
//           if (value && isPossiblePhoneNumber(value.toString(), "VN")) {
//             value = parseInt(value.toString().replaceAll(" ", ""));
//           }
//         }

//         setParams({
//           with_count: true,
//           limit: pageSize,
//           [key]: value,
//           offset: 0,
//         });
//       }
//     };
//   }, []);

//   const onViewHandler = useCallback((props: PropsForAction<ADMINS_ITEM>) => {
//     const { row } = props;

//     const self = get(row, "original.self");

//     const id = self
//       .split("/")
//       .filter((el: string) => {
//         return el !== "";
//       })
//       .pop();

//     const { url } = queryString.parseUrl(router.asPath);

//     router.push(`${url}/${id}`);
//   }, []);

//   const onDeleteHandler = useCallback((props: PropsForAction<ADMINS_ITEM>) => {
//     const handler = async () => {
//       try {
//         const self = get(props, "row.original.self");

//         await axios.delete(self);

//         enqueueSnackbarWithSuccess("Xóa người dùng thành công");

//         if (tableInstance.current) {
//           tableInstance.current.mutate();
//         }
//       } catch (err) {
//         enqueueSnackbarWithError(err);
//       } finally {
//         onClose();
//       }
//     };

//     const firstName = get(props, "row.original.first_name");

//     const message = `Hãy xác nhận bạn muốn xóa tài khoản ${firstName}, đây là hành động không thể hoàn tác`;

//     onConfirm(handler, {
//       message,
//     });
//   }, []);

//   return (
//     <Container>
//       <Grid container>
//         <Grid item xs={3}>
//           <FilterAdmin
//             {...{
//               params,
//               resetParams,
//               onFilterHandler,
//             }}
//           />
//         </Grid>
//         <Grid item xs={9}>
//           <Sticky>
//             <Stack spacing={3}>
//               <Stack
//                 columnGap={3}
//                 flexDirection="row"
//                 alignItems="center"
//                 justifyContent="center"
//               >
//                 <Stack flexGrow={1}>
//                   <SearchField
//                     onChange={onFilterHandler("search")}
//                     initSearch={params?.search || ""}
//                   />
//                 </Stack>

//                 {hasPermission && <IconButton onClick={onGotoHandler} />}
//               </Stack>

//               <Box ref={ref}>
//                 <CompoundTableWithFunction<ADMINS_ITEM>
//                   url={ADMINS}
//                   passHandler={passHandler}
//                   columnFn={AdminColumn}
//                   onDeleteHandler={onDeleteHandler}
//                   onViewHandler={onViewHandler}
//                   TableContainerProps={{
//                     sx: {
//                       maxHeight: height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom),
//                     },
//                   }}
//                 />
//               </Box>
//             </Stack>
//           </Sticky>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default ListingSettingUser;
export {};
