import React, { useRef } from "react";
import { Box } from "@mui/material";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { registerLanguageDictionary, esMX } from "handsontable/i18n";

import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";

registerAllModules();
registerLanguageDictionary(esMX);

export default function SpreadsheetBase({
  rows = [],
  columns = [],
  colHeaders = [],
  height = 750,
  onAction,
  afterOnCellMouseDown,
  hotTableProps = {},
}) {
  const hotRef = useRef(null);

  const handleAfterOnCellMouseDown = (event, coords) => {
    afterOnCellMouseDown?.(event, coords);

    const { row, col } = coords;
    if (row < 0 || col < 0) return;

    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    const columnConfig = columns[col];
    if (!columnConfig?.action) return;

    // IMPORTANT:
    // `row` is a visual row. After sorting/filtering, it is not safe to use it
    // as an index into the original React array. Read a hidden stable key from
    // the visual row and resolve the original object from the current `rows` prop.
    const rowKey = hot.getDataAtRowProp(row, "__rowKey");
    const rowData =
      rowKey == null
        ? null
        : rows.find((candidate) => candidate.__rowKey === rowKey);

    if (!rowData) return;

    onAction?.(columnConfig.action, rowData, {
      event,
      coords,
      column: columnConfig,
      rowKey,
    });
  };

  return (
    <Box sx={{ height, width: "100%", mt: 2 }}>
      <HotTable
        ref={hotRef}
        data={rows}
        columns={columns}
        colHeaders={colHeaders}
        rowHeaders={true}
        width="100%"
        height={String(height)}
        theme="ht-theme-main"
        stretchH="all"
        manualColumnResize={true}
        manualRowResize={true}
        rowHeights={32}
        contextMenu={true}
        dropdownMenu={true}
        filters={true}
        language="es-MX"
        navigableHeaders={true}
        readOnly={true}
        licenseKey="non-commercial-and-evaluation"
        afterOnCellMouseDown={handleAfterOnCellMouseDown}
        {...hotTableProps}
      />
    </Box>
  );
}
