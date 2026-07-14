import React from "react";

const facturaConfig = {
  key: "facturas",
  singular: "factura",
  documento: "facturas",

  listEndpoint: ({ year, month }) =>
    `http://localhost:8000/factura/year/${year}/month/${month}`,

  deleteEndpoint: (id) =>
    `http://localhost:8000/costo/delete/facturas/${id}`,

  searchResource: "facturas",

  buildEditProps: (row, refresh) => ({
    getData: refresh,
    documento: "facturas",
    id: row.id,
    nombre: row.razon_social,
    rut: row.rut,
    serie: row.folio,
    fecha: row.fecha,
    valor: row.valor,
    proyecto_id: row.proyecto_id,
    categoria_id: row.categoria_id,
    proyecto_nombre: row.proyecto_nombre,
    categoria: row.categoria,
    comentario: row.comentario,
  }),

  deleteDialogText: (row, clpFormat, formatDateEs) => (
    <>
      Confirme que desea borrar la factura a nombre de <b>{row?.nombre}</b>
      <br />
      por un monto de <b>{clpFormat(row?.valor)}</b>, con fecha{" "}
      <b>{formatDateEs(row?.fecha)}</b>
    </>
  ),
};

export default facturaConfig;
