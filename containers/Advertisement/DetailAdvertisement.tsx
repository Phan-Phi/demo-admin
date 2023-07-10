import useSWR from "swr";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { useMountedState } from "react-use";
import DOMPurify from "isomorphic-dompurify";
import React, { useCallback, useMemo, useState, useEffect } from "react";

import { get, set, isEmpty } from "lodash";

import {
  Box,
  Grid,
  Stack,
  Button,
  styled,
  Avatar,
  MenuItem,
  Typography,
  FormControl as MuiFormControl,
  useTheme,
} from "@mui/material";

import {
  Image,
  Switch,
  Select,
  Loading,
  Container,
  FormLabel,
  FormControl,
  LoadingButton,
  BoxWithShadow,
  FormControlForUpload,
  FormControlForNumber,
  FormControlForRichText,
  CheckboxSingleChoice,
  FormControlForNumberV2,
  FormControlV2,
} from "components";

import axios from "axios.config";
import { BUTTON } from "constant";
import { PATHNAME } from "routes";
import { ADVERTISEMENTS } from "apis";
import { transformJSONToFormData, transformUrl } from "libs";
import { ADVERTISEMENTS_ITEM } from "interfaces";
import { useChoice, useNotification, usePermission } from "hooks";

import {
  advertisementSchema,
  AdvertisementSchemaProps,
  defaultAdvertisementFormState,
} from "yups";

const DetailAdvertisement = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<AdvertisementSchemaProps>();

  const { data: advertisementData, mutate } = useSWR<ADVERTISEMENTS_ITEM>(
    transformUrl(`${ADVERTISEMENTS}${router.query.id}/`, {
      use_cache: false,
    })
  );

  const setDefaultValuesHandler = useCallback((data: ADVERTISEMENTS_ITEM) => {
    const body = {} as AdvertisementSchemaProps;

    const keyList = [...Object.keys(defaultAdvertisementFormState()), "self"];

    keyList.forEach((key) => {
      const temp = get(data, key);

      if (key === "banner") {
        set(body, key, [
          {
            file: temp,
          },
        ]);

        return;
      } else if (key === "app_type") {
        set(body, key, temp[0]);
        return;
      }

      set(body, key, temp);
    });

    setDefaultValues(body);
  }, []);

  useEffect(() => {
    if (advertisementData == undefined) return;

    setDefaultValuesHandler(advertisementData);
  }, [advertisementData]);

  const onSuccessHandler = useCallback(async () => {
    setDefaultValues(undefined);

    const data = await mutate();

    data && setDefaultValuesHandler(data);
  }, []);

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ defaultValues, onSuccessHandler }} />;
};

