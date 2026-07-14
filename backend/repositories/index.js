// This file exports the raw MySQL queries.

const {insertarFacturaSII} = require("./facturas/tmp")
const {proyectosDictionary} = require("./proyectos/dictionary")
const {analisis_categorias} = require("./analisis/categorias")


module.exports = {
    insertarFacturaSII,
    proyectosDictionary,
    analisis_categorias,
}
