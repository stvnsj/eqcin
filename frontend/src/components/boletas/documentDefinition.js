import { categorias } from "../../data/categorias";

const categoryMap = Object.fromEntries(
  categorias.map((item) => [Number(item.value), item.label])
);

const boletaDefinition = {
  monthLabel: "Mes Boletas",
  searchTitle: "Buscar boletas",
  height: 750,
  searchHeight: 650,

  defaultSort: { field: "fecha", direction: "desc" },

  hotTableProps: {
    columnSorting: true,
  },

  columns: [
    { data: "id", header: "ID", type: "numeric", width: 60 },
    { data: "rut", header: "RUT", width: 130 },
    { data: "folio", header: "Folio", width: 140 },
    { data: "fecha", header: "Fecha", width: 110, kind: "date" },
    { data: "valor", header: "Monto", type: "numeric", width: 120, kind: "money" },
    { data: "razon_social", header: "Razón Social", width: 220 },
    { data: "categoria", header: "Categoría", width: 170 },
    { data: "proyecto_nombre", header: "Proyecto", width: 200 },
    { data: "fecha_registro", header: "Fecha Registro", width: 180, kind: "datetime" },
  ],

  searchFields: [
    { value: "razon_social", label: "Razón social", type: "string", operators: ["eq", "neq", "contains"] },
    { value: "folio", label: "Folio", type: "string", operators: ["eq", "neq", "contains"] },
    { value: "rut", label: "RUT", type: "string", operators: ["eq", "neq", "contains"] },
    { value: "fecha", label: "Fecha", type: "date", operators: ["eq", "neq", "gt", "gte", "lt", "lte"] },
    { value: "valor", label: "Valor", type: "int", operators: ["eq", "neq", "gt", "gte", "lt", "lte"] },
    { value: "categoria_id", label: "Categoría", type: "int", operators: ["eq", "neq", "gt", "gte", "lt", "lte"] },
    { value: "proyecto_id", label: "Proyecto", type: "int", operators: ["eq", "neq", "gt", "gte", "lt", "lte"] },
    { value: "comentario", label: "Comentario", type: "string", operators: ["eq", "neq", "contains"] },
  ],

  categoryMap,

  normalizeRow: (row, { projectMap = {}, categoryMap = {} }) => ({
    ...row,
    categoria:
      row.categoria ??
      categoryMap[Number(row.categoria_id)] ??
      "",
    proyecto_nombre:
      row.proyecto_nombre ??
      projectMap[Number(row.proyecto_id)] ??
      "",
  }),
};

export default boletaDefinition;

