
const {queryAsync} = require("../../services/dbv2")



const EXECUTE_MAIN = true


const SQL_QUERY = proyecto_id => `


    WITH 
    
    lista_categorias AS (
      SELECT id AS categoria_id , 
      categoria AS categoria_nombre
      FROM categorias
      UNION 
      SELECT 10, 'PERSONAL'
    )

    ,total_minimo AS (
      SELECT 
      0 AS categoria_total, 
      lista_categorias.categoria_id as categoria_id,
      ${proyecto_id} as proyecto_id
      FROM lista_categorias
    )

    ,total_boletas AS (
      SELECT 
      SUM(valor) AS categoria_total, 
      categoria_id,
      proyecto_id 
      FROM boletas WHERE proyecto_id=${proyecto_id}
      GROUP BY categoria_id
    )

    ,total_facturas AS (

      SELECT 
      SUM(valor) AS categoria_total, 
      categoria_id,
      proyecto_id
      FROM facturas WHERE proyecto_id=${proyecto_id}
      GROUP BY categoria_id
    )

    ,total_transferencias AS (

      SELECT 
      SUM(valor) AS categoria_total, 
      categoria_id ,
      proyecto_id
      FROM transferencias WHERE proyecto_id=${proyecto_id}
      GROUP BY categoria_id
    )

    ,total_sueldos AS (

      SELECT 
      SUM(C.costo) AS categoria_total, 
      10 AS categoria_id,
      ${proyecto_id} AS  proyecto_id

      FROM asistencias A
      INNER JOIN contratos C
      ON  A.empleado_id=C.empleado_id
      AND A.registro=1
      AND A.proyecto_id=${proyecto_id}
      AND A.fecha >= C.inicio
      AND (A.fecha <= C.termino OR C.vigente=1)
    )

    ,total_social AS (

      SELECT 
      IFNULL (proyecto_social(${proyecto_id}), 0) AS categoria_total,
      10 AS categoria_id,
      ${proyecto_id} AS proyecto_id
    )
    

    ,total_bonos AS (

      SELECT 
      SUM(bono) AS categoria_total, 
      10 AS categoria_id,
      ${proyecto_id} AS  proyecto_id
      FROM bonos
      WHERE proyecto_id = ${proyecto_id}
    )

    ,total_descuentos AS (

      SELECT 
      (-1 * SUM(descuento)) AS categoria_total, 
      10 AS categoria_id,
      ${proyecto_id} AS  proyecto_id
      FROM descuentos
      WHERE proyecto_id = ${proyecto_id}
    )

    ,total_finiquitos AS (

      SELECT
      -- 
      SUM(finiquito) AS categoria_total,
      10 AS categoria_id,
      ${proyecto_id} AS proyecto_id
      FROM contratos
      WHERE NOT vigente
      AND proyecto_id = ${proyecto_id}
    )

    ,total_union AS (
      
      SELECT * FROM total_minimo
      UNION ALL
      SELECT * FROM total_boletas
      UNION ALL
      SELECT * FROM total_facturas
      UNION ALL
      SELECT * FROM total_transferencias
      UNION ALL 
      SELECT * FROM total_sueldos
      UNION ALL 
      SELECT * FROM total_bonos
      UNION ALL 
      SELECT * FROM total_descuentos
      UNION ALL
      SELECT * FROM total_finiquitos
      UNION ALL
      SELECT * FROM total_social
    )

    ,categorias_total AS (

      SELECT 

      C.categoria_id                                           AS categoria_id, 
      C.categoria_nombre                                       AS categoria_nombre,
      U.proyecto_id                                            AS proyecto_id,
      IFNULL(SUM(U.categoria_total),0)                         AS categoria_total,
      IFNULL(100 * SUM(U.categoria_total)/@total_proyecto,0)   AS categoria_porcentaje

      FROM lista_categorias C 
      LEFT JOIN total_union U
      ON C.categoria_id = U.categoria_id
      GROUP BY C.categoria_id
    )

    SELECT
    C.categoria_id, 
    C.categoria_nombre,
    C.proyecto_id,
    C.categoria_total,
    IFNULL(P.neto,0)                                    AS categoria_presupuesto,
    IFNULL(P.oficial,0)                                 AS categoria_oficial

    FROM categorias_total C LEFT JOIN presupuesto P
    ON   C.categoria_id = P.categoria_id
    AND  C.proyecto_id  = P.proyecto_id
`







async function analisis_categorias (proyecto_id) {

    const raw_query = SQL_QUERY(proyecto_id);

    return await queryAsync(raw_query);
    
}


module.exports = {
    analisis_categorias
}




async function main ( ) {
    rows = await analisis_categorias("22")
    console.log(rows)
}

if (EXECUTE_MAIN){
    main()   
}
