import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



/*================================================================
  Description
  - accept: function called upon pressing button ACEPTAR
  - cancel: function called upon pressing button CANCELAR
  - title : Title of dialog
  - Content : Question to be Asked
  - handleClose : 
  ================================================================*/



export default function AlertDialog({

  handleClose, 
  content,
  accept,
  open,
}) 

{




  const handleAccept = () => {

    accept();
    handleClose();
  }

  const handleCancel = () => {

    handleClose();
  }


  return (
    <div>

      <Dialog open={open}>

        <DialogTitle id="alert-dialog-title">Confirmación</DialogTitle>

        {/* Content of dialog. Insert here the proposal to be deliberated. */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>


        <DialogActions>
          <Button onClick={handleAccept}>Aceptar</Button>
          <Button onClick={handleCancel} autoFocus>Cancelar</Button>
        </DialogActions>

      </Dialog>

    </div>
  );
}