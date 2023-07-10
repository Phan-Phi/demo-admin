// import queryString from "query-string";
// import { useRouter } from "next/router";
// import React, { useCallback, useRef } from "react";

// import { Box, Grid, Stack } from "@mui/material";

// import get from "lodash/get";

// import {
//   Container,
//   Loading,
//   CompoundTableWithFunction,
//   type ExtendableTableInstanceProps,
//   type PropsForAction,
// } from "components";

// import SearchField from "components/Filter/SearchField";
// import IconButton from "components/Button/IconButton";

// import { PATHNAME } from "routes";
// import { transformUrl } from "libs";
// import { MERCHANTS_STORES_CATEGORIES } from "apis";
// import { MERCHANTS_STORES_CATEGORIES_ITEM } from "interfaces";
// import {
//   useParams,
//   useConfirmation,
//   useNotification,
//   usePermission,
//   useGetHeightForTable,
// } from "hooks";

// import StoreCategoryColumn from "./StoreCategoryColumn";
// import axios from "axios.config";
// import { Sticky } from "hocs";
// import { SAFE_OFFSET } from "constant";

// const ListingStoreCategory = () => {
//   const router = useRouter();
//   const { onConfirm, onClose } = useConfirmation();

//   const [ref, { height }] = useGetHeightForTable();

//   const { hasPermission } = usePermission("write_store_category");

//   const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

//   const tableInstance =
//     useRef<ExtendableTableInstanceProps<MERCHANTS_STORES_CATEGORIES_ITEM>>();

//   const { params, setParams } = useParams({
//     callback: (params) => {
//       if (tableInstance.current) {
//         const setUrl = tableInstance.current.setUrl;

//         setUrl(transformUrl(MERCHANTS_STORES_CATEGORIES, params));
//       }
//     },
//   });

//   const passHandler = useCallback(
//     (_tableInstance: ExtendableTableInstanceProps<MERCHANTS_STORES_CATEGORIES_ITEM>) => {
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
//     (props: PropsForAction<MERCHANTS_STORES_CATEGORIES_ITEM>) => {
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
//     (props: PropsForAction<MERCHANTS_STORES_CATEGORIES_ITEM>) => {
//       const handler = async () => {
//         try {
//           const self = get(props, "row.original.self");

//           await axios.delete(self);

//           enqueueSnackbarWithSuccess("Xóa danh mục thành công");

//           if (tableInstance.current) {
//             tableInstance.current.mutate();
//           }
//         } catch (err) {
//           enqueueSnackbarWithError(err);
//         } finally {
//           onClose();
//         }
//       };

//       const firstName = get(props, "row.original.name");

//       const message = `Hãy xác nhận bạn muốn xóa danh mục ${firstName}, đây là hành động không thể hoàn tác`;

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
//               <CompoundTableWithFunction<MERCHANTS_STORES_CATEGORIES_ITEM>
//                 url={MERCHANTS_STORES_CATEGORIES}
//                 passHandler={passHandler}
//                 columnFn={StoreCategoryColumn}
//                 onDeleteHandler={onDeleteHandler}
//                 onViewHandler={onViewHandler}
//                 TableContainerProps={{
//                   sx: {
//                     maxHeight: height - SAFE_OFFSET.bottom,
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

// export default ListingStoreCategory;
export {};
