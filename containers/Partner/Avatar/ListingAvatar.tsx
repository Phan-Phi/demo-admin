import { useToggle } from "react-use";
import React, { useCallback, useMemo, useRef, useState } from "react";

import { cloneDeep, get, set } from "lodash";

import { Grid, Stack, Dialog, DialogContent, Box } from "@mui/material";

import {
  Image,
  Container,
  type ExtendableTableInstanceProps,
  type PropsForAction,
  WrapperTable,
} from "components";

import SearchField from "components/Filter/SearchField";

import axios from "axios.config";
import { PATHNAME } from "routes";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { PENDING_IMAGES } from "apis";
import { PENDING_IMAGES_ITEM } from "interfaces";
import {
  useConfirmation,
  useFetch,
  useGetHeightForTable,
  useNotification,
  useParams,
} from "hooks";

import FilterAvatar from "./FilterAvatar";
import { Sticky } from "hocs";
import { SAFE_OFFSET } from "constant";
import AvatarTable from "./AvatarTable";

export type ListingAvatarFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  search?: string;
  date_created_start: Date | null;
  date_created_end: Date | null;
  is_confirmed: string;
  signature: string;
};

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
  date_created_start: null,
  date_created_end: null,
  is_confirmed: "",
  signature: "",
};

const ListingAvatar = () => {
  const tableInstance = useRef<ExtendableTableInstanceProps<PENDING_IMAGES_ITEM>>();

  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const [open, toggle] = useToggle(false);

  const [selectedImage, setSelectedImage] = useState<string>();

  const { onConfirm, onClose } = useConfirmation();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const { data, itemCount, isLoading, changeKey } = useFetch<PENDING_IMAGES_ITEM>(
    transformUrl(PENDING_IMAGES, filter)
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (["date_created_start", "date_created_end"].includes(key)) return;

        const params = cloneDeep(cloneFilter);

        changeKey(transformUrl(PENDING_IMAGES, params));
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    let dateStart: any = get(filter, "date_created_start");
    let dateEnd: any = get(filter, "date_created_end");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    changeKey(
      transformUrl(PENDING_IMAGES, {
        ...cloneFilter,
        date_created_start: dateStart,
        date_created_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(PENDING_IMAGES, defaultFilterValue));
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  const onViewHandler = useCallback((props: PropsForAction<PENDING_IMAGES_ITEM>) => {
    return () => {
      const { row } = props;

      setSelectedImage(row.original.original);

      toggle(true);
    };
  }, []);

  const onGotoHandler = useCallback((props: PropsForAction<PENDING_IMAGES_ITEM>) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault();

      const { row } = props;

      const self = get(row, "original.owner");

      const id = self
        .split("/")
        .filter((el: string) => {
          return el !== "";
        })
        .pop();

      window.open(`/${PATHNAME.DOI_TAC}/${PATHNAME.TAI_KHOAN}/${id}`, "_blank");
    };
  }, []);

  const onApproveHandler = useCallback((props: PropsForAction<PENDING_IMAGES_ITEM>) => {
    return async () => {
      const handler = async () => {
        try {
          const { row } = props;
          const self = row.original.self;

          await axios.patch(self, {
            is_confirmed: true,
          });

          tableInstance?.current?.mutate?.();

          enqueueSnackbarWithSuccess("Duyệt ảnh thành công");

          onClose();
        } catch (err) {
          enqueueSnackbarWithError(err);
        }
      };

      onConfirm(handler, {
        message: "Xác nhận duyệt hình ảnh này",
        variant: "info",
      });
    };
  }, []);

  const onToggleHandler = useCallback((value: boolean) => {
    return () => {
      toggle(value);
    };
  }, []);

  return (
    <Container>
      <Grid container>
        <Grid item xs={3}>
          <FilterAvatar
            filter={filter}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onDateStartChange={onFilterChangeHandler("date_created_start")}
            onDateEndChange={onFilterChangeHandler("date_created_end")}
            onSelectStatus={onFilterChangeHandler("is_confirmed")}
            onSelectImage={onFilterChangeHandler("signature")}
          />
        </Grid>
        <Grid item xs={9}>
          <Sticky>
            <Stack spacing={3}>
              <SearchField
                initSearch={filter.search}
                onChange={onFilterChangeHandler("search")}
              />

              <WrapperTable>
                <Box ref={ref}>
                  <AvatarTable
                    data={data ?? []}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
                    count={itemCount}
                    isLoading={isLoading}
                    pagination={pagination}
                    onViewHandler={onViewHandler}
                    onApproveHandler={onApproveHandler}
                    onGotoHandler={onGotoHandler}
                  />
                </Box>
              </WrapperTable>

              <Dialog open={open} onClose={onToggleHandler(false)}>
                <DialogContent
                  sx={{
                    padding: 0,
                    overflow: "hidden",
                  }}
                >
                  {selectedImage && open && (
                    <Image
                      src={selectedImage}
                      width="450px"
                      height="450px"
                      objectFit="contain"
                      alt=""
                    />
                  )}
                </DialogContent>
              </Dialog>
            </Stack>
          </Sticky>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ListingAvatar;
