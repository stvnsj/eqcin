import { Button, ButtonGroup, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import clpFormat from "../../utils/clpFormat";
import Grd from "../reusable/Grd";
import MonthSelector from "../reusable/MonthSelector";
import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";
import ModalGrid from "../reusable/ModalGrid";
import ModalItem from "../reusable/ModalItem";
import TxtField from "../reusable/TxtField";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Ntfy from "../reusable/Ntfy";
import { numberToDate } from "../../utils/date";




  




export default function ListSueldo(props){



  const [fecha, setFecha]                   = useState(new Date());
  const [sueldosData, setSueldosData]       = useState([]);
  const [maxPago, setMaxPago]               = useState(0);
  const [pago, setPago]                     = useState(null);
  const [contratoId, setContratoId]         = useState(null);
  const [nombre, setNombre]                 = useState('');
  const [open, setOpen]                     = useState(false);
  const [selectedData, setSelectedData]     = useState([])
  const [postSelection, setPostSelection]   = useState(false);
  const [postModal, setPostModal]           = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [id, setId]                         = useState(null);



  /******************************************/ 
  /* Ntfy component variables and functions */
  const [ntfyProps, setNtfyProps] = useState({open:false,content:'',severity:"success"});
  const notify    = (content, severity) => setNtfyProps({open: true, content:content, severity:severity})
  const dinotify  = () => setNtfyProps({...ntfyProps, open: false})
  /******************************************/  




  const openHandler = (row) => {

    setOpen(true);
    setNombre(row.nombre);
    setMaxPago(row.total);
    setContratoId(row.contrato_id);
    setId(row.id);
  }



  // COLUMNS
  const cols = [

    {field:'id',          headerName:'ID',          width:30},
    {field:'nombre',      headerName:'Nombre',      width:220},
    {field:'contrato_id', headerName:'ID contrato', width:100},
    {
      field:'total',
      headerName:'Saldo',
      width:180, 
      valueFormatter: params => clpFormat(params?.value)
    },
    {
      field: "accion",
      headerName: "Acción",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        if (params.row.total == 0) return "SIN SALDO";
        return (
          <ThemeProvider theme={theme}>
            <Button
              size='small'
              color='green'
              onClick={() => openHandler(params.row)}
              variant="contained"
            >
              <AttachMoneyIcon/>
            </Button>
          </ThemeProvider>  
        );
      }
    } 
  ]


  useEffect(()=>{


    funPostMultiple();

  },[postSelection])


  const funPostMultiple = async function(){

    if(!postSelection){
      
      return;
    }


    if(selectedData.length===0){

      setPostModal(false);
      notify(`No ha seleccionado empleados`, "warning")
      return
    }

    

    const year  = fecha.getFullYear();
    const month = fecha.getMonth() + 1;

   

    try{

      const res = await axios.post('http://localhost:8000/sueldo/create/multiple', selectedData);
      notify('Selección de pagos realizada exitosamente',"success");
      setPago(null);

    } catch (err) {


      notify(`${err.response.status}: ${err.response.data.message}`, "error")
    }



    await axios.get(`http://localhost:8000/sueldo/${year}/${month}`)
    .then(response => {

      setSueldosData(response.data.data)

    });

    setPostSelection(false);
    setSelectionModel([]);
  
  }

  useEffect(()=>{

    if(!postModal) return;

    funPostSingle();
    setPostModal(false)

  },[postModal])





  const funPostSingle = async function(){


    const year  = fecha.getFullYear();
    const month = fecha.getMonth() + 1;
    let fecha_registro = numberToDate(year,month);
    const valor = pago;


    if (pago > maxPago) {
      notify("El pago no puede ser mayor que el saldo","error")
      return;
    }

    const entry = {

      empleado_id   : id,
      valor         : valor,
      fecha         : fecha_registro,
      contrato_id   : contratoId,
    }



    try{
      const res = await axios.post('http://localhost:8000/sueldo/create/single', entry);
      if(res.status==201) {
        notify('Pago realizado exitosamente',"success");
        setPago(null);
      }
    }
    catch(err){

      notify(`${err.response.status}: ${err.response.data.message}`, "error")
    }


    axios.get(`http://localhost:8000/sueldo/${year}/${month}`)
    .then(response => {

      setSueldosData(response.data.data)
      setOpen(false);

    });

    setPostSelection(false);
    setSelectionModel([]);

  }






  useEffect(()=>{

    const year  = fecha.getFullYear();
    const month = fecha.getMonth() + 1;

    const url = `http://localhost:8000/sueldo/${year}/${month}`;

    axios.get(url)
    .then(response => {
      setSueldosData(response.data.data)
    });

  },[fecha])



  return (



    <>
      <Ntfy {...ntfyProps} close={dinotify}/>
      <ModalGrid open={open}>
        <ModalItem>
          <Typography>
            {nombre}<br/>
            <i>{pago > maxPago ? "Monto excede el saldo del empleado" : ""}</i>
          </Typography>
        </ModalItem>
        <ModalItem>
          <TxtField value={pago} setter={setPago} label={"Monto"}/>
        </ModalItem>
        <ModalItem>
          <ThemeProvider theme={theme}>
            <ButtonGroup>
              <Button color="green" variant="contained" onClick={()=> setPostModal(true)}>PAGAR</Button>
              <Button color="terminate" variant="contained" onClick={()=> setOpen(false)}>CANCELAR</Button>
            </ButtonGroup>
          </ThemeProvider>
        </ModalItem>
      </ModalGrid>

      <Grd>


        <Grd item={true}>
          <MonthSelector fecha={fecha} setFecha={setFecha} label={"MES"}/>
        </Grd>


        <Grd item={true}>
          <ThemeProvider theme={theme}>
            <Button onClick={()=>setPostSelection(true)} variant="contained" color={"green"}>
              PAGAR
            </Button>
          </ThemeProvider>
        </Grd>



        <Grd item={true}>
          <div style={{ height: 600, width: 800 }}>
            <DataGrid
              getRowId={(row) => row.contrato_id}
              disableSelectionOnClick
              isRowSelectable={(params) => params.row.total > 0}
              checkboxSelection={true}
              rows={sueldosData}
              columns={cols}
              onSelectionModelChange={(ids) => {

                setSelectionModel(ids);
                const year  = fecha.getFullYear();
                const month = fecha.getMonth() + 1;
                let fecha_registro = numberToDate(year,month);


                setSelectedData(

                  sueldosData
                  .filter(sueldo => (ids.includes(sueldo.contrato_id) && sueldo.total > 0))
                  .map(sueldo => ({

                    id:            sueldo.id, 
                    valor:         sueldo.total,
                    fecha:         fecha_registro, 
                    contrato_id:   sueldo.contrato_id
                    
                  }))
                )
                  
              }}
              selectionModel={selectionModel}
            />
          </div>
        </Grd>




      </Grd>
    </>



  );
}