module.exports = {
  name: "boletas",

  from: "boletas b",

  defaultPageSize: 25,
  maxPageSize: 100,

  select: [
    "b.id",
    "b.rut",
    "b.folio",
    "b.fecha",
    "b.valor",
    "b.razon_social",
    "b.pagina",
    "b.categoria_id",
    "b.proyecto_id",
    "b.comentario",
    "b.fecha_registro",
  ],

  defaultSort: [
    { field: "fecha", direction: "desc" },
    { field: "id", direction: "desc" },
  ],

  fields: {
    id: {
      column: "b.id",
      type: "int",
      nullable: false,
      operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
    },

    rut: {
      column: "b.rut",
      type: "string",
      nullable: false,
      operators: ["eq", "neq", "contains"],
    },

    folio: {
      column: "b.folio",
      type: "string",
      nullable: false,
      operators: ["eq", "neq", "contains"],
    },

    fecha: {
      column: "b.fecha",
      type: "date",
      nullable: false,
      operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
    },

    valor: {
      column: "b.valor",
      type: "int",
      nullable: false,
      operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
    },

    razon_social: {
      column: "b.razon_social",
      type: "string",
      nullable: false,
      operators: ["eq", "neq", "contains"],
    },

    pagina: {
      column: "b.pagina",
      type: "int",
      nullable: true,
      operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
    },

    categoria_id: {
      column: "b.categoria_id",
      type: "int",
      nullable: true,
      operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
    },

    proyecto_id: {
      column: "b.proyecto_id",
      type: "int",
      nullable: true,
      operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
    },

    comentario: {
      column: "b.comentario",
      type: "string",
      nullable: true,
      operators: ["eq", "neq", "contains"],
    },

    fecha_registro: {
      column: "b.fecha_registro",
      type: "datetime",
      nullable: false,
      operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
    },
  },
};