interface RootComponentProps {
  defaultValues: AdvertisementSchemaProps;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = (props: RootComponentProps) => {
  const { defaultValues, onSuccessHandler } = props;
  const theme = useTheme();
  const choice = useChoice();
  const router = useRouter();
  const isMounted = useMountedState();

  const { hasPermission } = usePermission("write_advertisement");

  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { app_type, position } = choice;

  const {
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { dirtyFields },
  } = useForm({
    resolver: advertisementSchema(choice),
    defaultValues,
  });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: AdvertisementSchemaProps;
      dirtyFields: object;
    }) => {
      try {
        setLoading(true);

        const self = get(data, "self");

        const transformedIconForMember = data.banner.map((el) => {
          return el.file;
        });

        set(data, "banner", transformedIconForMember);

        if (!isEmpty(dirtyFields)) {
          const formData = transformJSONToFormData(data, dirtyFields);

          if (self) {
            await axios.patch(self, formData);
          }

          enqueueSnackbarWithSuccess("Cập nhật thông tin quảng cáo thành công");
          onSuccessHandler();
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    []
  );

  const onGoBackHandler = useCallback((isUpdateMode: boolean) => {
    return () => {
      if (isUpdateMode) {
        reset(defaultValues);
        setIsUpdateMode(false);
      } else {
        router.push(`/${PATHNAME.QUANG_CAO}/${PATHNAME.TIN_TUC}`);
      }
    };
  }, []);

  const renderAppType = useMemo(() => {
    if (app_type == undefined) {
      return null;
    }

    const filteredAppType = app_type.filter((el, idx) => {
      return el[0] !== "Admin";
    });

    return (
      <Select
        SelectProps={{
          readOnly: true,
        }}
        label="Đối Tượng"
        control={control}
        name="app_type"
        renderItem={() => {
          return filteredAppType.map((el) => {
            return (
              <MenuItem key={el[0]} value={el[0]}>
                {el[1]}
              </MenuItem>
            );
          });
        }}
      />
    );
  }, [app_type]);

  const renderPosition = useMemo(() => {
    if (position == undefined) {
      return null;
    }

    return (
      <Select
        SelectProps={{
          readOnly: isUpdateMode ? false : true,
          multiple: true,
        }}
        label="Vị Trí"
        control={control}
        name="position"
        renderItem={() => {
          return position.map((el) => {
            return (
              <MenuItem key={el[0]} value={el[0]}>
                {el[1]}
              </MenuItem>
            );
          });
        }}
      />
    );
  }, [isUpdateMode, position]);

  const renderBody = useMemo(() => {
    if (isUpdateMode) {
      return <FormControlForRichText control={control} name="body" label="Nội dung" />;
    } else {
      return (
        <MuiFormControl>
          <FormLabel>Nội dung</FormLabel>
          <Box
            sx={{
              backgroundColor: theme.palette.grey[400],
              padding: 1,
              borderRadius: 1,
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(defaultValues.body),
            }}
          />
        </MuiFormControl>
      );
    }
  }, [isUpdateMode, defaultValues]);

  return (
    <Container>
      <Stack spacing={3}>
        <BoxWithShadow>
          <Grid container spacing={2} marginBottom={3}>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Thông Tin Hiển Thị
              </Typography>
            </Grid>

            <Grid item xs={4}>
              {renderAppType}
            </Grid>
            <Grid item xs={4}>
              {renderPosition}
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="is_popup"
                control={control}
                render={(props) => {
                  return (
                    <CheckboxSingleChoice
                      CheckboxProps={{ disabled: isUpdateMode ? false : true }}
                      controlState={props}
                      label="Hiển Thị Dạng Pop-up"
                      checkboxLabel={
                        props.field.value
                          ? "Hiển thị dạng Pop-up"
                          : "Hiển thị dạng không Pop-up"
                      }
                    />
                  );
                }}
              />
              {/* <Switch
                control={control}
                name="is_popup"
                label="Hiển Thị Dạng Pop-up"
                SwitchProps={{
                  sx: {
                    pointerEvents: isUpdateMode ? "all" : "none",
                  },
                }}
              /> */}
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="sort_order"
                control={control}
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      placeholder="100"
                      label="Độ Ưu Tiên"
                      controlState={props}
                      NumberFormatProps={{
                        thousandSeparator: false,
                      }}
                      readOnly={isUpdateMode ? false : true}
                      // InputProps={{
                      //   readOnly: isUpdateMode ? false : true,
                      // }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Title>Ảnh Banner</Title>
              {isUpdateMode ? (
                <FormControlForUpload
                  control={control}
                  setError={setError}
                  clearErrors={clearErrors}
                  name="banner"
                  FormHelperTextProps={{
                    children: "Dung lượng file ảnh không được vượt quá 1MB",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    backgroundColor: "#E6E6E6",
                    display: "inline-block !important",
                    borderRadius: "5px",
                  }}
                >
                  {get(defaultValues, "banner") ? (
                    <Image
                      src={get(defaultValues, "banner[0].file")}
                      width={100}
                      height={100}
                      alt=""
                    />
                  ) : (
                    <Avatar variant="rounded" sx={{ width: 100, height: 100 }} />
                  )}
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Thông Tin Bài Viết
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Tiêu Đề"
                      placeholder="Nhập Tiêu Đề..."
                      InputProps={{
                        readOnly: isUpdateMode ? false : true,
                      }}
                    />
                  );
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              {renderBody}
            </Grid>
          </Grid>
        </BoxWithShadow>

        <Stack flexDirection="row" columnGap={2} justifyContent="center">
          <Button
            variant="outlined"
            disabled={loading}
            onClick={onGoBackHandler(isUpdateMode)}
          >
            {BUTTON.BACK}
          </Button>

          {hasPermission && (
            <LoadingButton
              onClick={() => {
                if (isUpdateMode) {
                  handleSubmit((data) => {
                    onSubmit({
                      data,
                      dirtyFields,
                    });
                  })();
                } else {
                  setIsUpdateMode(true);
                }
              }}
              loading={loading}
            >
              {isUpdateMode ? BUTTON.UPDATE : BUTTON.UPDATE}
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default DetailAdvertisement;
const Title = styled(Typography)(({ theme }) => {
  return { fontWeight: 700, lineHeight: "30px", marginBottom: "0.6rem" };
});
