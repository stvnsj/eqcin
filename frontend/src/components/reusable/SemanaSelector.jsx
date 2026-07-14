
import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {es} from 'date-fns/locale'
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography } from "@mui/material";
import {nextYear} from '../../utils/date.js';


const dia = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
]

const mes = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
]

export default function QuincenaSelector({fecha, setFecha, label, setDiaSemana}){

    const monthForward = () => setFecha(new Date(fecha.getFullYear(),fecha.getMonth(),fecha.getDate()+7))
    const monthBackward = () => setFecha(new Date(fecha.getFullYear(),fecha.getMonth(),fecha.getDate()-7))

    return(
        <>
            {/*  reported month */}
            <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
            <DatePicker
                label={label}
                value={fecha}
                minDate={"2020-01-01"}
                maxDate={nextYear()}
                onChange={(newValue) => 
                    {


                        setFecha(newValue);
                        

                    }

                }
                renderInput={(params) => 
                <TextField {...params}
                variant="outlined"
                style={{width:'300px',}}
                />
                }
            />
            </LocalizationProvider>
    
            <br/>
  
            {/*Month Navigation Buttons*/}
            <ButtonGroup>
                <Button variant='contained' onClick={monthBackward}><ArrowBackIcon/> </Button>
                <Button variant='contained' onClick={monthForward}><ArrowForwardIcon/></Button>
            </ButtonGroup>
            <br/><br/>
            <Typography>
                Semana del {dia[fecha.getDay()]} {fecha.getDate()} de {mes[fecha.getMonth()]}
            </Typography>

        </>
    )
}
