import React, { Fragment } from "react";
import { useRouter } from "next/router";

import { get } from "lodash";

import { Typography, Button, Stack, TypographyProps, Box, Grid } from "@mui/material";

import { BUTTON } from "constant";
import { usePermission, useSetting } from "hooks";
import {
  BoxWithShadow,
  FormControl,
  FormControlBase,
  FormControlForPhoneNumber,
} from "components";
import { useCallback } from "react";

const ConfigNotification = () => {
  const router = useRouter();
  const setting = useSetting();

  const { hasPermission } = usePermission("write_setting_notification");

  const onGoToHandler = useCallback(() => {
    router.push(`${router.pathname}/thong-bao-cap-nhat`);
  }, []);

  const { store_notification_period, store_notification_quantity_in_period } = setting;

  return (
    <Stack spacing={3}>
      <BoxWithShadow>
        <Stack spacing={2}>
          <Typography variant="h2" color="primary2.main">
            Tần Suất
          </Typography>

          <Box display="grid" gridTemplateColumns={"50% 50%"} rowGap={2} maxWidth={400}>
            <Item
              label={"Chu kỳ gửi thông báo:"}
              value={`${store_notification_period / (60 * 60 * 24)} ngày`}
            />
            <Item
              label={"Số lượt mỗi chu kỳ:"}
              value={`${store_notification_quantity_in_period} lượt`}
            />
          </Box>
        </Stack>
      </BoxWithShadow>

      <BoxWithShadow>
        <Stack spacing={2}>
          <Typography variant="h2" color="primary2.main">
            Nội dung từ hệ thống thông báo
          </Typography>
          {/* 
          <FormControl
            label="Tiêu đề thông báo tích điểm"
            placeholder="Tiêu đề thông báo tích điểm"
            InputProps={{
              value: get(setting, "increase_point_notification_title"),
              readOnly: true,
            }}
          /> */}
          <FormControl
            label="Nội dung thông báo tích điểm"
            placeholder="Nội dung thông báo tích điểm"
            InputProps={{
              value: get(setting, "increase_point_notification_template"),
              readOnly: true,
              multiline: true,
              rows: 5,
              sx: {
                padding: 1,
              },
            }}
          />
          <FormControl
            label="Tiêu đề thông báo trừ điểm"
            placeholder="Tiêu đề thông báo trừ điểm"
            InputProps={{
              value: get(setting, "decrease_point_notification_title"),
              readOnly: true,
            }}
          />
          <FormControl
            label="Nội dung thông báo trừ điểm"
            placeholder="Nội dung thông báo trừ điểm"
            InputProps={{
              value: get(setting, "decrease_point_notification_template"),
              readOnly: true,
              multiline: true,
              rows: 5,
              sx: {
                padding: 1,
              },
            }}
          />
          <FormControl
            label="Tiêu đề thông báo điểm thấp"
            placeholder="Tiêu đề thông báo điểm thấp"
            InputProps={{
              value: get(setting, "below_threshold_notification_title"),
              readOnly: true,
            }}
          />
          <FormControl
            label="Nội dung thông báo điểm thấp"
            placeholder="Nội dung thông báo điểm thấp"
            InputProps={{
              value: get(setting, "below_threshold_notification_template"),
              readOnly: true,
              multiline: true,
              rows: 5,
              sx: {
                padding: 1,
              },
            }}
          />
        </Stack>
      </BoxWithShadow>

      <BoxWithShadow>
        <Stack spacing={2}>
          <Typography variant="h2" color="primary2.main">
            Email Template
          </Typography>

          {/* <FormControlForPhoneNumber
            placeholder="Hotline"
            label="Hotline"
            InputProps={{
              readOnly: true,
              value: get(setting, "email_sender_name"),
            }}
          /> */}
          <Grid container width="100%">
            <Grid item xs={6} paddingLeft={"0 !important"}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  placeholder: "Tên người gửi email",
                  value: get(setting, "email_sender_name"),
                }}
                FormLabelProps={{
                  children: "Tên người gửi email",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlBase
                InputProps={{
                  readOnly: true,
                  placeholder: "Tên Đăng Nhập",
                  value: get(setting, "email_sender"),
                }}
                FormLabelProps={{
                  children: "Người gửi",
                }}
              />
            </Grid>
          </Grid>

          <FormControlBase
            InputProps={{
              readOnly: true,
              placeholder: "Tiêu đề thiết lập mật khẩu tài khoản nhân viên",
              value: get(setting, "admin_create_password_email_subject"),
            }}
            FormLabelProps={{
              children: "Tiêu đề thiết lập mật khẩu tài khoản nhân viên",
            }}
          />

          <FormControlBase
            InputProps={{
              placeholder: "Thiết lập mật khẩu tài khoản nhân viên",
              value: get(setting, "admin_create_password_email_template"),
              readOnly: true,
              multiline: true,
              rows: 2,
              sx: {
                padding: 1,
              },
            }}
            FormLabelProps={{
              children: "Thiết lập mật khẩu tài khoản nhân viên",
            }}
          />

          <FormControlBase
            InputProps={{
              placeholder: "Tiêu đề đặt lại mật khẩu tài khoản nhân viên",
              value: get(setting, "admin_reset_password_email_subject"),
              readOnly: true,
            }}
            FormLabelProps={{
              children: "Tiêu đề đặt lại mật khẩu tài khoản nhân viên",
            }}
          />

          <FormControlBase
            InputProps={{
              placeholder: "Đặt lại mật khẩu tài khoản nhân viên",
              value: get(setting, "admin_reset_password_email_template"),
              readOnly: true,
              multiline: true,
              rows: 2,
              sx: {
                padding: 1,
              },
            }}
            FormLabelProps={{
              children: "Đặt lại mật khẩu tài khoản nhân viên",
            }}
          />

          <FormControlBase
            InputProps={{
              placeholder: "Tiêu đề thiết lập mật khẩu tài khoản nhân viên đối tác",
              value: get(setting, "cashier_create_password_email_subject"),
              readOnly: true,
            }}
            FormLabelProps={{
              children: "Tiêu đề thiết lập mật khẩu tài khoản nhân viên đối tác",
            }}
          />

          <FormControlBase
            InputProps={{
              placeholder: "Thiết lập mật khẩu tài khoản nhân viên đối tác",
              value: get(setting, "cashier_create_password_email_template"),
              readOnly: true,
              multiline: true,
              rows: 2,
              sx: {
                padding: 1,
              },
            }}
            FormLabelProps={{
              children: "Thiết lập mật khẩu tài khoản nhân viên đối tác",
            }}
          />

          <FormControlBase
            InputProps={{
              placeholder: "Tiêu đề thiết lập mật khẩu tài khoản đối tác",
              value: get(setting, "merchant_create_password_email_subject"),
              readOnly: true,
            }}
            FormLabelProps={{
              children: "Tiêu đề thiết lập mật khẩu tài khoản đối tác",
            }}
          />

          <FormControlBase
            InputProps={{
              placeholder: "Thiết lập mật khẩu tài khoản đối tác",
              value: get(setting, "merchant_create_password_email_template"),
              readOnly: true,
              multiline: true,
              rows: 2,
              sx: {
                padding: 1,
              },
            }}
            FormLabelProps={{
              children: "Thiết lập mật khẩu tài khoản đối tác",
            }}
          />

          <FormControlBase
            InputProps={{
              placeholder:
                "Tiêu đề thiết lập mật khẩu tài khoản đối tác hoặc nhân viên đối tác",
              value: get(setting, "merchant_or_cashier_reset_password_email_subject"),
              readOnly: true,
            }}
            FormLabelProps={{
              children:
                "Tiêu đề thiết lập mật khẩu tài khoản đối tác hoặc nhân viên đối tác",
            }}
          />

          <FormControlBase
            InputProps={{
              placeholder: "Thiết lập mật khẩu tài khoản đối tác hoặc nhân viên đối tác",
              value: get(setting, "merchant_or_cashier_reset_password_email_template"),
              readOnly: true,
              multiline: true,
              rows: 2,
              sx: {
                padding: 1,
              },
            }}
            FormLabelProps={{
              children: "Thiết lập mật khẩu tài khoản đối tác hoặc nhân viên đối tác",
            }}
          />

          <FormControlBase
            InputProps={{
              placeholder: "Tiêu đề thông báo tài khoản đối tác thấp điểm",
              value: get(setting, "merchant_wallet_below_threshold_email_subject"),
              readOnly: true,
            }}
            FormLabelProps={{
              children: "Tiêu đề thông báo tài khoản đối tác thấp điểm",
            }}
          />

          <FormControlBase
            InputProps={{
              placeholder: "Thông báo tài khoản đối tác thấp điểm",
              value: get(setting, "merchant_wallet_below_threshold_email_template"),
              readOnly: true,
              multiline: true,
              rows: 2,
              sx: {
                padding: 1,
              },
            }}
            FormLabelProps={{
              children: "Thông báo tài khoản đối tác thấp điểm",
            }}
          />

          <FormControlBase
            InputProps={{
              placeholder: "Tiêu đề xác thực email khách hàng",
              value: get(setting, "customer_verify_email_subject"),
              readOnly: true,
            }}
            FormLabelProps={{
              children: "Tiêu đề xác thực email khách hàng",
            }}
          />

          <FormControlBase
            InputProps={{
              placeholder: "Xác thực email khách hàng",
              value: get(setting, "customer_verify_email_template"),
              readOnly: true,
              multiline: true,
              rows: 2,
              sx: {
                padding: 1,
              },
            }}
            FormLabelProps={{
              children: "Xác thực email khách hàng",
            }}
          />

          <FormControlBase
            InputProps={{
              placeholder: "Tiêu đề đặt lại mật khẩu tài khoản khách hàng",
              value: get(setting, "customer_reset_password_email_subject"),
              readOnly: true,
            }}
            FormLabelProps={{
              children: "Tiêu đề đặt lại mật khẩu tài khoản khách hàng",
            }}
          />

          <FormControlBase
            InputProps={{
              placeholder: "Đặt lại mật khẩu tài khoản khách hàng",
              value: get(setting, "customer_reset_password_email_template"),
              readOnly: true,
              multiline: true,
              rows: 2,
              sx: {
                padding: 1,
              },
            }}
            FormLabelProps={{
              children: "Đặt lại mật khẩu tài khoản khách hàng",
            }}
          />
        </Stack>
      </BoxWithShadow>

      {hasPermission && (
        <Button
          onClick={onGoToHandler}
          sx={{
            alignSelf: "flex-end",
          }}
        >
          {BUTTON.UPDATE}
        </Button>
      )}
    </Stack>
  );
};

export default ConfigNotification;

interface ItemProps {
  label: string;
  value: string | number | boolean;
  LabelProps?: TypographyProps;
  ValueProps?: TypographyProps;
}

const Item = ({ label, value, LabelProps, ValueProps }: ItemProps) => {
  return (
    <Fragment>
      <Typography variant="body2" fontWeight="700" {...LabelProps}>
        {label}
      </Typography>
      <Typography variant="body2" {...ValueProps}>
        {value}
      </Typography>
    </Fragment>
  );
};
