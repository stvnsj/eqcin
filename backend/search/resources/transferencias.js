module.exports = {
  name: "transferencias",

  from: "transferencias t",

  defaultPageSize: 25,
  maxPageSize: 100,

  select: [
    "t.id",
    "t.rut",
    "t.fecha",
    "t.valor",
    "t.nombre",
    "t.detalle",
    "t.categoria_id",
    "t.proyecto_id",
    "t.comentario",
    "t.codigo",
    "t.fecha_registro",
  ],

  defaultSort: [
    { field: "fecha", direction: "desc" },
    { field: "id", direction: "desc" },
  ],

  fields: {
    id: {
      column: "t.id",
      type: "int",
      nullable: false,
      operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
    },

    rut: {
      column: "t.rut",
      type: "string",
      nullable: false,
      operators: ["eq", "neq", "contains"],
    },

    fecha: {
      column: "t.fecha",
      type: "date",
      nullable: false,
      operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
    },

    valor: {
      column: "t.valor",
      type: "int",
      nullable: false,
      operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
    },

    nombre: {
      column: "t.nombre",
      type: "string",
      nullable: false,
      operators: ["eq", "neq", "contains"],
    },

    detalle: {
      column: "t.detalle",
      type: "string",
      nullable: true,
      operators: ["eq", "neq", "contains"],
    },

    categoria_id: {
      column: "t.categoria_id",
      type: "int",
      nullable: true,
      operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
    },

    proyecto_id: {
      column: "t.proyecto_id",
      type: "int",
      nullable: true,
      operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
    },

    comentario: {
      column: "t.comentario",
      type: "string",
      nullable: true,
      operators: ["eq", "neq", "contains"],
    },

    codigo: {
      column: "t.codigo",
      type: "string",
      nullable: false,
      operators: ["eq", "neq", "contains"],
    },

    fecha_registro: {
      column: "t.fecha_registro",
      type: "datetime",
      nullable: false,
      operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
    },
  },
};
