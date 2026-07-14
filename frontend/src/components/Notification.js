

import { Alert, Snackbar} from "@mui/material";
import { useEffect } from "react";


/*==================================================

props:
- open
- handleClose
- severity : 'error', 'warning', 'info', 'success'
- mssg : Message displayed no notification.

====================================================*/

export default function Notification(props) {




  return (

    <Snackbar 
      anchorOrigin={{ horizontal: 'center', vertical: 'top'}} 
      open={props.open} 
      autoHideDuration={1300} 
      onClose={props.handleClose}
    >

      <Alert onClose={props.handleClose} severity={props.severity} sx={{ width: '100%' }}>
        {props.mssg}
      </Alert>

    </Snackbar>

  );
  
}