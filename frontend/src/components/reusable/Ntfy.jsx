import { Alert, Snackbar } from "@mui/material";


export default function Ntfy
({

  open,
  content,
  severity,
  close

})
{




  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    close();
  };


  return(

    <Snackbar open={open} onClose={handleClose} autoHideDuration={7000} anchorOrigin={{vertical: 'top',horizontal: 'center',}}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {content}
      </Alert>
    </Snackbar>

  );
}
