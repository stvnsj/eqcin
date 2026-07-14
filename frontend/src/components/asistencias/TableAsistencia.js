import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import clpFormat from '../../utils/clpFormat';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import SemanaSelector from '../reusable/SemanaSelector';
import Tooltip from '@mui/material/Tooltip';
import apiDateTimeFormatter from '../../utils/apiDateTimeFormatter';


function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}




const diaAbv = [
    'dom',
    'lun',
    'mar',
    'mie',
    'jue',
    'vie',
    'sab',
]





export default function TableAsistencia() {
    
    
    
    
    // Returns a matrix to be populated with 
    // asistencia data.
    const matrixGenerator = (d) => {
        
        
        let mat = []
        
        d.forEach((emp)=>
            
            mat[emp.id] = []
            
        )
        
        return mat;
    }
    
    let presentDate = new Date();
    let pastDate = new Date(presentDate.getFullYear(), presentDate.getMonth(), presentDate.getDate()-4)
    
    
    
    
    
    const [counter, setCounter] = React.useState(0);
    const [empleados, setEmpleados] = React.useState([])
    const [dias, setDias] = React.useState([])
    const [nombres, setNombres] = React.useState([])
    const [fecha, setFecha] = React.useState(pastDate)
    const [diaSemana, setDiaSemana] = React.useState(fecha.getDay());
    
    
    
    
    
    
    
    
    
    
    
    React.useEffect(()=>{
        
        setDiaSemana(fecha.getDay());
        
        
        
        const url = `http://localhost:8000/asistencia/reporte/${fecha.getFullYear()}/${fecha.getMonth()+1}/${fecha.getDate()}`;
        
        const requestOptions = {
            method: 'GET',
        }
        
        fetch(url,requestOptions)
            .then((res)=>res.json())
            .then((json)=>{
                
                
                let data0 = json.data[0];
                let data1 = json.data[1];
                let data2 = json.data[2];
                
                
                if(data1.length === 0){
                    
                    setDias(data0.map(d=>d.date_label))
                    setEmpleados([]);
                    
                }
                
                else{
                    
                    let arr;
                    
                    let nom=[];
                    
                    arr = matrixGenerator(data1);
                    
                    data1.forEach(emp => nom[emp.id]=emp.nombre);
                    
                    setNombres(nom);

                    /*  -------------------------------------- */
                    /* TODO */
                    /* The fecha field is to be renamed proyecto_nombre, since that is what's displayed now. */
                    data2.map( emp => {
                        arr[emp.id][emp.date_label] = {
                            'registro':emp.registro,
                            'costo':emp.costo, 
                            'fecha':emp.proyecto_nombre};
                    })
                    
                    setDias(data0.map(d=>d.date_label))
                    setEmpleados(arr)
                    
                }
                
                
                
                
                
            })
        
    }, [fecha]);
    
    
    
    
    
    
    return (
        
        
        
        
        
        <div style={{ width: '100%', height:900 }}>
            
            <SemanaSelector fecha={fecha} setFecha={setFecha} label={"Principio Semana"} setDiaSemana={setDiaSemana}/>
            
            <br/>
            <TableContainer component={Paper} sx={{border:1}}>
                <Table
                    
                    size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow >
                            <TableCell sx={{border:1 , minWidth:'15vh',maxWidth:'15vh'}}><b>Nombre</b></TableCell>
                            {
                                
                                dias.map((dia,idx)=>
                                    <TableCell sx={{border:1, minWidth:'10vh',maxWidth:'10vh'}}>
                                        <b>{diaAbv[(diaSemana+idx)%7]} {dia}</b>
                                    </TableCell>
                                )
                            }
                        </TableRow>
                    </TableHead>
                    
                    
                    
                    <TableBody>
                        {empleados.map((emp,idx) => (
                            
                            <TableRow key={idx}>
                                <TableCell  sx={{border:1 , minWidth:'15vh',maxWidth:'15vh' }}>
                                    {nombres[idx]}
                                </TableCell>
                                
                                {
                                    emp.map(asis=>
                                        <Tooltip title={asis.fecha} arrow followCursor>
                                            <TableCell align='left'  sx={{border:1 , minWidth:'10vh',maxWidth:'10vh'}} size='small'>
                                                { 
                                                    asis.registro===1?
                                                        <>
                                                            <CheckCircleTwoToneIcon color='success' />
                                                            <br/>
                                                            {clpFormat(asis.costo)}
                                                        </>
                                                    :'' 
                                                }
                                            </TableCell>
                                        </Tooltip>
                                        
                                    )
                                }
                            </TableRow>
                            
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        
        
        
        
    );
}
