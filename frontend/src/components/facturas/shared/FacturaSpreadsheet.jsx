import React, { useMemo } from "react";

import SpreadsheetBase from "../../reusable/SpreadsheetBase";
import clpFormat from "../../../utils/clpFormat";
import formatDateEs from "../../../utils/formatDateEs";

function makeActionRenderer({ color, background }) {
  return function actionRenderer(instance, td, row, col, prop, value) {
    td.innerHTML = "";
    td.textContent = value ?? "";
    td.style.textAlign = "center";
    td.style.fontWeight = "700";
    td.style.cursor = "pointer";
    td.style.color = color;
    td.style.background = background;
  };
}

const viewRenderer = makeActionRenderer({
  color: "#1565c0",
  background: "#eef6ff",
});

const deleteRenderer = makeActionRenderer({
  color: "#c62828",
  background: "#ffebee",
});

function moneyRenderer(instance, td, row, col, prop, value) {
  td.innerHTML = "";
  td.textContent =
    value === null || value === undefined || value === ""
      ? ""
      : clpFormat(Number(value));
  td.style.textAlign = "right";
}

function dateRenderer(instance, td, row, col, prop, value) {
  td.innerHTML = "";
  td.textContent = formatDateEs(value);
  td.style.textAlign = "center";
}

function toSpreadsheetRows(rows = []) {
  return rows.map((row) => ({
    ...row,
    viewAction: "Ver",
    deleteAction: "Borrar",
  }));
}

export default function FacturaSpreadsheet({
  rows = [],
  onView,
  onDelete,
  height = 750,
}) {
  const spreadsheetRows = useMemo(() => toSpreadsheetRows(rows), [rows]);

  const columns = useMemo(
    () => [
      { data: "id", type: "numeric", readOnly: true, width: 60 },
      {
        data: "viewAction",
        readOnly: true,
        width: 80,
        renderer: viewRenderer,
        action: "view",
      },
      {
        data: "deleteAction",
        readOnly: true,
        width: 90,
        renderer: deleteRenderer,
        action: "delete",
      },
      { data: "rut", type: "text", readOnly: true, width: 120 },
      { data: "folio", type: "text", readOnly: true, width: 100 },
      {
        data: "fecha",
        type: "text",
        readOnly: true,
        width: 110,
        renderer: dateRenderer,
      },
      {
        data: "valor",
        type: "numeric",
        readOnly: true,
        width: 120,
        renderer: moneyRenderer,
      },
      { data: "razon_social", type: "text", readOnly: true, width: 220 },
      { data: "categoria_id", type: "numeric", readOnly: true, width: 100 },
      { data: "categoria", type: "text", readOnly: true, width: 140 },
      { data: "proyecto_id", type: "numeric", readOnly: true, width: 100 },
      { data: "proyecto_nombre", type: "text", readOnly: true, width: 220 },
      {
        data: "fecha_registro",
        type: "text",
        readOnly: true,
        width: 130,
        renderer: dateRenderer,
      },
    ],
    []
  );

  const colHeaders = useMemo(
    () => [
      "ID",
      "",
      "",
      "RUT",
      "Folio",
      "Fecha",
      "Monto",
      "Razón Social",
      "Categoría ID",
      "Categoría",
      "Proyecto ID",
      "Proyecto",
      "Fecha Registro",
    ],
    []
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
      columns={columns}
      colHeaders={colHeaders}
      height={height}
      onAction={handleAction}
      hotTableProps={{
        columnSorting: {
          initialConfig: {
            column: 5,
            sortOrder: "asc",
          },
        },
      }}
    />
  );
}
