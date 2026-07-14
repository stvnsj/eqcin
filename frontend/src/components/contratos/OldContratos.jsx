import * as React from "react";
import { Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import clpFormat from "../../utils/clpFormat";
import { causa_finiquito } from "../../data/dict";
import Button from "@mui/material/Button";
import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";
import EditIcon from '@mui/icons-material/Edit';
import FiniquitoProject from "./FiniquitoProject";
import axios from "axios";


export default function OldContratos(props){

    const [open,setOpen] = React.useState(false);
    const [nombre,setNombre] = React.useState(null);
    const [rut, setRut] = React.useState(null);
    const [empleadoID,setEmpleadoID] = React.useState(null);
    const [contratoID,setContratoID] = React.useState(null);
    const [rows, setRows] = React.useState([]);



    const cols = [                                                                                                                         
      {
        field: "deleteButton",
        headerName: "Editar",
        sortable: false,
        width: 75,
        renderCell: (params) => {
          return (
            <ThemeProvider theme={theme}>
              <Button
                size='small'
                color='yellow'
                onClick={(e) => {
                  setOpen(true)
                  setNombre(params.row.nombre + " (" + params.row.rut + ")" )
                  setEmpleadoID(params.row.id)
                  setContratoID(params.row.contrato_id);
                }}
                variant="contained"
              >
                <EditIcon/>
              </Button>
            </ThemeProvider>  
          );
        }
      },
      {field:'nombre',headerName:'Nombre',width:200}, 
      {field:'rut',headerName:'RUT',width:120}, 
      {field:'inicio',headerName:'Inicio',width:110}, 
      {field:'termino',headerName:'Término',width:110},
      {field:'causal_id', headerName:'Causal',width:250, valueFormatter: params => causa_finiquito[params.value] }, 
      {field:'proyecto_nombre',headerName:'Último Proyecto',width:160},
      {field:'finiquito',headerName:'Finiquito',width:100, valueFormatter: params => clpFormat(params.value )},
      {field:'proyecto_finiquito_nombre',headerName:'Proyecto Finiquito',width:200}
    ]






    const getData = async function (){

        const url = "http://localhost:8000/contrato/old";
        try{
            const res = await axios.get(url);
            console.log(res.data.data[0])
            const newRow = await res.data.data.map(
                    c => ({
                      'nombre' : c.nombre,
                      'rut' : c.rut,
                      'inicio' : c.inicio,
                      'termino' : c.termino, 
                      'causal_id' : c.causal_id,
                      'proyecto_nombre' : c.proyecto_nombre,
                      'finiquito' : c.finiquito,
                      'proyecto_finiquito_nombre' : c.proyecto_finiquito_nombre,
                      'contrato_id': c.contrato_id

                        }))
            setRows(newRow);


                        
        } catch(error) {console.log(error);}
    };
    



    //const getData = () => {
//
    //  const url = "http://localhost:8000/contrato/old";
  //
    //  const requestOptions = {
    //    method: 'GET',
    //  }
    //  fetch(url,requestOptions)
    //  .then((res)=>res.json())
    //  .then((json)=>{
    //    setRows(json.data);
    //    setOpen(false);
    //  });
//
    //  console.log(rows)
    //}










    React.useEffect(()=>{

      getData()
        
    }, []);


    
    React.useEffect(()=> {



    },[props.proyectoID])


  return(
    <>  

      <Typography variant='body1'>
        <b>Archivo de Contratos Antiguos</b> 
      </Typography>

      <br/> 
      <br/>


      { open ? 
        <FiniquitoProject 
          getData={getData}
          close={()=>setOpen(false)} 
          empleadoID={empleadoID} 
          contratoID={contratoID} 
          nombre={nombre} 
          {...props}
        /> 
        : <></>
      }
      
      <div style={{ height: 1150, width: '100%' }}>
        hola
        <DataGrid
          getRowId={(row => row.contrato_id)}
          rows={rows}
          columns={cols}
          pageSize={30}
          rowHeight={34}
          rowsPerPageOptions={[30]}
        />
      </div>
    </>
  );
}