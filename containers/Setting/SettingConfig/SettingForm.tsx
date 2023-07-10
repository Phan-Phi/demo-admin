import { Control, Controller } from "react-hook-form";
import { Grid, styled, Typography, Box } from "@mui/material";
import {
  BoxWithShadow,
  FormControl,
  FormControlForNumber,
  FormControlForNumberV2,
  FormControlV2,
} from "components";

import { SettingSchemaProps } from "yups";

interface SettingFormProps<T extends SettingSchemaProps = SettingSchemaProps> {
  control: Control<T>;
}

const SettingForm = (props: SettingFormProps) => {
  const { control } = props;

  return (
    <BoxWithShadow>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Thông Tin Cá Nhân
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {/* <FormControlForNumber
                InputProps={{
                  endAdornment: (
                    <StyledEndAdornment>
                      <Typography variant="body2">điểm</Typography>
                    </StyledEndAdornment>
                  ),
                }}
                label="Khi tạo tài khoản mới:"
                placeholder="Nhập số lượt..."
                NumberFormatProps={{
                  thousandSeparator: false,
                }}
                control={control}
                name="introduced_people_point"
              /> */}

              <Controller
                control={control}
                name="introduced_people_point"
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      InputProps={{
                        endAdornment: (
                          <StyledEndAdornment>
                            <Typography variant="body2">điểm</Typography>
                          </StyledEndAdornment>
                        ),
                      }}
                      label="Khi tạo tài khoản mới:"
                      placeholder="Nhập số lượt..."
                      controlState={props}
                      NumberFormatProps={{
                        thousandSeparator: false,
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {/* <FormControlForNumber
                InputProps={{
                  endAdornment: (
                    <StyledEndAdornment>
                      <Typography variant="body2">điểm</Typography>
                    </StyledEndAdornment>
                  ),
                }}
                label="Khi giới thiệu tài khoản:"
                placeholder="Nhập số lượt..."
                NumberFormatProps={{
                  thousandSeparator: false,
                }}
                control={control}
                name="introduce_people_point"
              /> */}

              <Controller
                control={control}
                name="introduce_people_point"
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      InputProps={{
                        endAdornment: (
                          <StyledEndAdornment>
                            <Typography variant="body2">điểm</Typography>
                          </StyledEndAdornment>
                        ),
                      }}
                      label="Khi giới thiệu tài khoản:"
                      placeholder="Nhập số lượt..."
                      controlState={props}
                      NumberFormatProps={{
                        thousandSeparator: false,
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {/* <FormControlForNumber
                control={control}
                name="non_membership_gift_rate"
                InputProps={{
                  endAdornment: (
                    <StyledEndAdornment>
                      <Typography variant="body2">%</Typography>
                    </StyledEndAdornment>
                  ),
                }}
                label="Khi chưa là thành viên:"
                placeholder="Nhập số lượt..."
                NumberFormatProps={{
                  thousandSeparator: false,
                }}
              /> */}

              <Controller
                control={control}
                name="non_membership_gift_rate"
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      InputProps={{
                        endAdornment: (
                          <StyledEndAdornment>
                            <Typography variant="body2">%</Typography>
                          </StyledEndAdornment>
                        ),
                      }}
                      label="Khi chưa là thành viên:"
                      placeholder="Nhập số lượt..."
                      controlState={props}
                      NumberFormatProps={{
                        thousandSeparator: false,
                      }}
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Điểm Thấp
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {/* <FormControl
                control={control}
                name="wallet_point_low_threshold"
                label="Mức Điểm:"
                placeholder="Nhập số lượt..."
                InputProps={{
                  endAdornment: (
                    <StyledEndAdornment>
                      <Typography variant="body2">điểm</Typography>
                    </StyledEndAdornment>
                  ),
                }}
              /> */}

              <Controller
                control={control}
                name="wallet_point_low_threshold"
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      InputProps={{
                        endAdornment: (
                          <StyledEndAdornment>
                            <Typography variant="body2">điểm</Typography>
                          </StyledEndAdornment>
                        ),
                      }}
                      label="Mức Điểm:"
                      placeholder="Nhập số lượt..."
                      controlState={props}
                      NumberFormatProps={{
                        thousandSeparator: false,
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {/* <FormControl
                control={control}
                name="email_notification_wallet_point_low_threshold"
                label="Email Nhận Thông Báo:"
                placeholder="Nhập email..."
                InputProps={{
                  type: "email",
                }}
              /> */}

              <Controller
                name="email_notification_wallet_point_low_threshold"
                control={control}
                render={(props) => {
                  return (
                    <FormControlV2
                      controlState={props}
                      label="Email Nhận Thông Báo:"
                      placeholder="Nhập email..."
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h2" color="primary2.main">
                Phí
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {/* <FormControl
                control={control}
                name="transaction_fee_rate"
                label="Phí dịch vụ:"
                placeholder="Nhập số lượt..."
                InputProps={{
                  endAdornment: (
                    <StyledEndAdornment>
                      <Typography sx={{ whiteSpace: "nowrap" }}>%</Typography>
                    </StyledEndAdornment>
                  ),
                }}
              /> */}

              <Controller
                control={control}
                name="transaction_fee_rate"
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      InputProps={{
                        endAdornment: (
                          <StyledEndAdornment>
                            <Typography variant="body2">%</Typography>
                          </StyledEndAdornment>
                        ),
                      }}
                      label="Phí dịch vụ:"
                      placeholder="Nhập số lượt..."
                      controlState={props}
                      NumberFormatProps={{
                        thousandSeparator: false,
                      }}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                control={control}
                name="transaction_fee_rate_for_first_store_of_customer"
                render={(props) => {
                  return (
                    <FormControlForNumberV2
                      InputProps={{
                        endAdornment: (
                          <StyledEndAdornment>
                            <Typography variant="body2">%</Typography>
                          </StyledEndAdornment>
                        ),
                      }}
                      label="Phí dịch vụ ưu đãi:"
                      placeholder="Nhập số lượt..."
                      controlState={props}
                      NumberFormatProps={{
                        thousandSeparator: false,
                      }}
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </BoxWithShadow>
  );
};

export default SettingForm;

const StyledEndAdornment = styled(Box)(({ theme }) => {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6E6E6",
    width: "65px !important",
    height: "2.5rem",
  };
});
