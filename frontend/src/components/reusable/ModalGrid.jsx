import Button from '@mui/material/Button';
import { Typography, ButtonGroup, TextField,Autocomplete, Modal, Grid, Dialog } from '@mui/material';
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




export default function ModalGrid
({
  open,
  children,
})
{

    return(
        <Dialog  open={open} maxWidth='lg'>
            <Container>
                <Grid
                  mt={2}
                  container
                  spacing={2}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor='white'
                >
                    {children}
                </Grid> 
            </Container>
        </Dialog>
    )
}