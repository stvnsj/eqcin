import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import apiDateTimeFormatter from '../../utils/apiDateTimeFormatter'
import ProfileProyecto from './ProfileProyecto'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import AddEmpleado from './AddEmpleado';
import AsistenciaProyecto from './AsistenciaProyecto';
import EmpleadosProyecto from './EmpleadosProyecto';

/* Custom Themes for buttons */
import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";




export default function DeactivateProyecto(){



  /*  STATE VARIABLES */
  const [rows, setRows] = React.useState([]);
  const [proyectoID, setProyectoID] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState([])



  const [clickedRow, setClickedRow] = React.useState();
  const onButtonClick = (e, row) => {
    e.stopPropagation();
    setClickedRow(row);
  };


  const cols = [                                                             

    {field:'id',headerName:'ID',width:50},                                   
    {field:'nombre',headerName:'Nombre',width:300},
    {field:'lugar',headerName:'Lugar',width:300},
    {field:'inicio',headerName:'Inicio',width:200},
    {
        field: "deleteButton",
        headerName: "Acción",
        sortable: false,
        width: 130,
        renderCell: (params) => {
          return (
              <ThemeProvider theme={theme}>
                <Button
                  size='small'
                  color='terminate'
                  onClick={(e) => {
                    onButtonClick(e, params.row)
                    console.log(params.row)
                  }}
                  variant="contained"
                >
                  Desactivar
                </Button>
              </ThemeProvider>
          );
        }
    }   
  
  ]
  


  const rowBuilder = (q) => {

    let myRows = []

    q.map(

      (proyecto)=>{

        myRows.push(
          {
            id:proyecto.id, 
            nombre:proyecto.nombre, 
            inicio:apiDateTimeFormatter(proyecto.fecha_inicio),
            lugar:proyecto.lugar,
          }
        )
      }
    )

    setRows(myRows);

    return q;
  }
  


  /**********************
  *  useEffect Section  *
  ***********************/

  /* Executed at component rendering */
  React.useEffect(()=>{

    const url = "http://localhost:8000/proyecto";

    const requestOptions = {
      method: 'GET',
    }

    fetch(url,requestOptions)
    .then((res)=>res.json())
    .then((json)=>{
      rowBuilder(json.data)
      setQuery(json.data)
    })



  }, []);

  /* Executed when 'profile' state 
  variable is updated. */
  React.useEffect(()=>{


  }, [open])





  if(!open)
  return (

    <div style={{ height: 400, width: '100%' }}>
      <DataGrid

        onRowClick={(selection)=>{

          setProyectoID(selection.id);
          setOpen(true);

        }}

        rows={rows}
        columns={cols}
        pageSize={5}
        rowsPerPageOptions={[5]}

      />
    </div>
  );
  
  
  return (
    <>    
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid

          onRowClick={(selection)=>{



          }}

          rows={rows}
          columns={cols}
          pageSize={5}
          rowsPerPageOptions={[5]}

        />
      </div>
      <br/>
      <br/>

    </>


  );
}


