import dynamic from "next/dynamic";
import { useMeasure } from "react-use";
import { Controller, Control, Path, FieldValues } from "react-hook-form";

import {
  Box,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";

import FormLabel from "./FormLabel";

const Editor = dynamic(() => import("../Editor/Editor"), {
  ssr: false,
});

type CommonProps = {
  value?: string;
  label?: string;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
  EditorProps?: React.ComponentProps<typeof Editor>;
};

type ConditionalProps<T extends FieldValues> =
  | {
      control: Control<T, any>;
      name: Path<T>;
    }
  | { control?: undefined; name?: never };

export type Props<T extends FieldValues> = CommonProps & ConditionalProps<T>;

const CustomFormControl = <T extends FieldValues>(props: Props<T>) => {
  const {
    name,
    label,
    control = undefined,
    FormLabelProps,
    FormControlProps,
    FormHelperTextProps,
    EditorProps,
  } = props;

  const [measureRef, { width }] = useMeasure();

  if (control && name) {
    return (
      <Box ref={measureRef}>
        <Controller
          name={name}
          control={control}
          render={(props) => {
            const {
              field: { onChange, value },
              fieldState: { error },
            } = props;

            return (
              <FormControl {...FormControlProps} error={!!error}>
                <FormLabel {...FormLabelProps}>{label}</FormLabel>

                {width > 0 && (
                  <Editor
                    height={(width * 9) / 16}
                    onEditorChange={(content) => {
                      onChange(content);
                    }}
                    value={value}
                  />
                )}

                <FormHelperText {...FormHelperTextProps}>{error?.message}</FormHelperText>
              </FormControl>
            );
          }}
        />
      </Box>
    );
  } else {
    return (
      <FormControl {...FormControlProps}>
        <FormLabel {...FormLabelProps}>{label}</FormLabel>
        <Editor height={(width * 9) / 16} {...EditorProps} />
        <FormHelperText {...FormHelperTextProps} />
      </FormControl>
    );
  }
};

export default CustomFormControl;
