import * as React from "react";
import { ButtonGroup, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {es} from 'date-fns/locale'
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import statusPOST from "../../utils/statusPOST";
import DateSelector from '../reusable/DateSelector';


export default function CreateMinimo(props){

    const [comunasOptions, setComunasOptions] = React.useState([]);

    const [save, setSave] = React.useState(false);


    /* Proyecto Creation Data */
    const [sueldo, setSueldo]                           = React.useState(null);
    const [fecha, setFecha]                           = React.useState(new Date());








    React.useEffect(()=>{

        if(!save) return;

        const dd = fecha.getDate();
        const mm = fecha.getMonth()+1;
        const yyyy = fecha.getFullYear();
        const myDate = `${yyyy}-${mm}-${dd}`


        let minimo = {

            "fecha"     : myDate,
            "sueldo"    : sueldo,
        }



        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(minimo)
        }

        fetch('http://localhost:8000/minimo',requestOptions)
        .then(response => statusPOST(response))
        .then(response => response.json())
        .then(json => {

            props.notify("Sueldo Mínimo creado exitosamente",'success')
            props.close();

        })
        .catch((status) => props.notify(status + ": Error en la creación del sueldo mínimo",'error'));
        

        setSave(false);


    }, [save])



    



    return(

        <Stack spacing={2}>
            
            <br/>
            <br/>
        


            <Typography variant="paragrap">
                <b>Ingreso de Nuevo Sueldo Mínimo</b> <br/>
                <i>
                    En el sistema, todo sueldo base igual al sueldo mínimo adoptará <br/>
                    este nuevo valor (primer campo) desde el més en que entre en vigencia.
                </i>
            </Typography>

            <form>


                {/* Value of Sueldo Mínimo */}
                <TextField
                    value={sueldo}
                    onChange={(e)=>{setSueldo(e.target.value)}}
                    style={{ width: "500px", margin: "5px" }}
                    type="text"
                    label="Valor del Sueldo Mínimo"
                    variant="outlined"
                />

                <br />
                <br />

                <DateSelector date={fecha}  setDate={setFecha}  label={"Vigente desde"} />

                <br />
                <br />

                
                            
                <ButtonGroup size='small' variant="outlined" aria-label="outlined primary button group">
                    <Button color="primary" onClick={()=>setSave(true)}> <SaveIcon/> Guardar </Button>
                    <Button color="error"   onClick={props.close}><CancelIcon/> Cancelar</Button>
                </ButtonGroup>

            </form>
        </Stack>
    )
}
