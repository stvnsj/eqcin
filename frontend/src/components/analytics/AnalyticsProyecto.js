import { Button,Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import clpFormat from "../../utils/clpFormat";
import Grd from "../reusable/Grd";
import BarChartCategory from "./BarChartCategory";
import BarChartCosto from "./BarChartCosto";
import LineAccumulation from "./LineAccumulation";
import TableCosto from "./TableCosto";
import percentFormat from "../../utils/percentFormat";
import { scrollFunction } from "../../utils/scrollFunction";
import OptionSelector from "../reusable/OptionSelector";
import BarChartTiempo from "./BarChartTiempo";
import TableTiempo from "./TableTiempo";


const cols = [                                                             

  {field:'categoria_id',      headerName:'ID',         width:50,  type:'number', align:'right'},
  {field:'categoria_nombre',  headerName:'Nombre',     width:280, type:'string', align:'left'},
  {
    field:'categoria_total',
    headerName:'Gasto Real',
    width:130, type:'number',
    align:'right',
    valueFormatter: params => clpFormat(params?.value)
  },
  {
    field:'costo_dia',
    headerName:'Costo Día',
    width:120,
    type:'number',
    align:'right',
    valueFormatter: params => clpFormat(params?.value) + "/día"
  },
  {
    field:'categoria_porcentaje',
    headerName:'% de Gasto',
    width:120,
    type:'number',
    align:'right',
    valueFormatter: params => percentFormat (params?.value)
  },
  {
    field:'categoria_presupuesto',
    headerName:'Neto',
    width:130,
    type:'number',
    align:'right',
    valueFormatter: params => clpFormat (params?.value)
  },


]



const categoryOptions = [


  {value: 1, label:"ALIMENTACION"                  },
  {value: 2, label:"ALOJAMIENTO"                   },
  {value: 3, label:"COMBUSTIBLE"                   },
  {value: 4, label:"EPP"                           },
  {value: 5, label:"CAMIONETAS"                    },
  {value: 6, label:"FERRETERIA"                    },
  {value: 7, label:"EQUIPOS"                       },
  {value: 8, label:"PEAJE/ESTACIONAMIENTO/PASAJES" },
  {value: 9, label:"OTROS"                         },
  {value:10, label:"PERSONAL"                      },

]




export default function AnalyticsProyecto({

  proyecto_id,
  handleClose

}){





  

  const [proyectoData, setProyectoData] = useState([]);
  const [categoriaData, setCategoriaData] = useState([]);
  const [accumData, setAccumData] = useState([])
  const [presupuesto, setPresupuesto] = useState({presupuesto:0,oficial:0});
  const [category, setCategory] = useState(1);

  const [categoryLineData, setCategoryLineData] = useState([]);
  const [categoryPresupuesto, setCategoryPresupuesto] = useState(0);




  useEffect(()=>
  {

    const URL = `http://localhost:8000/analytics/${proyecto_id}`

    axios.get(URL)
    .then(response => {

      setProyectoData(response.data.data[0]);
      setCategoriaData(response.data.data[1]);
      setAccumData(response.data.data[2].map(

        day => ({...day, fecha: new Date(day.fecha) 

      })));

      setPresupuesto(response.data.data[3][0])

    })

    scrollFunction('AnalyticsProyecto')

  },[proyecto_id])


  
  useEffect(()=>
  {

    const URL = `http://localhost:8000/analytics/category/${proyecto_id}/${category}`

    axios.get(URL)
    .then(response => {

      setCategoryLineData(response.data.data[0].map(

        day => ({...day, fecha: new Date(day.fecha) 

      })));

      setCategoryPresupuesto(response.data.data[1][0])

    })

  },[category])









  return(

    <Grd>
      <Grd item={true}>
        <div id='AnalyticsProyecto'></div>
        <Button 

          size="small"
          color="error"
          variant="outlined" 
          onClick={handleClose}
        >
          cerrar
        </Button>
      </Grd>









      {/* ----------------- Costo -------------------------*/}
      <Grd item={true} mt={4}>
        <Typography variant="body1">
          <b>COSTO</b>
        </Typography>
      </Grd>

      {
        <Grd item={true}>
          <TableCosto proyectoData={proyectoData}/>
        </Grd>
      }

      <Grd item={true}>
        <BarChartCosto proyectoData={proyectoData}/>
      </Grd>
      <Grd item={true}>
        <br/>
      </Grd>
      { /* ---------------------------------------------- */ }








      {/* --------------- Costo Dia -----------------*/}
      <Grd item={true} mt={4}>
        <Typography variant="body1">
          <b>DURACION</b>
        </Typography>
      </Grd>

      {
        <Grd item={true}>
          <TableTiempo proyectoData={proyectoData}/>
        </Grd>
      }

      <Grd item={true}>
        <BarChartTiempo proyectoData={proyectoData}/>
      </Grd>


      <Grd item={true}>
        <br/>
      </Grd>
      { /* ---------------------------------------------- */ }






      {/* ---------------- Categorías ----------------- */}
      <Grd item={true} mt={6}>
        <Typography variant='body1'>
          <b>CATEGORÍAS</b>
        </Typography>
      </Grd>

      <Grd item={true}>
        <BarChartCategory categoriaData={categoriaData}/>
      </Grd>

      <Grd item={true}>
        <DataGrid
          getRowId={(row) => row.categoria_id}
          hideFooter={true}
          pagination={false}
          headerHeight={35}
          rowHeight={40}
          sx={{minWidth:'140vh', minHeight:'340px'}}
          rows={categoriaData}
          columns={cols}
        />
      </Grd>
      {/* ------------------------------------------------ */}



      





    </Grd>

  );
}
