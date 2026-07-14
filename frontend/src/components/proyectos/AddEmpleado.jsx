import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button  from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Typography } from '@mui/material';
import statusPOST from "../../utils/statusPOST";
import axios from "axios";
import OptionSelector from "../reusable/OptionSelector";

/* Custom Themes for buttons */
import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";
import { scrollFunction } from '../../utils/scrollFunction';





export default function AddEmpleado(props){

    

  const filtros = [
    {value:"1", label:"Contrato y Honorarios"},
    {value:"2", label:"Contrato"},
    {value:"3", label:"Honorarios"},
    {value:"4", label:"Todos los empleados"}
  ]


    
    
    /*  STATE VARIABLES */
    const [rows, setRows] = React.useState([]);
    const [empleadoID, setEmpleadoID] = React.useState();
    const [add,setAdd] = React.useState(false);
    const [filtro,setFiltro] = React.useState(1);

    
    
    const addEmpleado = (id) => {
        setEmpleadoID(id);
        setAdd(true);
    }
    
    
    
    const cols = [                                                             
        {field:'id',headerName:'ID',width:30},
        {field:'nombre',headerName:'Nombre',width:250},
        {field:'rut',headerName:'RUT',width:200},                                   

        {
            field: "deleteButton",
            headerName: "Acción",
            sortable: false,
            width: 120,
            renderCell: (params) => {
                return (
                    <ThemeProvider theme={theme}>
                        <Button
                            size='small'
                            color='view'
                            onClick={(e) => {addEmpleado(params.row.id)}}
                            variant="contained"
                        >
                            Agregar
                        </Button>
                    </ThemeProvider>
                );
            } 
        }  
    ]   
    
    
    
    
    
    const postData = async () => {
        
        
        const proyecto = {
            
            "empleado_id"   : empleadoID,
            "proyecto_id"   : props.proyectoID,
        }
        
        const url = 'http://localhost:8000/proyecto/addEmpleado';
        
        try{
            const res = await axios.post(url, proyecto);
            if(res.status == 201){
                props.notify("Empleado agregado exitosamente",'success')
                getData();
            }
        }
        catch(err){
            
            props.notify("Empleado no pudo ser agregado",'error');
            
        }
    }
    
    
    
    
    
    
    
    
    React.useEffect(()=>{
        
        if(!add) return;
        
        postData();
        
        setAdd(false);
        
        
    }, [add])
    
    
    
    const getData = async () => {
        
        const url = `http://localhost:8000/proyecto/empleados/complement/${props.proyectoID}/${filtro}`;
        try {

            const res = await axios.get(url);
            console.log(res.data.data);
            setRows(res.data.data[0]);

        } catch (err){

            console.log(err)
        }

    }
    
    
    
    React.useEffect(()=>{
        getData();
        scrollFunction('ProyectoScroll');
    }, [filtro]);
    
    
    
    
    return (
        <>

            <br/>
            <div style={{ height: 700, width: '100%' }}>
                
                <OptionSelector value={filtro} setter={setFiltro} options={filtros} label={"Filtro"}/>
                <br/><br/>
                <DataGrid
                    rowHeight={35}
                    rows={rows}
                    columns={cols}
                    pageSize={15}
                    rowsPerPageOptions={[15]}/>
                
                <br/>
                <br/>
            </div>    
        </>
    );
}
