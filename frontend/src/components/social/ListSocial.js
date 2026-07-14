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
import { stringToDate } from "../../utils/date";
import Dropdown from "../Dropdown";



export default function ListSocial(){

  const [fecha, setFecha]               =  useState(new Date());
  const [previredData, setPreviredData] =  useState([]);

  const [aporte1, setAporte1]           =  useState('');
  const [aporte2, setAporte2]           =  useState('');
  const [aporte3, setAporte3]           =  useState('');
  const [aporte4, setAporte4]           =  useState('');
  const [aporte5, setAporte5]           =  useState('');




  /* proyecto state variables. */
  const [proyecto, setProyecto] = useState(null);
  const [options, setOptions]   = useState([]);

  

  const proyectoOptions = (query) => {
    
    let opt = query.map( proyecto =>(
        {id: proyecto.id, label: proyecto.nombre + "; ID:" + proyecto.id}
    ))
    
    setOptions(opt);
}



  const [open, setOpen]                 =  useState(false);
  const [postModal, setPostModal]       =  useState(false);
  const [contratoId, setContratoId]     =  useState(null);

  // Entry Data
  const [nombre, setNombre]             =  useState(null);
  const [id, setId]                     =  useState(null);


  const handleOpen = (row) => () => {

    setNombre(row.nombre);
    setId(row.id)
    setContratoId(row.contrato_id);
    setOpen(true);
  }

  const handleClose = () => {


    setOpen(false);
    setAporte1('');
    setAporte2('');
    setAporte3('');
    setAporte4('');

  }

  const handleAccept = () => {

    setPostModal(true);
    setOpen(false);
  }


  /* Ntfy component variables and functions */
  const [ntfyProps, setNtfyProps] = useState({open:false,content:'',severity:"success"});
  const notify    = (content, severity) => setNtfyProps({open: true, content:content, severity:severity})
  const dinotify  = () => setNtfyProps({...ntfyProps, open: false})



  const getPreviredData = function () {

    const year  = fecha.getFullYear();
    const month = fecha.getMonth() + 1;

    const url = `http://localhost:8000/social/${year}/${month}`;

    axios
    .get(url)
    .then(response => setPreviredData(response.data.data));

  }


  const postPreviredData = async function () {

    const year         = fecha.getFullYear();
    const month        = fecha.getMonth() + 1;
    const date         = stringToDate(year, month);
    const proyecto_id  = proyecto?.id;

    const entry = {

      empleado_id : id,
      valor       : (
        parseInt(aporte1?aporte1:0) + parseInt(aporte2?aporte2:0) + 
        parseInt(aporte3?aporte3:0) + parseInt(aporte4?aporte4:0) +
        parseInt(aporte5?aporte5:0)
      ),
      fecha       : date,
      contrato_id : contratoId,
      proyecto_id : proyecto_id
    }

    const urlPost = `http://localhost:8000/social/create/`;
    const resPost = await axios.post(urlPost,entry);
    if(resPost.status == 201){

      notify('Ingreso de Previred exitoso',"success");

    }
    else{

      notify('Ingreso no se pudo realizar',"success");
    }


    const urlGet = `http://localhost:8000/social/${year}/${month}`;
    const resGet = await axios.get(urlGet)
    setPreviredData(resGet.data.data);

    setAporte1('');
    setAporte2('');
    setAporte3('');
    setAporte4('');
    setAporte5('');
  }








  useEffect(()=>{

    getPreviredData();

  },[fecha])






  useEffect(()=> {

    if(!postModal) return;

    postPreviredData();

    setPostModal(false);

  },[postModal])



  useEffect(()=>{

    const url = `http://localhost:8000/proyecto`;

    const requestOptions = {
      method: 'GET',
    }
    fetch(url,requestOptions)
    .then((res)=>res.json())
    .then((json)=>{proyectoOptions(json.data)});

  }, []);



  const cols = [

    {field:'id',          headerName:'ID',       width:30},
    {field:'nombre',      headerName:'Nombre',   width:240},
    {
      field:'total',
      headerName:'Aporte',
      width:200, 
      valueFormatter: params => clpFormat(params?.value)
    },
    {
      field: "accion",
      headerName: "Acción",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return (
          <ThemeProvider theme={theme}>
            <Button
              size='small'
              color='green'
              onClick={handleOpen(params.row)}
              variant="contained"
            >
              <AttachMoneyIcon/>
            </Button>
          </ThemeProvider>  
        );
      }
    }
  ]



  return (

    <>
      <Ntfy {...ntfyProps} close={dinotify}/>


      {/* ==============Modal Component============== */}
      <ModalGrid open={open}>
        <ModalItem>
          <Typography>
            {nombre}<br/>
          </Typography>
        </ModalItem>

        <ModalItem>
        <Dropdown 
                options={options} 
                value={proyecto} 
                label={"Proyecto"} 
                changeHandler={setProyecto}
            /> 
            
        </ModalItem>

        <ModalItem>
          <TxtField value={aporte1} setter={setAporte1} label={"Monto 1"}/>
        </ModalItem>
        
        <ModalItem>
          <TxtField value={aporte2} setter={setAporte2} label={"Monto 2"}/>
        </ModalItem>

        <ModalItem>
          <TxtField value={aporte3} setter={setAporte3} label={"Monto 3"}/>
        </ModalItem>

        <ModalItem>
          <TxtField value={aporte4} setter={setAporte4} label={"Monto 4"}/>   
        </ModalItem>

        <ModalItem>
          <TxtField value={aporte5} setter={setAporte5} label={"Monto 5"}/>   
        </ModalItem>


        <ModalItem>
          <ThemeProvider theme={theme}>
            <ButtonGroup>
              <Button color="green" variant="contained" onClick={handleAccept}>PAGAR</Button>
              <Button color="terminate" variant="contained" onClick={handleClose}>CANCELAR</Button>
            </ButtonGroup>
          </ThemeProvider>
        </ModalItem>
      </ModalGrid>
      {/* ============================================ */}




      <Grd>
        <Grd item={true}>
          <Typography variant="body1">
            En esta sección se registran los 
            gastos asociados a FONASA, AFP y
            Seguro de Cesantía
          </Typography>
        </Grd>
        <Grd item={true}>
          <MonthSelector fecha={fecha} setFecha={setFecha} label={"MES"}/>
        </Grd>
        <Grd item={true}>
          <div style={{ height: 600, width: 800 }}>
            <DataGrid
              getRowId={(row) => row.contrato_id}
              disableSelectionOnClick
              rows={previredData}
              columns={cols}
            />
          </div>
        </Grd>
      </Grd>
    </>
  );
}