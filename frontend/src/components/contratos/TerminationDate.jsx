import * as React from "react";
import { Divider, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {es} from 'date-fns/locale'
import { causaValueLabel, minimoOptions } from "../../data/options";
import statusPOST from "../../utils/statusPOST";
import Dropdown from "../Dropdown";
import { causas } from "../../data/options";
import OptionSelector from "../reusable/OptionSelector";
import axios from "axios";
import Alrt from "../reusable/Alrt";
import sqlErrorSplitter from "../../utils/sqlErrorSplitter";


/*=======================================
    Props List

    id: id of contracto to be terminated.
  =======================================*/
export default function TerminationDate(props){


  const [date, setDate] = React.useState(new Date());
  const [terminate, setTerminate] = React.useState(false);
  const [causa, setCausa] = React.useState(null);
  const [error, setError] = React.useState(null);


  const putData = async () => {



    if(props.formal===1 && causa === null){

      props.notify("Debe seleccionar una causa de término",'error');
      setTerminate(false);
      return;
    }

    const year          = date.getFullYear();
    const month         = date.getMonth()+1;
    const day           = date.getDate();
    const id            = props.contratoID;
    const causa_id      = causa?causa.id:null;

    const termination   = {

      causal:        causa,
      id:            id,
      year:          year,
      month:         month,
      day:           day, 
    } 


    const URL = `http://localhost:8000/contrato/terminate`;


    try{

      const res = await axios.put(URL,termination)
      if(res.status == 201){


        props.notify("Contrado terminado exitosamente",'success')
        props.close();
        setError(null);
        props.getData();
      }
    }
    catch(err){

      setError(err.response.data.message)
      props.notify(err.response.status + ": No se pudo terminar contrato",'error')
    }

  }




    React.useEffect(()=>{

      if(!terminate) return;

      putData();




      setTerminate(false)
      
    }, [terminate]);








    return(

        <div>
            <br/>
            {
              error ?
              <Alrt severity={'error'}>
                  {sqlErrorSplitter(error)}
              </Alrt>
              : <></>
            }
            <br/><br/>
            <Typography>Terminar contrato<b>{!props.formal?' informal ':' '}</b>de {props.nombre}</Typography>
            <br/>




            <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
              <DatePicker
                label={"Fecha de Término del Contrato"}
                value={date}
                minDate={"2020-01-01"}
                maxDate={ "2024-12-31"}
                onChange={(newValue) => {setDate(newValue)}}
                renderInput={(params) => 
                  <TextField {...params}
                  variant="outlined"
                  style={{
                      width:'300px',
                  }}
                  />
                }
              />
            </LocalizationProvider>
            




            
            <br/><br/>

            {
                props.formal ?

                <OptionSelector options={causaValueLabel} value={causa} setter={setCausa} label="Causal de Término de Contrato"/> 

                : <></>
            }
            
            <br/><br/>


            <ButtonGroup size='small' variant="outlined" aria-label="contained primary button group">
                <Button color="primary" onClick={()=>setTerminate(true)}>Guardar</Button>                
                <Button color='error' onClick={props.close}>Cancelar</Button>
            </ButtonGroup>
            <br/>
            <br/>
            <Divider/>
        </div>
    )
}