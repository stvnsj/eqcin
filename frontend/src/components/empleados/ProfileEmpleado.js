import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {ButtonGroup} from '@mui/material';
import { Button} from '@mui/material';
import { Box } from '@mui/system';

import { region, comuna, prevision, salud, cuenta, banco } from '../../data/dict';
import EditEmpleado from './EditEmpleado';


import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";



export default function ProfileEmpleado({empleado, close, notify}){





  const [modal, setModal] = React.useState(false);
  const [field, setField] = React.useState(null);

  const clickHandler = (field) => {

    return function(){

      setModal(true);
      setField(field);

    }
  }





  const handleCancel = () => {

    setModal(false);
    setField(null);
  }






  const rows = [
    {
      field:'id',
      content: empleado.id,
    },
    {
      field:'Nombre',
      content: empleado.nombre
    },
    {
      field:'RUT',
      content: empleado.rut,
      button: 
      <ThemeProvider theme={theme}>
        <Button size='small' color='edit' variant='contained' onClick={clickHandler('rut')}>Editar</Button>
      </ThemeProvider>

    },
    {
      field:'Teléfono',
      content: empleado.telefono,
      button: 
      <ThemeProvider theme={theme}>
        <Button size='small' color='edit' variant='contained' onClick={clickHandler('telefono')}>Editar</Button>
      </ThemeProvider>
    },
    {
      field:'Email',
      content: empleado.email,
      button: 
      <ThemeProvider theme={theme}>
        <Button size='small' color='edit' variant='contained' onClick={clickHandler('email')}>Editar</Button>
      </ThemeProvider>
    },
    {
      field:'N de Cuenta',
      content: empleado.cuenta,
      button: 
      <ThemeProvider theme={theme}>
        <Button size='small' color='edit' variant='contained' onClick={clickHandler('cuenta')}>Editar</Button>
      </ThemeProvider>
    },
    {
      field:'Tipo de Cuenta',
      content: empleado.cuenta_id  ? cuenta[empleado.cuenta_id]: '',
      button: 
      <ThemeProvider theme={theme}>
        <Button size='small' color='edit' variant='contained' onClick={clickHandler('cuenta_id')}>Editar</Button>
      </ThemeProvider>
    },
    {
      field:'Banco',
      content: empleado.banco_id ? banco[empleado.banco_id] : '',
      button: 
      <ThemeProvider theme={theme}>
        <Button size='small' color='edit' variant='contained' onClick={clickHandler('banco_id')}>Editar</Button>
      </ThemeProvider>
    },
    {
      field:'Salud',
      content: empleado.salud      ? salud[empleado.salud] : '',
      button: 
      <ThemeProvider theme={theme}>
        <Button size='small' color='edit' variant='contained' onClick={clickHandler('salud')}>Editar</Button>
      </ThemeProvider>
    },
    {
      field:'AFP',
      content: empleado.prevision  ? prevision[empleado.prevision] : '',
      button: 
      <ThemeProvider theme={theme}>
        <Button size='small' color='edit' variant='contained' onClick={clickHandler('prevision')}>Editar</Button>
      </ThemeProvider>
    },
    {
      field:'Calle',
      content: empleado.domicilio ,
      button: 
      <ThemeProvider theme={theme}>
        <Button size='small' color='edit' variant='contained' onClick={clickHandler('domicilio')}>Editar</Button>
      </ThemeProvider>
    },
    {
      field:'Numero',
      content: empleado.numero_domicilio ,
      button: 
      <ThemeProvider theme={theme}>
        <Button size='small' color='edit' variant='contained' onClick={clickHandler('numero_domicilio')}>Editar</Button>
      </ThemeProvider>
    },
    {
      field:'Departamento',
      content: empleado.departamento ,
      button: 
      <ThemeProvider theme={theme}>
        <Button size='small' color='edit' variant='contained' onClick={clickHandler('departamento')}>Editar</Button>
      </ThemeProvider>
    },
    {
      field:'Comuna',
      content: empleado.comuna_id  ? comuna[empleado.comuna_id] : '',
      button: 
      <ThemeProvider theme={theme}>
        <Button size='small' color='edit' variant='contained' onClick={clickHandler('comuna_id')}>Editar</Button>
      </ThemeProvider>
    },
    {
      field:'Región',
      content: empleado.region_id  ? region[empleado.region_id] : '',
      button: 
      <ThemeProvider theme={theme}>
        <Button size='small' color='edit' variant='contained' onClick={clickHandler('region_id')}>Editar</Button>
      </ThemeProvider>
    },

  ];

  return(
    <>

        <EditEmpleado open={modal} handleClose={handleCancel} field={field} empleado={empleado} notify={notify}/>



        <Box display="flex" justifyContent="center" >
            <div style={{ width: '50%' }}>
                <TableContainer component={Paper} sx={{height:400}}>
                    <Table sx={{ minWidth: 400 }} aria-label="simple table">
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.field} >
                                    <TableCell component="th" scope="row"><b>{row.field}</b></TableCell>
                                    <TableCell align="right">{row.content}</TableCell>
                                    <TableCell align="right">{row.button}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Box>
        <br/>


        <ButtonGroup size='small' variant="outlined" aria-label="outlined primary button group">
            <Button variant='contained' color="error" onClick={close} > Cerrar</Button>
        </ButtonGroup>


        <br/> <br/>
    </>
  )
}