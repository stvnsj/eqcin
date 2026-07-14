import * as React from "react";
import { Modal, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';
import { DataGrid , GridToolbar} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AlertDialog from '../AlertDialog';
import statusPOST from "../../utils/statusPOST";


/* Custom Themes for buttons */
import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";
import clpFormat from "../../utils/clpFormat";
import apiDateTimeFormatter from "../../utils/apiDateTimeFormatter";
import ModalGrid from "../reusable/ModalGrid";
import ModalItem from "../reusable/ModalItem";




export default function RecordGasto(props) {

  

  const [open,setOpen]                = React.useState(false);
  const [nombre,setNombre]            = React.useState(null);
  const [rut, setRut]                 = React.useState(null);
  const [empleadoID, setEmpleadoID]   = React.useState(null);
  const [comentario, setComentario]   = React.useState(null);
  const [del, setDel]                 = React.useState(false);
  const [openDialog, setOpenDialog]   = React.useState(false);
  const [gasto_id, setGasto_id]       = React.useState(false);



  const [rows, setRows] = React.useState([]);

  const rowBuilder = (query) => {
    console.log(query)
    let myRows = []

    query.map(

      (empleado)=>{

        myRows.push(
          {
            id              :empleado.gasto_id, 
            nombre          :empleado.nombre + ' ' + empleado.apellido_paterno,
            rut             :empleado.rut,
            valor           :clpFormat(empleado.valor),
            fecha           :apiDateTimeFormatter(empleado.fecha),
            proyecto        :empleado.proyecto_nombre,
            comentario      :empleado.comentario,
          }
        )
      }
    )

    setRows(myRows);
  }

  const cols = [                                                             
                                                                         
    //{field:'id',headerName:'ID',width:50},                                   
    {field:'nombre',headerName:'Nombre',width:250},
    {field:'rut',headerName:'RUT',width:120},
    {field:'valor',headerName:'Valor',width:120},
    {field:'fecha',headerName:'Fecha',width:120},
    {field:'proyecto',headerName:'Proyecto',width:180},
    {
      field: "deleteButton",
      headerName: "Acción",
      sortable: false,
      width: 130,
      renderCell: (params) => {
        return (
          <Button
            size='small'
            onClick={(e) => { 
              setOpen(true);
              setComentario(params.row.comentario);
            }}
            variant="contained"
          >
            Comentario
          </Button>
        );
      }
    },
    {
      field: "eliminar",
      headerName: "Eliminar",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return (
          <ThemeProvider theme={theme}>
              <Button 
              variant='contained' 
              color='error'
              onClick={function(){
                setOpenDialog(true);
                setGasto_id(params.row.id);
              }}>
                <DeleteIcon/>
                </Button>
          </ThemeProvider>
        );
      } 
    }   
  ]


  React.useEffect(()=>{




    const URL = 

      props.option===props.options.BONO         ? "http://localhost:8000/bono"        :
      props.option===props.options.ANTICIPO     ? "http://localhost:8000/anticipo"    :
      props.option===props.options.DESCUENTO    ? "http://localhost:8000/descuento"   :
      props.option===props.options.TRASLADO     ? "http://localhost:8000/traslado"    :
      
      "";



    const requestOptions = {
      method: 'GET',
    }
    fetch(URL,requestOptions)
    .then((res)=>res.json())
    .then((json)=>{rowBuilder(json.data)});
      
  }, []);



  /* Executed at component rendering */
  React.useEffect(()=>{

    if(!del) return;


    const URL = 

      props.option===props.options.BONO         ? `http://localhost:8000/bono/delete/${gasto_id}`        :
      props.option===props.options.ANTICIPO     ? `http://localhost:8000/anticipo/delete/${gasto_id}`    :
      props.option===props.options.DESCUENTO    ? `http://localhost:8000/descuento/delete/${gasto_id}`   :
      props.option===props.options.TRASLADO     ? `http://localhost:8000/traslado/delete/${gasto_id}`    :
      
      "";


    const requestOptions = {
      method: 'DELETE',
    }

    fetch(URL,requestOptions)
    .then((res)=>statusPOST(res))
    .then((res)=>props.notify("Elemento borrado con éxito"))
    .catch((status) => props.notify(status + ": No se pudo realizar el borrado",'error'));

    setDel(false);

  }, [del]);




return(
    <>

      <AlertDialog 
        handleClose={()=>setOpenDialog(false)} 
        content={`Confirme que desea eliminar`}
        open={openDialog} 
        accept={()=>setDel(true)}
      />
      

      <ModalGrid open={open}>
        <ModalItem>
          <Typography><b>COMENTARIO:</b></Typography>
          {comentario}
        </ModalItem>
        <ModalItem>
          <ButtonGroup size='small' variant="outlined" aria-label="contained primary button group">
            <Button color='primary' onClick={()=>setOpen(false)}>Cerrar</Button>
          </ButtonGroup>
        </ModalItem>
      </ModalGrid>
      
      <div style={{ height: 750, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={cols}
          pageSize={7}
          rowsPerPageOptions={[7]}
        />
      </div>
    </>
);
}