
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {es} from 'date-fns/locale'
import {nextYear} from '../../utils/date.js';

export default function YearSelector({fecha, setFecha, label}){

    return(
        <>
            {/*  reported month */}
            <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
            <DatePicker
                views={['year']}
                label={label}
                value={fecha}
                minDate={"2018-01-01"}
                maxDate={nextYear()}
                onChange={(newValue) => setFecha(newValue)}
                renderInput={(params) => 
                <TextField {...params}
                variant="outlined"
                style={{width:'150px',}}
                />
                }
            />
            </LocalizationProvider>
        </>
    )
}
