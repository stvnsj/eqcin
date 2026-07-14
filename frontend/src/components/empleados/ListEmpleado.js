import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";
import { Button, formGroupClasses, Modal } from '@mui/material';
import ProfileEmpleado from './ProfileEmpleado';

                                                                           



export default function ListEmpleado (props) {

  const [rows, setRows] = React.useState([]);

  const [profile, setProfile] = React.useState(false);
  const [empleado, setEmpleado] = React.useState([]);
  const [edit,setEdit] = React.useState(false)




  
  const [clickedRow, setClickedRow] = React.useState();




  const cols = [                                                             
                                                                           
    {field:'id',headerName:'ID',width:50},                                   
    {field:'nombre',headerName:'Nombres',width:350},                               
    {field:'rut',headerName:'RUT',width:200},                                 
    {
      field: "viewButton",
      headerName: "Acción 1",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return (
          <ThemeProvider theme={theme}>
            <Button
              size='small'
              color='view'
              onClick={(e) => {
                getProfile(params.row.id)
              }}
              variant="contained"
            >
              Ver
            </Button>
          </ThemeProvider>  
        );
      }
    }                     
  ]   
  

  const rowBuilder = (query) => {

    let myRows = []

    query.map(

      (empleado)=>{

        myRows.push(
          {
            id:       empleado.id, 
            rut:      empleado.rut, 
            nombre:   empleado.nombre,
          }
        )
      }
    )

    setRows(myRows);
  }




  const getProfile = (id) => {


    const url = `http://localhost:8000/empleado/${id}`;

    const requestOptions = {
      method: 'GET',
    }

    fetch(url,requestOptions)
    .then((res)=>res.json())
    .then((json)=>{
      setEmpleado(json.data[0]);
      setProfile(true);
    });
  };
  


  React.useEffect(()=>{

    const url = "http://localhost:8000/empleado/list";

    const requestOptions = {
      method: 'GET',
    }

    fetch(url,requestOptions)
    .then((res)=>res.json())
    .then((json)=>{rowBuilder(json.data)});


  }, []);


  return (

    <>

      {profile?<ProfileEmpleado empleado={empleado} close={()=>setProfile(false)} notify={props.notify}/>:''}
      
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