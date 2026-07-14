import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import clpFormat from '../../utils/clpFormat';










export default function TableTiempo({proyectoData}){



  const formatDelta = (dias) => {

    if(dias > 0)     return dias + " dias menos que lo estimado";
    if(dias < 0)     return (-1 * dias) + " dias más que lo estimado";
    if(dias === 0)   return "Estimación correcta";
  }




  return (
    
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: '80vh' }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Duración Real</TableCell>
            <TableCell align="right">Costo Día</TableCell>
            <TableCell align="right">Duración Estimada</TableCell>
            <TableCell align="right">Estado</TableCell>
            <TableCell align="right">Duración Oficial</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            proyectoData.map(data => (
              <TableRow key={1} sx={{ '&:last-child td, &:last-child th': { border: 1 } }} >
                <TableCell align="right">{data.duracion} días</TableCell>
                <TableCell align="right">{clpFormat(data.costo_dia)} / día</TableCell>
                <TableCell align="right">{data.tiempo_estimado} días</TableCell>
                <TableCell align="right">{formatDelta(data.delta_duracion)}</TableCell>
                <TableCell align="right">{data.tiempo_oficial} días</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}