
const {queryAsync} = require("../../services/dbv2")

// Search can be structured as a json statement.

const mySearch = {
    table : "FACTURAS" ,
    logic : "AND", // can be "OR"
    gt : {field: "id", value: 10},
    lt : {field: "fecha", value: "2025-01-01"},
    order : {field: "fecha", type: "ascending"},
}


const lessThan = () => ` ?? < ? `;
const greaterThan = () => ` ?? > ? `;
const lessThanOrEqualTo = () => ` ?? <= ? `;
const greaterThanOrEqualTo = () => ` ?? >= ? `;
const containsString = () => ` ?? LIKE '%?%' `;
const equals = () => ` ?? = ? `;





function parseFilter (filter) {
    switch (filter) {
        
    case "gt" :
        return 1;
    case "lt":
        return 2;
    default :
        return 0
        
    }
}





const sqlPredicate = {
    gt : "<",
    contains : "LIKE",
}

/*
  Assume each predicate has a different syntax.
  Therefore, each predicate should be mapped to
  some distinct application syntax.

 */



function queryFilterBuilder (jsonSearch) {
    
}

function queryBuilder (jsonSearch) {
    const table = jsonSearch.table;
    const logic = jsonSearch.logic;
    
}



// I need (field,value) filters.
// filters:
// contains
// greater than
// less than
// after
// before

// Operators

/*


  A search query is something like

  SELECT * FROM ??

  WHERE
  (statement1) AND
  (statement2) AND
  ...
  (statement_n)



  El operador de los filtros puede ser
  AND u OR

  
 
*/


// I need a function to build a filter.





async function searchFacturaByRut (rut) {
    const rawSql = `SELECT * FROM facturas WHERE rut LIKE '%?%'`
    const rows = await queryAsync(rawSql, [rut]);
}


async function searchFacturaByRazonSocial (razon_social) {
    const rawSql = `SELECT * FROM facturas WHERE razon_social LIKE '%?%'`
    const rows = await queryAsync(rawSql, [razon_social]);
}

// How to combine different 
async function searchTableByField (table, field, value) {
    const rawQuery = `SELECT * FROM ?? WHERE ?? LIKE '%?%'`
    const rows = await queryAsync(rawQuery, [table,field,value])
    return rows
}



