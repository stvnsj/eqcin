
import * as React from "react";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {es} from 'date-fns/locale'
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {nextYear} from '../../utils/date.js';

export default function MonthSelector({fecha, setFecha, label}){

    const monthForward = () => setFecha(new Date(fecha.getFullYear(),fecha.getMonth()+1))
    const monthBackward = () => setFecha(new Date(fecha.getFullYear(),fecha.getMonth()-1))

    return(
        <>
            {/*  reported month */}
            <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
            <DatePicker
                views={['year', 'month']}
                label={label}
                value={fecha}
                minDate={"2020-01-01"}
                maxDate={nextYear()}
                onChange={(newValue) => setFecha(newValue)}
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
        </>
    )
}
