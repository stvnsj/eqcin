import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
/* Custom Themes for buttons */
import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";
import Button from "@mui/material/Button";
import apiDateTimeFormatter from '../../utils/apiDateTimeFormatter';
import { Box } from '@mui/system';
import clpFormat from '../../utils/clpFormat';

                                                                           




export default function RecordMinimo () {

  const [rows, setRows] = React.useState([]);


  const [clickedRow, setClickedRow] = React.useState();
  const onButtonClick = (e, row) => {
    e.stopPropagation();
    setClickedRow(row);
  };



  const cols = [                                                             
                                                                           
    {field:'id',headerName:'ID',width:50},                                   
    {field:'valor',headerName:'Valor',width:150},                                 
    {field:'fecha',headerName:'Fecha',width:150},
    {
      field: "deleteButton",
      headerName: "Acción",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return (
            <ThemeProvider theme={theme}>
                <Button
                  size='small'
                  color='terminate'
                  onClick={(e) => {
                    onButtonClick(e, params.row);
                
                  }}
                  variant="contained"
                >
                  Borrar
                </Button>
            </ThemeProvider>  
        );
      }
    }                                          
  ]   

  
  
  const rowBuilder = (query) => {

    let myRows = []

    query.map(

      (minimo)=>{

        myRows.push(
          {
            id     :minimo.id, 
            valor  :clpFormat(minimo.sueldo), 
            fecha  :apiDateTimeFormatter(minimo.fecha), 
          }
        )
      }
    )

    setRows(myRows);
  }
  


  React.useEffect(()=>{

    const url = "http://localhost:8000/minimo";

    const requestOptions = {
      method: 'GET',
    }

    fetch(url,requestOptions)
    .then((res)=>res.json())
    .then((json)=>{rowBuilder(json.data)});


  }, []);


  return (

    <Box
        display="flex"
        justifyContent="center"

    >
        <div style={{ height: 600, width: '50%' }}>
        <DataGrid
            onRowClick={(selection)=>console.log(selection.id)}
            rows={rows}
            columns={cols}
            pageSize={14}
            rowsPerPageOptions={[14]}
        />
        </div>
    </Box>


  );
}