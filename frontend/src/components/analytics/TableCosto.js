import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import clpFormat from '../../utils/clpFormat';
import percentFormat from '../../utils/percentFormat';

export default function TableCosto({proyectoData}){





  return (
    
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: '80vh' }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Gasto Real</TableCell>
            <TableCell align="right">Presupuesto Neto</TableCell>
            <TableCell align="right">Porcentaje de Gasto</TableCell>
            <TableCell align="right">Presupuesto Oficial</TableCell>
            <TableCell align="right">Utilidad (%)</TableCell>
            <TableCell align="right">Utilidad ($)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            proyectoData.map(data => (
              <TableRow key={1} sx={{ '&:last-child td, &:last-child th': { border: 1 } }} >
                <TableCell align="right">{clpFormat(data.gasto_real)}</TableCell>
                <TableCell align="right">{clpFormat(data.presupuesto_total)}</TableCell>
                <TableCell align="right">{percentFormat(data.gasto_porcentaje)}</TableCell>
                <TableCell align="right">{clpFormat(data.presupuesto_oficial)}</TableCell>
                <TableCell align="right">{percentFormat(data.utilidad)} </TableCell>
                <TableCell align="right">{clpFormat(data.ganancia)} </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}