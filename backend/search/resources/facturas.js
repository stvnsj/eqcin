module.exports = {
    name: "facturas",

    from: "facturas f",

    defaultPageSize: 25,
    maxPageSize: 100,

    select: [
        "f.id",
        "f.rut",
        "f.folio",
        "f.fecha",
        "f.valor",
        "f.razon_social",
        "f.pagina",
        "f.categoria_id",
        "f.proyecto_id",
        "f.comentario",
        "f.fecha_registro",
        "f.guia",
        "f.nota_credito",
    ],

    defaultSort: [
        { field: "fecha", direction: "desc" },
        { field: "id", direction: "desc" },
    ],

    fields: {
        id: {
            column: "f.id",
            type: "int",
            nullable: false,
            operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
        },

        rut: {
            column: "f.rut",
            type: "string",
            nullable: false,
            operators: ["eq", "neq", "contains"],
        },

        folio: {
            column: "f.folio",
            type: "string",
            nullable: false,
            operators: ["eq", "neq", "contains"],
        },

        fecha: {
            column: "f.fecha",
            type: "date",
            nullable: false,
            operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
        },

        valor: {
            column: "f.valor",
            type: "int",
            nullable: false,
            operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
        },

        razon_social: {
            column: "f.razon_social",
            type: "string",
            nullable: false,
            operators: ["eq", "neq", "contains"],
        },

        pagina: {
            column: "f.pagina",
            type: "int",
            nullable: true,
            operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
        },

        categoria_id: {
            column: "f.categoria_id",
            type: "int",
            nullable: true,
            operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
        },

        proyecto_id: {
            column: "f.proyecto_id",
            type: "int",
            nullable: true,
            operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
        },

        comentario: {
            column: "f.comentario",
            type: "string",
            nullable: true,
            operators: ["eq", "neq", "contains"],
        },

        fecha_registro: {
            column: "f.fecha_registro",
            type: "datetime",
            nullable: false,
            operators: ["eq", "neq", "gt", "gte", "lt", "lte"],
        },

        guia: {
            column: "f.guia",
            type: "boolean",
            nullable: false,
            operators: ["eq", "neq"],
        },

        nota_credito: {
            column: "f.nota_credito",
            type: "boolean",
            nullable: true,
            operators: ["eq", "neq"],
        },
    },
};
