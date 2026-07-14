import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import * as React from "react";
import { Typography } from "@mui/material"
import { DataGrid } from '@mui/x-data-grid';
import { CreateIcon,Book, Create } from '@mui/icons-material';
import FormGasto from './FormGasto';
import axios from 'axios';


export default function CreateGasto(props){

  const [open,setOpen] = React.useState(false);
  const [nombre,setNombre] = React.useState(null);
  const [rut, setRut] = React.useState(null);
  const [empleadoID, setEmpleadoID] = React.useState(null);



  const [rows, setRows] = React.useState([]);



  const cols = [                                                             
                                                                         
    {field:'id',       headerName:'ID',        width:50},                                   
    {field:'nombre',   headerName:'Nombre',    width:200},                               
    {field:'rut',      headerName:'RUT',       width:140},                                 
    {field:'email',    headerName:'Email',     width:200},                             
    {field:'telefono', headerName:'Teléfono',  width:150},
    {
      field: "deleteButton",
      headerName: "Acción",
      sortable: false,
      width: 160,
      renderCell: (params) => {
        return (
          <Button
            size='small'
            onClick={(e) => {
              console.log(params.row)
              setOpen(true)
              setNombre(params.row.nombre)
              setEmpleadoID(params.row.id)
            }}
            variant="contained"
          >

            Crear

          </Button>
        );
      }
    }   
  ]


  React.useEffect(()=>{

    const url = "http://localhost:8000/empleado";

    axios
    .get(url)
    .then(res => setRows(res.data.data));


  }, []);


  return(
    <>
      {open ? <FormGasto close={()=>setOpen(false)} empleadoID={empleadoID} nombre={nombre} {...props}/> : <></>}
      <div style={{ height: 750, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={cols}
          pageSize={15}
          rowsPerPageOptions={[15]}
        />
      </div>
    </>
  );
}