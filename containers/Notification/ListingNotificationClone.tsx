// import queryString from "query-string";
// import { useRouter } from "next/router";
// import React, { useCallback, useRef } from "react";

// import { Box, Grid, Stack } from "@mui/material";

// import {
//   Container,
//   CompoundTableWithFunction,
//   type ExtendableTableInstanceProps,
//   type PropsForAction,
// } from "components";

// import { get } from "lodash";

// import IconButton from "components/Button/IconButton";
// import SearchField from "components/Filter/SearchField";

// import { PATHNAME } from "routes";
// import { transformUrl } from "libs";
// import { NOTIFICATIONS_FILE_NOTIFICATIONS } from "apis";
// import { NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM } from "interfaces";
// import {
//   useParams,
//   useConfirmation,
//   useNotification,
//   usePermission,
//   useGetHeightForTable,
// } from "hooks";

// import axios from "axios.config";
// import NotificationColumn from "./NotificationColumn";
// import FilterNotification from "./FilterNotification";
// import { Sticky } from "hocs";
// import { SAFE_OFFSET } from "constant";

// const ListingNotification = () => {
//   const router = useRouter();
//   const { onConfirm, onClose } = useConfirmation();

//   const [ref, { height }] = useGetHeightForTable();

//   const { hasPermission } = usePermission("write_notification");

//   const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

//   const tableInstance =
//     useRef<ExtendableTableInstanceProps<NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM>>();

//   const { params, setParams, resetParams } = useParams({
//     callback: (params) => {
//       if (tableInstance.current) {
//         const setUrl = tableInstance.current.setUrl;

//         setUrl(transformUrl(NOTIFICATIONS_FILE_NOTIFICATIONS, params));
//       }
//     },
//   });

//   const passHandler = useCallback(
//     (
//       _tableInstance: ExtendableTableInstanceProps<NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM>
//     ) => {
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

//         setParams({
//           with_count: true,
//           limit: pageSize,
//           [key]: value,
//           offset: 0,
//         });
//       }
//     };
//   }, []);

//   const onViewHandler = useCallback(
//     (props: PropsForAction<NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM>) => {
//       const { row } = props;

//       const self = get(row, "original.self");

//       const id = self
//         .split("/")
//         .filter((el: string) => {
//           return el !== "";
//         })
//         .pop();

//       const { url } = queryString.parseUrl(router.asPath);

//       router.push(`${url}/${id}`);
//     },
//     []
//   );

//   const onDeleteHandler = useCallback(
//     (props: PropsForAction<NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM>) => {
//       const handler = async () => {
//         try {
//           const self = get(props, "row.original.self");

//           await axios.delete(self);

//           enqueueSnackbarWithSuccess("Xóa thông báo thành công");

//           if (tableInstance.current) {
//             tableInstance.current.mutate();
//           }
//         } catch (err) {
//           enqueueSnackbarWithError(err);
//         } finally {
//           onClose();
//         }
//       };

//       const title = get(props, "row.original.title");
//       const message = `Hãy xác nhận bạn muốn xóa thông báo ${title}, đây là hành động không thể hoàn tác`;

//       onConfirm(handler, {
//         message,
//       });
//     },
//     []
//   );

//   return (
//     <Container>
//       <Grid container>
//         <Grid item xs={3}>
//           <FilterNotification
//             {...{
//               onFilterHandler,
//               params,
//               resetParams,
//             }}
//           />
//         </Grid>
//         <Grid item xs={9}>
//           <Sticky>
//             <Stack spacing={3}>
//               <Stack
//                 columnGap={3}
//                 flexDirection="row"
//                 justifyContent="center"
//                 alignItems="center"
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
//                 <CompoundTableWithFunction<NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM>
//                   url={NOTIFICATIONS_FILE_NOTIFICATIONS}
//                   passHandler={passHandler}
//                   columnFn={NotificationColumn}
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

// export default ListingNotification;
export {};
