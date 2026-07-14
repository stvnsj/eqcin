import Button from '@mui/material/Button';
import { Typography, ButtonGroup, TextField,Autocomplete, Modal, Grid } from '@mui/material';
import * as React from "react";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {es} from 'date-fns/locale'
import BookIcon from '@mui/icons-material/Book';
import optionsBuilder from '../../utils/optionsBuilder';
import {Box} from '@mui/material';
import statusPOST from '../../utils/statusPOST';
import { Container } from '@mui/system';
import ModalGrid from '../reusable/ModalGrid';
import ModalItem from '../reusable/ModalItem';



export default function ProyectoGasto(props){




  const [valor,setValor] = React.useState(null);
  const [fecha,setFecha] = React.useState(new Date());
  const [comentario,setComentario] = React.useState(null);


  /* 'save' is changed to true when the 'Guardar'
  button is clicked, and is changed back to
  false when the action of saving the data
  is carried out. */
  const [save,setSave] = React.useState(false);


    const flushModal = function(){
        setValor(null);
        setComentario(null);
    }





    /* USE EFFECT SECTION */


    React.useEffect(()=>{

        if(!save) return;


        const dd = fecha.getDate();
        const mm = fecha.getMonth()+1;
        const yyyy = fecha.getFullYear();
        const myDate = `${yyyy}-${mm}-${dd}`

        let gasto = {

            empleado_id: props.empleadoID,
            proyecto_id: props.proyectoID,
            valor: valor,
            fecha: myDate,
            comentario: comentario,
        }

        console.log(props.operacion)

        

        let URL = "";

        if(props.operacion==='bono')      URL = 'http://localhost:8000/bono';
        if(props.operacion==='descuento') URL = 'http://localhost:8000/descuento';
        if(props.operacion==='anticipo')  URL = 'http://localhost:8000/anticipo';

        console.log(URL)


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gasto)
        }


        fetch(URL,requestOptions)
        .then(response => statusPOST(response))
        .then(response => response.json())
        .then(json => {

            props.notify("Operación exitosa",'success')
            flushModal();
            props.close();

        })
        .catch((status) => props.notify(status + ": Error en la operación",'error'));
   
        setSave(false)

    },[save])





    return (

        <ModalGrid open={props.open}>
            <ModalItem>
                <Typography>{props.operacion}</Typography>
            </ModalItem>
            <ModalItem>
                <TextField
                    value={valor}
                    onChange={(e)=>{setValor(e.target.value)}}
                    style={{ width: "500px" }}
                    type="text"
                    label="Valor"
                    variant="outlined"
                    size="small"
                />
            </ModalItem>
            <ModalItem>
                <TextField
                    value={comentario}
                    onChange={(e)=>{setComentario(e.target.value)}}
                    style={{ width: "500px", margin: "5px" }}
                    id="outlined-multiline-static"
                    label="Comentario"
                    multiline
                    rows={4}
                />
            </ModalItem>
            <ModalItem>
                <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label={"Fecha la Operación"}
                        value={fecha}
                        minDate={"2020-01-01"}
                        maxDate={ "2024-01-01"}
                        onChange={(newValue) => {setFecha(newValue)}}
                        renderInput={(params) => 
                            <TextField {...params}
                            variant="outlined"
                            style={{
                                width:'500px',
                            }}
                            />
                        }
                    />
                </LocalizationProvider> 
            </ModalItem>
            <ModalItem>
                <ButtonGroup size='small' variant="contained" aria-label="contained primary button group">
                    <Button color="primary" onClick={()=>setSave(true)}>Guardar</Button>                
                    <Button color='error' onClick={props.close}>Cancelar</Button>
                </ButtonGroup>
            </ModalItem>
        </ModalGrid>
    );
}
