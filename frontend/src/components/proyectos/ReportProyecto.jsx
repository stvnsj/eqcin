import * as React from "react";
import { Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import Box from "@mui/material/Box";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



import clpFormat from "../../utils/clpFormat";


/* Custom Themes for buttons */
import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";
import MonthSelector from "../reusable/MonthSelector";







export default function ReportProyecto(props){




  const [proyecto, setProyecto] = React.useState([]);
  const [fecha, setFecha] = React.useState(new Date());
  const [rows, setRows] = React.useState([]);




  const rowBuilder = (query) => {

    let myRows = []

    query.map(

      (empleado)=>{
          
        if(empleado.proyecto===0)  
        myRows.push(
          {
            id:                  empleado.empleado_id,
            nombre:              empleado.nombre,
            DT:                  empleado.DT,
            sueldo_mensual:      clpFormat(empleado.sueldo_mensual),
            total_bonos:         clpFormat(empleado.total_bonos),
            total_descuentos:    clpFormat(empleado.total_descuentos),
            total_traslados:     clpFormat(empleado.total_traslados),
            liquido:             clpFormat(empleado.liquido),
            total:               clpFormat(empleado.total),
            proyecto:            empleado.proyecto,
          }
        )
        else if(empleado.proyecto===1){
          setProyecto(
            [
              {field:'Días Trabajados',   content:empleado.DT},
              {field:'Sueldo Mensual',    content:clpFormat(empleado.sueldo_mensual)},
              {field:'Total Bonos',       content:clpFormat(empleado.total_bonos)},
              {field:'Total Descuentos',  content:clpFormat(empleado.total_descuentos)},
              {field:'Sueldo Líquido',    content:clpFormat(empleado.liquido)},
              {field:'Total Traslados',   content:clpFormat(empleado.total_traslados)},
              {field:'TOTAL',             content:clpFormat(empleado.total)},
            ]
          )
        }
      }
    )

    setRows(myRows);
  }

  const cols = [                                                             

    {field:'nombre',            headerName:'Nombre',              width:200}, 
    {field:'DT',                headerName:'DT',                  width:40}, 
    {field:'sueldo_mensual',    headerName:'Sueldo Pactado',      width:130}, 
    {field:'total_bonos',       headerName:'Bonos Totales',       width:130},
    {field:'total_descuentos',  headerName:'Descuentos Totales',  width:150}, 
    {field:'liquido',           headerName:'Sueldo Líquido',      width:180},
    {field:'total_traslados',   headerName:'Traslados Totales',   width:130}, 
    {field:'total',             headerName:'TOTAL',               width:100},
  ]


  React.useEffect(()=>{



    const requestOptions = {
      method: 'GET',
    }


    const URL = `http://localhost:8000/proyecto/report/id/${props.proyectoID}/year/${fecha.getFullYear()}/month/${fecha.getMonth()+1}`;
    


    fetch(URL,requestOptions)
    .then((res)=>res.json())
    .then((json)=>{
      rowBuilder(json.data)
    });
      
  }, [fecha]);


  return(
    <> 
      <Typography variant="body2" minHeight={'10vh'}>
        En esta sección se presenta un resumen mensual a nivel de<br/>
        proyecto y de los empleados que participaron en él durante el mes.<br/>
      </Typography>

      <MonthSelector fecha={fecha} setFecha={setFecha} label={"Mes Reportado"}/>
      
      <br/>

      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <div style={{ width: '50%'}}>
          <Typography variant='body1'> <b>Proyecto</b> </Typography>
          <TableContainer component={Paper} sx={{border:1}}>
            <Table aria-label="simple table">
              <TableBody>
                {proyecto.map((row) => (
                  <TableRow key={row.field} >
                    <TableCell component="th" scope="row"><b>{row.field}</b></TableCell>
                    <TableCell align="right">{row.content}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>



      <Typography variant='body1'>
        <b>Personal</b>
      </Typography>
      <div style={{ height: 750, width: '100%' }}>
        <DataGrid rows={rows} columns={cols} pageSize={15} rowsPerPageOptions={[15]} sx={{border:1}}/>
      </div>
    </>
  );
}