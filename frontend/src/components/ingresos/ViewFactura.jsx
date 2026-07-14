import { useEffect, useState } from "react";
import MonthSelector from '../reusable/MonthSelector';
import { DataGrid } from "@mui/x-data-grid";
import clpFormat from "../../utils/clpFormat";
import axios from "axios";
import { Button, ButtonGroup } from "@mui/material";
import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";
import EditCosto from "../costos/EditCosto";

import AlertDialog from "../AlertDialog";




export default function ViewFactura(){

  const [fecha,setFecha]                = useState(new Date());
  const [editProps, setEditProps]       = useState({});
  const [rows, setRows]                 = useState([]);
  const [edit, setEdit]                 = useState(false);
  const [id, setId]                     = useState(null);
  const [update, setUpdate]             = useState(false);
  const [openConfirmation,setOpenConfirmation]               = useState(false);
  const [deletedTransferencia,setDeletedTransferencia]       = useState({});


  const deleteData = async () => {

    const url = `
    
      http://localhost:8000/costo/delete/facturas/${deletedTransferencia.id}
    

    `

    try{

      const res = await axios.delete(url);
      setUpdate(true);

    }

    catch(e){


    }
  }




  const getData = async () => {

    const url = `http://localhost:8000/ingreso/factura/year/${fecha.getFullYear()}/month/${fecha.getMonth()+1}`;

    try{

      const res = await axios.get(url);
      findEditedFactura(res.data.data,id);
      setRows(res.data.data);

    }
    catch(err) {

    }
  }


  const findEditedFactura = (data, factura_id) => {

    if(factura_id == null) return;

    const b = data.find(factura => factura_id === factura.id );



    setEditProps({

      getData           :()=>{setUpdate(true)},
      documento         :"facturas",
      id                :b.id,
      nombre            :b.razon_social,
      rut               :b.rut,
      serie             :b.folio,
      fecha             :b.fecha,
      valor             :b.valor,
      proyecto_id       :b.proyecto_id,
      categoria_id      :b.categoria_id,
      proyecto_nombre   :b.proyecto_nombre,
      categoria         :b.categoria,
      comentario        :b.comentario,
    })

    

  }









  const cols = [                                                             

      {field:'id',headerName:'ID',width:15},
      {
      field: "viewButton",
      headerName: "",
      sortable: false,
      width: 130,
      renderCell: (params) => {
        return (
          <ThemeProvider theme={theme}>
            <ButtonGroup>
              <Button
                size='small'
                color='view'
                onClick={(e) => {
                  
                  
                  setId(params.row.id);
                  findEditedFactura([params.row],params.row.id)
                  setEdit(true);
                  
                  
                }}
                variant="contained"
                >
                Ver
              </Button>


              <Button
                size='small'
                color='delete'
                variant='contained'
                onClick={()=>{
                  setDeletedTransferencia({
                    id      : params.row.id,
                    nombre  : params.row.razon_social,
                    valor   : params.row.valor,
                    fecha   : params.row.fecha 
                  })
                  setOpenConfirmation(true)
                }}
              >
                

                Borrar
              </Button>


            </ButtonGroup>

          </ThemeProvider>  
        );
      }
    },
    {field:'rut',headerName:'RUT',width:90},
    {field:'folio',headerName:'Folio',width:90},                               
    {field:'fecha',headerName:'Fecha',width:100},
    {field:'valor',headerName:'Monto',width:80,valueFormatter: params => clpFormat(params?.value)},
    {field:'razon_social',headerName:'Razon Social',width:190},
    {field:'categoria',headerName:'Categoria',width:120},
    {field:'proyecto_nombre',headerName:'Proyecto',width:185},
    {field:'fecha_registro',headerName:'Fecha Registro',width:185},
  ]










  
  useEffect(()=>{

    getData();
    setEdit(false);


  }, [fecha]);


  /* Executed at component rendering */
  useEffect(()=>{

    if(!update) return;

    getData();

    setUpdate(false);

  }, [update]);


    


  return(

      <>
        <AlertDialog        
          handleClose={()=>setOpenConfirmation(false)} 
          content={
            <>
              Confirme que desea borrar la transferencia a nombre de <b>{deletedTransferencia.nombre}</b> <br/>
              por un monto de <b>{clpFormat(deletedTransferencia.valor)}</b>, con fecha <b>{deletedTransferencia.fecha}</b>
            </>
          }
          open={openConfirmation} 
          accept={()=>deleteData(true)}
        />  
        <MonthSelector fecha={fecha} setFecha={setFecha} label={'Mes Factura'}/>
        {edit?<EditCosto closeEdition={()=>setEdit(false)} {... editProps}/>:<></>}
        <div style={{ height: 750, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={cols}
            pageSize={15}
            rowsPerPageOptions={[15]}
          />
        </div>
      </>
  )
}
