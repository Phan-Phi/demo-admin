import React, { Fragment, useCallback, useMemo, useState } from "react";
import { formatISO, millisecondsToSeconds } from "date-fns";

import { Box, Grid, SelectChangeEvent } from "@mui/material";

import PartnerReportTable from "./PartnerReportTable";
import ExportDialog from "../components/ExportDialog";
import ExportButton from "../components/ExportButton";
import FilterPartnerReport from "./FilterPartnerReport";
import { BoxWithShadow, Spacing, WrapperTable } from "components";

import useSWR from "swr";
import axios from "axios.config";

import { SAFE_OFFSET } from "constant";
import { cloneDeep, get, omit, set } from "lodash";
import { getChoiceValue, setFilterValue, transformDate, transformUrl } from "libs";

import { EXPORT_FILES, REPORTS_MERCHANTS_OVEWVIEW } from "apis";
import { ConvertTimeFrameType, convertTimeFrameToTimeObject } from "libs/dateUtils";

import {
  EXPORT_FILE_ITEM,
  REPORTS_MERCHANTS_OVEWVIEW_ITEM,
  responseSchema,
} from "interfaces";

import {
  useChoice,
  useFetch,
  useGetHeightForTable,
  useNotification,
  usePermission,
  useToggle,
} from "hooks";

export type PartnerReportByTableFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  timeFrame: ConvertTimeFrameType;
  date_start: number | null;
  date_end: number | null;
};

const initState: PartnerReportByTableFilterType = {
  limit: 25,
  offset: 0,
  with_count: true,
  timeFrame: "this_week",
  date_start: null,
  date_end: null,
};

type PartnerReportByTableProps = {
  currentTab: number;
};

const PartnerReportByTable = ({ currentTab }: PartnerReportByTableProps) => {
  const { export_file_extensions } = useChoice();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const [ref, { height }] = useGetHeightForTable();

  const { open, onOpen, onClose } = useToggle();

  const { hasPermission } = usePermission("export_merchant_report");

  const [fileExtension, setFileExtension] = useState<string>(
    getChoiceValue(export_file_extensions)[0]
  );

  const [filter, setFilter] = useState<PartnerReportByTableFilterType>(initState);

  const { data: resExportFileData, mutate: mutateExportFile } = useSWR<
    responseSchema<EXPORT_FILE_ITEM>
  >(
    transformUrl(EXPORT_FILES, {
      get_all: true,
    })
  );

  const onSelectFileExtensionHandler = useCallback((e: SelectChangeEvent<string>) => {
    setFileExtension(e.target.value);
  }, []);

  const onExportFileHandler = useCallback(
    (filter: PartnerReportByTableFilterType, fileExtension: string) => {
      return async () => {
        try {
          setLoading(true);

          let { date_start, date_end } = convertTimeFrameToTimeObject(filter.timeFrame);

          if (filter.date_start) {
            date_start = millisecondsToSeconds(filter.date_start);
          }

          if (filter.date_end) {
            date_end = millisecondsToSeconds(filter.date_end);
          }

          const data = {
            date_start: formatISO(date_start * 1000),
            date_end: formatISO(date_end * 1000),
            file_ext: fileExtension,
            type: "Merchant_overview",
          };

          await axios.post(EXPORT_FILES, data);
          await mutateExportFile();

          enqueueSnackbarWithSuccess("Xuất file thành công");
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
          setLoading(false);
        }
      };
    },
    []
  );

  const renderExportFile = useMemo(() => {
    if (!hasPermission) return null;

    if (resExportFileData == undefined) return null;

    if (currentTab !== 0) return null;

    return (
      <Fragment>
        <ExportButton onClick={onOpen} />

        <ExportDialog
          open={open}
          loading={loading}
          onClose={onClose}
          onDownload={onExportFileHandler(filter, fileExtension)}
          onSelectFileExtension={onSelectFileExtensionHandler}
          exportFileData={resExportFileData.results}
          fileExtension={fileExtension}
        />

        <Spacing />
      </Fragment>
    );
  }, [
    open,
    filter,
    loading,
    currentTab,
    fileExtension,
    hasPermission,
    resExportFileData,
  ]);

  const url: string = useMemo(() => {
    const timeObject = convertTimeFrameToTimeObject(filter.timeFrame);

    const omitFilter = omit(filter, "timeFrame");

    return transformUrl(REPORTS_MERCHANTS_OVEWVIEW, {
      ...omitFilter,
      ...timeObject,
    });
  }, [filter]);

  const { data, itemCount, changeKey, isLoading } =
    useFetch<REPORTS_MERCHANTS_OVEWVIEW_ITEM>(url);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        if (key === "timeFrame") {
          set(cloneFilter, key, value);
        }

        setFilter(cloneFilter);

        if (["date_start", "date_end"].includes(key)) return;

        const params = cloneDeep(cloneFilter);

        set(params, "timeFrame", get(params, "timeFrame"));

        const timeObject = convertTimeFrameToTimeObject(params.timeFrame);

        const omitParams = omit(params, "timeFrame");

        changeKey(
          transformUrl(REPORTS_MERCHANTS_OVEWVIEW, {
            ...omitParams,
            ...timeObject,
          })
        );
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    let dateStart: any = get(filter, "date_start");
    let dateEnd: any = get(filter, "date_end");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    changeKey(
      transformUrl(REPORTS_MERCHANTS_OVEWVIEW, {
        ...cloneFilter,
        date_start: dateStart,
        date_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(initState);
    const timeObject = convertTimeFrameToTimeObject("this_week");

    changeKey(
      transformUrl(REPORTS_MERCHANTS_OVEWVIEW, {
        limit: 25,
        offset: 0,
        with_count: true,
        timeFrame: "this_week",
        ...timeObject,
      })
    );
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  return (
    <Grid container>
      <Grid item xs={3}>
        <BoxWithShadow>
          {renderExportFile}

          <FilterPartnerReport
            filter={filter}
            resetFilter={resetFilterHandler}
            onTimeFrameChange={onFilterChangeHandler("timeFrame")}
            onFilterByTime={onClickFilterByTime}
            onDateStartChange={onFilterChangeHandler("date_start")}
            onDateEndChange={onFilterChangeHandler("date_end")}
          />
        </BoxWithShadow>
      </Grid>

      <Grid item xs={9}>
        <WrapperTable>
          <Box ref={ref}>
            <PartnerReportTable
              data={data ?? []}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
              count={itemCount}
              isLoading={isLoading}
              pagination={pagination}
            />
          </Box>
        </WrapperTable>
      </Grid>
    </Grid>
  );
};

export default PartnerReportByTable;
