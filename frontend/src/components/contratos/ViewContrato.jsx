import * as React from "react";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';
import { DataGrid } from '@mui/x-data-grid';


/* Custom Themes for buttons */
import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";
import ProfileContrato from "./ProfileContrato";
import TerminationDate from "./TerminationDate";
import ModalItem from "../reusable/ModalItem";
import statusPOST from "../../utils/statusPOST";
import ModalGrid from "../reusable/ModalGrid";
import TxtField from "../reusable/TxtField";
import DateSelector from "../reusable/DateSelector";
import axios from "axios";
import Grd from "../reusable/Grd";
import Alrt from "../reusable/Alrt";
import sqlErrorSplitter from '../../utils/sqlErrorSplitter';
import RefreshIcon from '@mui/icons-material/Refresh';
import { numberToDate } from "../../utils/date";






export default function ViewContrato(props){



  const [profile, setProfile] = React.useState(false);
  const [nombre,setNombre] = React.useState(null);
  const [rut, setRut] = React.useState(null);
  const [formal, setFormal] = React.useState(null);
  const [empleadoID, setEmpleadoID] = React.useState(null);
  const [contratoID, setContratoID] = React.useState(null);
  const [contrato, setContrato] = React.useState(null);
  const [terminate, setTerminate] = React.useState(false);
  const [openModal,setOpenModal] = React.useState(false);
  const [actualizar, setActualizar] = React.useState(false);
  const [fecha, setFecha] = React.useState(new Date());
  const [costo, setCosto] = React.useState(null);
  const [error, setError] = React.useState(null);



  const hadleCloseModal = () => {

    setCosto(null);
    setFecha(new Date());
    setError(null);
    setOpenModal(false);
  }





  const getData = async function(){

    const url = "http://localhost:8000/contrato";
    const res = await axios.get(url);
    setRows(res.data.data);
  }


  const [rows, setRows] = React.useState([]);


  const cols = [                                                             
                                                                          
    {field:'id',headerName:'ID',width:50},                                   
    {field:'rut',headerName:'RUT',width:120},                                 
    {field:'nombre',headerName:'Nombre',width:230},
    {field:'labor',headerName:'Cargo',width:130},                                  
    {field:'inicio',headerName:'Fecha de Inicio',width:145},
    {

      field: "deleteButton",
      headerName: "Acciones",
      sortable: false,
      width: 250,
      renderCell: (params) => {
        return (
          <ThemeProvider theme={theme}>
            <ButtonGroup size='small'>
              <Button 
                variant='contained' 
                color='green' 
                onClick={() =>{

                  getProfile(params.row.contrato_id);
                  setTerminate(false);

                }} >Ver</Button>

              <Button 
                variant='contained' 
                color='yellow' 
                onClick={() =>{

                  console.log(params.row.contrato_id)
                  setOpenModal(true);
                  setContratoID(params.row.contrato_id);

                }}> Actualizar
              </Button>

              <Button 
                variant='contained' 
                color='error' 
                onClick={()=>{
                  setEmpleadoID(params.row.id);
                  setContratoID(params.row.contrato_id);
                  setFormal(params.row.formal);
                  setNombre(params.row.nombre);
                  setTerminate(true);
                  setProfile(false);
                }}>Terminar
              </Button>
            </ButtonGroup>
          </ThemeProvider>
        );
      }
    }   
  ]


    const getProfile = async (id) => {
  
  
      const url = `http://localhost:8000/contrato/profile/${id}`;
      const res = await axios.get(url);
      setContrato(res.data.data[0]);
      setProfile(true);
    };
  



    React.useEffect(()=>{

      getData();

    }, []);






    const postData = async () => {


      const day = fecha.getDate();
      const month = fecha.getMonth()+1;
      const year = fecha.getFullYear();
      const myDate = numberToDate(year,month,day);


      let contrato = {

          "id"      : contratoID,
          "costo"   : costo,
          "fecha"   : myDate,
      }

      try{

        const res = await axios.post('http://localhost:8000/contrato/actualizar',contrato);
        if (res.status){
          props.notify("Contrado actualizado exitosamente",'success')
          setOpenModal(false);
          setError(false);
          getData(); // update view if model is updated.
        }
      }
      catch(err){

        setError(err.response.data.message)
        props.notify(err.response.status + ": No se pudo crear Anexo",'error')

      }


    }




    /*=====================================
    *   
    *     This method creates an 
    *       'anexo de contrato'
    *
    *======================================*/
    React.useEffect(()=>{

      if(!actualizar) return;

      postData();

      setActualizar(false);


    }, [actualizar])


    return(

        <>

          {/* Actualización de Contrato */}
          <ModalGrid open={openModal} >

            <ModalItem>
            {
              error ?

                  <Alrt severity={'error'}>
                      {sqlErrorSplitter(error)}
                  </Alrt>

              : <></>
            }
            </ModalItem>

            <ModalItem>
              <Typography><b>Actualización de Contrato</b> </Typography>
            </ModalItem>

            <ModalItem>
              <TxtField value={costo} setter={setCosto} label={"Nuevo Costo Diario"}/>
            </ModalItem>

            <ModalItem>
              <DateSelector date={fecha} setDate={setFecha} label={"Fecha de Actualización"}/>
            </ModalItem>



            <ModalItem>
              <ButtonGroup size='small' variant="outlined" aria-label="contained primary button group">
                <Button color='primary' onClick={()=>setActualizar(true)}>Aceptar</Button>
                <Button color='error' onClick={()=>setOpenModal(false)}>Cancelar</Button>
              </ButtonGroup>
            </ModalItem>


          </ModalGrid>

          

          {
            terminate ? 
            <TerminationDate 
              close={()=>setTerminate(false)} 
              empleadoID={empleadoID} 
              contratoID={contratoID}
              formal={formal}
              nombre={nombre}
              getData={getData}
              {...props}
            /> : 
            <></>
          }

          {profile?<ProfileContrato contrato={contrato} close={()=>setProfile(false)} notify={props.notify} getProfile={getProfile}/> :''}



          <div style={{ height: 750, width: '100%' }}>
            <DataGrid rows={rows} columns={cols} pageSize={15} rowsPerPageOptions={[15]}/>
          </div>


        </>
    );

}
