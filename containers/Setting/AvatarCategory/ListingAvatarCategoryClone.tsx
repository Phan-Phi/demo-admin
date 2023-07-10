// import queryString from "query-string";
// import { useRouter } from "next/router";
// import React, { useCallback, useRef } from "react";

// import { Box, Grid, Stack } from "@mui/material";

// import {
//   Container,
//   Loading,
//   CompoundTableWithFunction,
//   type ExtendableTableInstanceProps,
//   type PropsForAction,
// } from "components";

// import { get } from "lodash";

// import IconButton from "components/Button/IconButton";
// import SearchField from "components/Filter/SearchField";

// import axios from "axios.config";
// import { PATHNAME } from "routes";
// import { transformUrl } from "libs";
// import { AVATARS_CATEGORIES } from "apis";
// import { AVATARS_CATEGORIES_ITEM } from "interfaces";
// import ListingAvatarCategoryColumn from "./ListingAvatarCategoryColumn";
// import {
//   useParams,
//   useConfirmation,
//   useNotification,
//   usePermission,
//   useGetHeightForTable,
// } from "hooks";
// import { SAFE_OFFSET } from "constant";

// const ListingAvatar = () => {
//   const router = useRouter();
//   const { onConfirm, onClose } = useConfirmation();
//   const { hasPermission } = usePermission("write_avatar_category");

//   const [ref, { height }] = useGetHeightForTable();

//   const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

//   const tableInstance = useRef<ExtendableTableInstanceProps<AVATARS_CATEGORIES_ITEM>>();

//   const { params, setParams } = useParams({
//     callback: (params) => {
//       if (tableInstance.current) {
//         const setUrl = tableInstance.current.setUrl;

//         setUrl(transformUrl(AVATARS_CATEGORIES, params));
//       }
//     },
//   });

//   const passHandler = useCallback(
//     (_tableInstance: ExtendableTableInstanceProps<AVATARS_CATEGORIES_ITEM>) => {
//       tableInstance.current = _tableInstance;
//     },
//     []
//   );
//   const onGotoHandler = useCallback(() => {
//     router.push(`${router.pathname}/${PATHNAME.TAO_MOI}`);
//   }, []);

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
//     (props: PropsForAction<AVATARS_CATEGORIES_ITEM>) => {
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
//     [router]
//   );

//   const onDeleteHandler = useCallback(
//     (props: PropsForAction<AVATARS_CATEGORIES_ITEM>) => {
//       const handler = async () => {
//         try {
//           const self = get(props, "row.original.self");

//           await axios.delete(self);

//           enqueueSnackbarWithSuccess("Xóa tài khoản thành công");

//           tableInstance.current && tableInstance.current.mutate();
//         } catch (err) {
//           enqueueSnackbarWithError(err);
//         } finally {
//           onClose();
//         }
//       };

//       const avatarName = get(props, "row.values.name");

//       const message = `Hãy xác nhận bạn muốn xóa tài khoản ${avatarName}, đây là hành động không thể hoàn tác`;

//       onConfirm(handler, {
//         message,
//       });
//     },
//     []
//   );

//   return (
//     <Container>
//       <Grid container>
//         <Grid item xs={12}>
//           <Stack spacing={3}>
//             <Stack
//               columnGap={3}
//               flexDirection="row"
//               alignItems="center"
//               justifyContent="center"
//             >
//               <Stack flexGrow={1}>
//                 <SearchField
//                   onChange={onFilterHandler("search")}
//                   initSearch={params?.search || ""}
//                 />
//               </Stack>

//               {hasPermission && <IconButton onClick={onGotoHandler} />}
//             </Stack>

//             <Box ref={ref}>
//               <CompoundTableWithFunction<AVATARS_CATEGORIES_ITEM>
//                 url={AVATARS_CATEGORIES}
//                 passHandler={passHandler}
//                 columnFn={ListingAvatarCategoryColumn}
//                 onDeleteHandler={onDeleteHandler}
//                 onViewHandler={onViewHandler}
//                 TableContainerProps={{
//                   sx: {
//                     maxHeight: height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom),
//                   },
//                 }}
//               />
//             </Box>
//           </Stack>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default ListingAvatar;
export {};
