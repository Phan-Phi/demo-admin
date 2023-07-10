import React, { Fragment } from "react";
import { Box, Typography } from "@mui/material";

import ExportItem from "./ExportItem";
import { EXPORT_FILE_ITEM } from "interfaces";

interface ContainerExportItemProps {
  data: EXPORT_FILE_ITEM[];
}

const ContainerExportItem = (props: ContainerExportItemProps) => {
  const { data } = props;

  return (
    <Fragment>
      <Box display="grid" rowGap={2} gridTemplateColumns="25% auto 25% 5%">
        <Typography fontWeight={700}>Ngày tạo</Typography>
        <Typography fontWeight={700}>Nguồn</Typography>
        <Typography fontWeight={700}>Trạng thái</Typography>
        <Box></Box>
        {data.map((el) => {
          return <ExportItem key={el.self} data={el} />;
        })}
      </Box>
    </Fragment>
  );
};

export default ContainerExportItem;
