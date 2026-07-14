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


export default function ReportEmpresa(props){


  const [proyecto, setProyecto] = React.useState([]);
  const [fecha, setFecha] = React.useState(new Date());


  const [rows, setRows] = React.useState([]);


  const rowBuilder = (query) => {

    setProyecto(
      [
        {field:'Días Trabajados',                      content:query.DT},
        {field:'Sueldo Pactado Mensual',               content:clpFormat(query.sueldo_mensual)},
        {field:'Bonos',                                content:clpFormat(query.total_bonos)},
        {field:'Descuentos',                           content:clpFormat(query.total_descuentos)},
        {field:'Sueldo Líquido',                       content:clpFormat(query.liquido)},
        {field:'Total Finiquitos',                     content:clpFormat(query.finiquito)},
        {field:"TOTAL",                                content:clpFormat(query.total)},
        {field:'Total Anticipos',                      content:clpFormat(query.total_anticipos)},
        {field:'Saldo',                                content:clpFormat(query.total_saldos)},
      ]
    )
  }

    

  



  React.useEffect(()=>{



    const requestOptions = {
      method: 'GET',
    }


    const URL = `http://localhost:8000/empresa/report/year/${fecha.getFullYear()}/month/${fecha.getMonth()+1}`;
    


    fetch(URL,requestOptions)
    .then((res)=>res.json())
    .then((json)=>{
      rowBuilder(json.data[0])
    });
      
  }, [fecha]);


  return(
    <> 
      <Typography variant="body2" minHeight={'10vh'}>
        En esta sección se presenta un resumen mensual a nivel de empresa.<br/>
      </Typography>

      <MonthSelector fecha={fecha} setFecha={setFecha} label={"Mes Reportado"}/>

      <Box display="flex" justifyContent="center" alignItems="center" minHeight="75vh">
        <div style={{ width: '50%'}}>
          <Typography variant='body1'><b>Empresa</b></Typography>
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
    </>
  );
}