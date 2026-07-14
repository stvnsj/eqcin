import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';
import TextField from "@mui/material/TextField";
import { nextYear } from '../../utils/date.js';

export default function DateSelector({ date, setDate, label }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
                label={label}
                value={date}
                minDate={new Date("2020-01-01")}
                maxDate={nextYear()}
                onChange={(newValue) => setDate(newValue)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        style={{ width: '180px' }}
                    />
                )}
            />
        </LocalizationProvider>
    );
}



