import { Button } from "@mui/material";
import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";






export default function CloseButton({handleClose}){

  return (
    <ThemeProvider theme={theme} >
      <Button color={'close'} variant="contained" onClick={handleClose}>
        <b>
          CERRAR
        </b>
      </Button>      
    </ThemeProvider>
  );
}