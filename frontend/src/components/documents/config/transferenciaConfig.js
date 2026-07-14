import React from "react";

const transferenciaConfig = {
  key: "transferencias",
  singular: "transferencia",
  documento: "transferencias",

  listEndpoint: ({ year, month }) =>
    `http://localhost:8000/transferencia/year/${year}/month/${month}`,

  deleteEndpoint: (id) =>
    `http://localhost:8000/costo/delete/transferencias/${id}`,

  searchResource: "transferencias",

  buildEditProps: (row, refresh) => ({
    getData: refresh,
    documento: "transferencias",
    id: row.id,
    nombre: row.nombre,
    rut: row.rut,
    serie: row.codigo,
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
      Confirme que desea borrar la transferencia a nombre de <b>{row?.nombre}</b>
      <br />
      por un monto de <b>{clpFormat(row?.valor)}</b>, con fecha{" "}
      <b>{formatDateEs(row?.fecha)}</b>
    </>
  ),
};

export default transferenciaConfig;
