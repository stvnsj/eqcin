import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { dict_comunas } from '../../data/comuna_data';
import apiDateTimeFormatter from '../../utils/apiDateTimeFormatter';
import CancelIcon from '@mui/icons-material/Cancel';
import {ButtonGroup} from '@mui/material';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { region, comuna, prevision, salud, cuenta, banco } from '../../data/dict';
import EditContrato from './EditContrato';
import clpFormat from '../../utils/clpFormat';




export default function ProfileContrato({contrato, close, notify, getProfile}){





  const [modal, setModal] = React.useState(false);
  const [field, setField] = React.useState('');

  const clickHandler = (field) => {

    return function(){

      setModal(true);
      setField(field);

    }
  }







  const rows = [
    {
        key:'id',
        field:'ID contrato',
        content: contrato.id,
    },
    {   
        key:'costo',
        field:'Costo',
        content:clpFormat(contrato.costo),
        button: <Button size='small' variant='contained' onClick={clickHandler('costo')}>Editar</Button>,
    },
    {
        key:'labor',
        field:'Labor',
        content: contrato.labor,
        button: <Button size='small' variant='contained' onClick={clickHandler('labor')}>Editar</Button>,
    },
    {
        key:'inicio',
        field:'Fecha de Inicio',
        content: apiDateTimeFormatter(contrato.inicio),
        button: <Button size='small' variant='contained' onClick={clickHandler('inicio')}>Editar</Button>
        
    },
    {
        key:'formal',
        field:'Tipo de Vínculo',
        content: contrato.formal?"Formal":"Informal",
        button: <Button size='small' variant='contained' onClick={clickHandler('formal')}>Editar</Button>
    },
    {   
        key:'base',
        field:'Sueldo Base Imponible',
        content:contrato.minimo? "Sueldo Mínimo" : clpFormat(contrato.base),
        button: <Button size='small' variant='contained' onClick={clickHandler('base')}>Editar</Button>
    },
    {   
        key:'minimo',
        field:'Minimo',
        content:contrato.minimo? "Sí" : "No",
        button: <Button size='small' variant='contained' onClick={clickHandler('minimo')}>Editar</Button>
    },



  ];

  return(
    <>


        <EditContrato open={modal} handleClose={()=>{setModal(false)}} field={field} contrato={contrato} notify={notify} getProfile={getProfile}/>


        <Box display="flex" justifyContent="center" >
            <div style={{ width: '50%' }}>
                <TableContainer component={Paper} sx={{height:400}}>
                    <Table sx={{ minWidth: 400 }} aria-label="simple table">
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.key} >
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