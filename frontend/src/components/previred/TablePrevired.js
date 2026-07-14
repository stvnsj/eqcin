import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import clpFormat from '../../utils/clpFormat';
import { Button, Typography } from '@mui/material';
import BttnGroup from '../reusable/BttnGroup';
import MonthSelector from '../reusable/MonthSelector';
import axios from "axios";
import {theme, myTheme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";


const cols = [                                                             
    
    {field:'id',headerName:'ID',width:50},
    {field:'nombre',headerName:'Nombre',width:200},
    {field:'rut',headerName:'RUT',width:120},
    {field:'cargo',headerName:'Cargo',width:180},
    {field:'base',headerName:'Sueldo Base',width:120},
    {field:'ingreso',headerName:'Ingreso',width:110},
    {field:'diario',headerName:'Sueldo Diario',width:110},
    {field:'dt',headerName:'DT',width:50},

    /*
    {field:'da',headerName:'DA',width:50,
     renderCell: (params) => {
         if(params.row.dt < params.row.da)
             return (
                 <ThemeProvider theme={theme}>
                     <Typography color='#990000' variant="b1"><b>{params.row.da}</b></Typography>
                 </ThemeProvider>);
         else
             return (<>{params.row.da}</>);}
    },
    
    {field:'br',headerName:'BR',width:50,
     renderCell: (params) => {
         if(params.row.br < 1.0 && params.row.br > 0.0)
             return (
                 
                 <ThemeProvider theme={theme}>
                     <Typography color='#990000' variant="b1"><b>{params.row.br}</b></Typography>
                 </ThemeProvider>);
         else return (<>{params.row.br}</>);}


    },
    
    {field:'dr',headerName:'DR',width:50,

     renderCell: (params) => {
         if(params.row.dr < 1.0 && params.row.dr > 0.0)
             return (
                 
                 <ThemeProvider theme={theme}>
                     <Typography color='#990000' variant="b1"><b>{params.row.dr}</b></Typography>
                 </ThemeProvider>);
         else return (<>{params.row.dr}</>);}

    },

    
    {field:'ar',headerName:'AR',width:50,
     renderCell: (params) => {
         if(params.row.ar < 1.0 && params.row.ar > 0.0)
             return (
                 
                 <ThemeProvider theme={theme}>
                     <Typography color='#990000' variant="b1"><b>{params.row.ar}</b></Typography>
                 </ThemeProvider>);
         else return (<>{params.row.ar}</>);}
     
    },*/

    
    {field:'mensual',headerName:'Pactado Mensual',width:130},
    {field:'liquido',headerName:'Líquido a Pagar', width:130},
    {field:'saldo',headerName:'Saldo', width:100},
    {field:'dias_previred',headerName:'Previred', width:72},
    {field:'finiquito_fecha',headerName:'Fecha Finiquito',width:130},
    {field:'finiquito_causa',headerName:'Causal Término',width:130},
    {field:'afp', headerName:'AFP',width:100},
    {field:'salud', headerName:'Salud',width:120},
]


export default function TablePrevired(props){
    
    
    /*  STATE VARIABLES  */
    
    
    const [formalRows, setFormalRows]         = React.useState([]);
    const [informalRows, setInformalRows]     = React.useState([])
    const [xport, setXport]                   = React.useState(false);
    const [fecha, setFecha]                   = React.useState(new Date());
    
    
    
    const rowBuilder = (q) => {
        
        let f_rows  = [];
        let if_rows = [];
        let myRows  = [];
        
        
        
        
        q.forEach(function(empleado){
            
            const show = empleado.DT || empleado.liquido || empleado.finiquito_fecha;
            
            if (empleado.formal && show)
                f_rows.push(
                    {
                        id:                empleado.empleado_id,
                        nombre:            empleado.nombre,
                        rut:               empleado.rut,
                        cargo:             empleado.cargo,
                        base:              clpFormat(empleado.sueldo_base),
                        ingreso:           empleado.fecha_ingreso,
                        diario:            clpFormat(empleado.sueldo_diario),
                        dt:                empleado.DT,
                        da:                empleado.DA,
                        br:                empleado.br,
                        dr:                empleado.dr,
                        ar:                empleado.ar,
                        mensual:           clpFormat(empleado.sueldo_mensual),
                        liquido:           clpFormat(empleado.liquido),
                        saldo:             clpFormat(empleado.saldo),
                        dias_previred:     empleado.dias_previred,
                        finiquito_fecha:   empleado.finiquito_fecha,
                        finiquito_causa:   empleado.finiquito_causa,
                        afp:               empleado.prevision,
                        salud:             empleado.salud,
                    }
                );
            
            else if(show)
                if_rows.push(
                    {
                        id:                empleado.empleado_id,
                        nombre:            empleado.nombre,
                        rut:               empleado.rut,
                        cargo:             empleado.cargo,
                        base:              clpFormat(empleado.sueldo_base),
                        ingreso:           empleado.fecha_ingreso,
                        diario:            clpFormat(empleado.sueldo_diario),
                        dt:                empleado.DT,
                        da:                empleado.DA,
                        br:                empleado.br,
                        dr:                empleado.dr,
                        ar:                empleado.ar,
                        mensual:           clpFormat(empleado.sueldo_mensual),
                        dias_previred:     empleado.dias_previred,
                        liquido:           clpFormat(empleado.liquido),
                        saldo:             clpFormat(empleado.saldo),
                        finiquito_fecha:   empleado.finiquito_fecha,
                        finiquito_causa:   empleado.finiquito_causa,
                        afp:               empleado.prevision,
                        salud:             empleado.salud,
                    }
                );
        })
        
        
        setFormalRows(f_rows);
        setInformalRows(if_rows);
        
        
        return q;
    }
    
    
    
    
    const save_new_data = async function (){
        
        const URL = `http://localhost:8000/previred/${2023}/${9}`;
        
        try{
            
            const res = await axios.get(URL);
            console.log(res.data.data);
            
        } catch(e) {
            
            alert(e.response.data.message);
            console.log(e);
        }        
    }
    
    
    
    
    /* Executed at component rendering */
    React.useEffect(()=>{
        
        const year   = fecha.getFullYear();
        const month  = fecha.getMonth()+1;
        
        const URL = `http://localhost:8000/previred/${year}/${month}`;
        
        const requestOptions = {
            method: 'GET',
        }
        
        fetch(URL,requestOptions)
            .then((res)=>res.json())
            .then((json)=>{
                console.log(json.data);
                rowBuilder(json.data[0]);
            })
        
        
        
    }, [fecha]);
    
    
    
    
    
    React.useEffect(()=>{
        
        if(!xport) return;
        
        const year = fecha.getFullYear();
        const month = fecha.getMonth()+1;
        
        const url = `http://localhost:8000/previredFile/${year}/${month}`;
        
        const requestOptions = {method: 'GET'}
        
        fetch(url,requestOptions)
            .then(response => response.blob())
            .then(blob => {
                
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = 'Previred ' + new Date().getTime().toString()  + '.xlsx' ;
                a.click();
                
            });
        
        setXport(false);
        
    },[xport])
    
    
    return(
        
        
        <>      
            <MonthSelector fecha={fecha} setFecha={setFecha} label={'Mes Previred'}/>
            
            <br/>
            
            <Button variant='outlined' onClick={()=>setXport(true)}>EXPORTAR</Button>
            
            <br/><br/>   
            
            
            <Typography variant='body2'>
                Empleados <b>Contratados</b>
            </Typography>
            
            <div style={{ height: 500, width: '100%' }}>
                
                <DataGrid
                    rowHeight={30}
                    rows={formalRows}
                    columns={cols}
                    pageSize={20}
                    rowsPerPageOptions={[20]}
                />
                
            </div>
            
            
            <br/><br/>
            <Typography variant='body2'>Empleados a <b>Honorarios</b></Typography>
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    rowHeight={30}
                    rows={informalRows}
                    columns={cols}
                    pageSize={20}
                    rowsPerPageOptions={[20]}
                />
            </div>
        </>
    )
}
