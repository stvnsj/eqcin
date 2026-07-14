import React, { useMemo } from "react";
import SpreadsheetBase from "../../reusable/SpreadsheetBase";
import {
  booleanRenderer,
  dateRenderer,
  dateTimeRenderer,
  deleteActionRenderer,
  moneyRenderer,
  viewActionRenderer,
} from "./renderers";

function rendererForKind(kind) {
  switch (kind) {
    case "money":
      return moneyRenderer;
    case "date":
      return dateRenderer;
    case "datetime":
      return dateTimeRenderer;
    case "boolean":
      return booleanRenderer;
    default:
      return undefined;
  }
}

function makeRowKey(row, index) {
  const documentId = row?.id ?? "";
  const documentCode = row?.codigo ?? row?.folio ?? row?.rut ?? "";
  return `${index}::${documentId}::${documentCode}`;
}

export default function DocumentSpreadsheet({
  rows = [],
  columns = [],
  onView,
  onDelete,
  height = 750,
  hotTableProps = {},
}) {
  const actionColumns = useMemo(() => {
    const extras = [];

    if (typeof onView === "function") {
      extras.push({
        data: "viewAction",
        readOnly: true,
        width: 80,
        renderer: viewActionRenderer,
        action: "view",
      });
    }

    if (typeof onDelete === "function") {
      extras.push({
        data: "deleteAction",
        readOnly: true,
        width: 90,
        renderer: deleteActionRenderer,
        action: "delete",
      });
    }

    return extras;
  }, [onView, onDelete]);

  const documentColumns = useMemo(
    () =>
      columns.map((column) => ({
        data: column.data,
        type: column.type ?? (column.kind === "money" ? "numeric" : "text"),
        readOnly: true,
        width: column.width,
        renderer: rendererForKind(column.kind),
      })),
    [columns]
  );

  const hotColumns = useMemo(() => {
    if (documentColumns.length === 0) return actionColumns;

    const [idColumn, ...restColumns] = documentColumns;

    // Match the original FacturaSpreadsheet form:
    // ID | Ver | Borrar | rest of document fields...
    return [idColumn, ...actionColumns, ...restColumns];
  }, [documentColumns, actionColumns]);

  const colHeaders = useMemo(() => {
    const baseHeaders = columns.map((column) => column.header);
    if (baseHeaders.length === 0) return [];

    const [idHeader, ...restHeaders] = baseHeaders;
    const actionHeaders = [];

    // The example uses blank action headers and puts the action text in the cells.
    if (typeof onView === "function") actionHeaders.push("");
    if (typeof onDelete === "function") actionHeaders.push("");

    return [idHeader, ...actionHeaders, ...restHeaders];
  }, [columns, onView, onDelete]);

  const spreadsheetRows = useMemo(
    () =>
      rows.map((row, index) => ({
        ...row,
        __rowKey: makeRowKey(row, index),
        ...(typeof onView === "function" ? { viewAction: "Ver" } : {}),
        ...(typeof onDelete === "function" ? { deleteAction: "Borrar" } : {}),
      })),
    [rows, onView, onDelete]
  );

  const handleAction = (action, rowData) => {
    if (action === "view") {
      onView?.(rowData);
      return;
    }

    if (action === "delete") {
      onDelete?.(rowData);
    }
  };

  return (
    <SpreadsheetBase
      rows={spreadsheetRows}
      columns={hotColumns}
      colHeaders={colHeaders}
      height={height}
      onAction={handleAction}
      hotTableProps={hotTableProps}
    />
  );
}
