import React from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  MenuItem,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import { useChoice } from "hooks";
import { Select } from "components";
import { getChoiceValue } from "libs";
import { EXPORT_FILE_ITEM } from "interfaces";
import ContainerExportItem from "./ContainerExportItem";

interface ExtendDialogProps extends DialogProps {
  loading: boolean;
  onDownload: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onSelectFileExtension: (event: SelectChangeEvent<any>, child: React.ReactNode) => void;
  exportFileData: EXPORT_FILE_ITEM[];
  fileExtension: string;
}

const ExportDialog = (props: ExtendDialogProps) => {
  const {
    loading,
    onDownload,
    fileExtension,
    exportFileData,
    onSelectFileExtension,
    ...restDialogProps
  } = props;

  const { export_file_extensions } = useChoice();

  return (
    <Dialog
      PaperProps={{
        sx: {
          maxWidth: "70vw",
          minWidth: "35vw",
        },
      }}
      {...restDialogProps}
    >
      <DialogContent>
        <Stack spacing={3}>
          <Box>
            <Typography fontWeight={700} marginBottom={1}>
              Định dạng file
            </Typography>

            <Select
              renderItem={() => {
                return export_file_extensions.map((el) => {
                  return (
                    <MenuItem key={el[0]} value={el[0]}>
                      {el[1]}
                    </MenuItem>
                  );
                });
              }}
              SelectProps={{
                onChange: onSelectFileExtension,
                value: fileExtension,
              }}
            />
          </Box>
          <ContainerExportItem data={exportFileData} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton variant="contained" loading={loading} onClick={onDownload}>
          Bắt đầu
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ExportDialog;
