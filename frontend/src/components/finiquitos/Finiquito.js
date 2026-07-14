import axios from "axios"
import { useEffect } from "react"
import { Typography } from '@mui/material';
import * as React from "react";
import {Button} from '@mui/material';
import MonthSelector from '../reusable/MonthSelector';
import { DataGrid } from "@mui/x-data-grid";
import clpFormat from "../../utils/clpFormat";






const cols = [

  {field:"RutTrabajador",             headerName:'Rut Trabajador' ,width:100},
  {field:"FechaInicioContrato",       headerName:'Inicio',width:100},
  {field:"FechaTerminoContrato",      headerName:'Termino',width:100},
  {field:"CausalFiniquitoId",         headerName:'Causa' ,width:100},
  {field:"Funciones",                 headerName:'Cargo',width:100},
  {field:"RegionTrabajoId",           headerName:'Región Proyecto' ,width:100},
  {field:"LugarPresentacionTrabajo",  headerName:'Lugar Proyecto' ,width:100},
  {field:"IndemnizacionFeriado",      headerName:'Indem. Fer.' ,width:100},
  {
    field:"remuneracionPendiente",
    headerName:'Rem. Pen.',
    width:100,
    valueFormatter: (params) => clpFormat(params.value)
    
  },
  {field:"Email",                     headerName:'Email' ,width:100},
  {field:"CodigoComunaPersonal",      headerName:'Comuna' ,width:100},
  {field:"CallePersonal",             headerName:'Calle',width:100},
  {field:"NumeroPersonal",            headerName:'Número' ,width:100},
  {field:"DepartamentoBlockPersonal", headerName:'Dpto' ,width:100},
  {field:"Telefono",                  headerName:'Teléfono' ,width:100},
  {field:"CuentaTransferencia",       headerName:'Cuenta' ,width:100},
  {field:"BancoId",                   headerName:'Banco' ,width:100},
  {field:"TipoCuentaId",              headerName:'Tipo de Cuenta' ,width:100}

]











export default function Finiquito(){



  const [fecha,setFecha] = React.useState(new Date());
  const [xport, setXport] = React.useState(false);
  const [finiquitoData, setFiniquitoData] = React.useState([])




  React.useEffect(()=>{

    if(!xport) return;


    const month = fecha.getMonth() + 1;
    const year  = fecha.getFullYear();

    axios({
      url: `http://localhost:8000/finiquito/download/${year}/${month}`, //your url
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      // create file link in browser's memory
      const href = URL.createObjectURL(response.data);
  
      // create "a" HTML element with href to file & click
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `finiquitos_${month}_${year}.csv`); //or any other extension
      document.body.appendChild(link);
      link.click();
  
      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });

    setXport(false);


  },[xport])

  React.useEffect(()=>{

    const month = fecha.getMonth() + 1;
    const year  = fecha.getFullYear();

    const url = `http://localhost:8000/finiquito/${year}/${month}`

    axios.get(url)
    .then(response => setFiniquitoData(response.data.data));

  },[fecha])






  return (


    <>
    
      <MonthSelector fecha={fecha} setFecha={setFecha} label={'Mes Previred'}/>
      <br/><br/>

      <Typography variant='subtitle1'>
        <i>
          En esta tabla no aparecen los empleados
          que no tengan un contrato con fecha de inicio
          dentro del mes.
        </i>
      </Typography>
      <br/><br/>
      <Button variant='outlined' onClick={()=>setXport(true)}>EXPORTAR</Button>
      <br/>
      <DataGrid
        getRowId={(row) => row.contrato_id}
        rows={finiquitoData}
        columns={cols}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
    </>

  )

}