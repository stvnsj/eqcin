import * as React from "react";
import Button from "@mui/material/Button";
import { DataGrid } from '@mui/x-data-grid';

/* Custom Themes for buttons */
import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";
import Payment from "./Payment";
import axios from "axios";
import UndoIcon from '@mui/icons-material/Undo';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';



export default function PayContrato(props){
    
    
    
    const [undo, setUndo]             = React.useState(false);
    const [open,setOpen]              = React.useState(false);
    const [nombre,setNombre]          = React.useState(null);
    const [empleadoID, setEmpleadoID] = React.useState(null);
    const [contratoID, setContratoID] = React.useState(null);
    const [rows, setRows]             = React.useState([]);
    
    const cols = [
        
        {field:'id',headerName:'ID',width:50},
        {field:'rut',headerName:'RUT',width:120},
        {field:'nombre',headerName:'Nombre',width:230},
        {field:'cargo',headerName:'Cargo',width:130},
        {field:'termino',headerName:'Fecha de Término',width:145},
        {
            field: "deleteButton",
            headerName: "Pagar",
            sortable: false,
            width: 100,
            renderCell: (params) => {
                return (
                    <ThemeProvider theme={theme}>
                        <Button
                            size='small'
                            color='green'
                            onClick={(e) => {
                                setOpen(true)
                                setNombre(params.row.nombre + " (" + params.row.rut + ")" )
                                setEmpleadoID(params.row.id)
                                setContratoID(params.row.contrato_id);
                            }}
                            variant="contained"
                        >
                            <AttachMoneyIcon/>
                        </Button>
                    </ThemeProvider>  
                );
            }
        },
        {
            field: "undoButton",
            headerName: "Deshacer",
            sortable: false,
            width: 100,
            renderCell: (params) => {
                return (
                    <ThemeProvider theme={theme}>
                        <Button
                            size='small'
                            color='green'
                            onClick={(e) => {
                                setNombre(params.row.nombre + " (" + params.row.rut + ")" )
                                const confirmed = window.confirm(`Confirme que desea deshacer el despido de ` + params.row.nombre);
                                if (!confirmed) return
                                setUndo(true)
                                setEmpleadoID(params.row.id)
                                setContratoID(params.row.contrato_id);
                            }}
                            variant="contained"
                        >
                            <UndoIcon/>
                        </Button>
                    </ThemeProvider>  
                );
            }
        }
    ]
    
    const getData = async () => {
        
        const url = "http://localhost:8000/contrato/unpaid";
        const res = await axios.get(url);
        setRows(res.data.data);
    };

    const undoData = async () => {


        const url = "http://localhost:8000/contrato/undo";
        const requestData = {
            contrato_id : contratoID
        };

        try {

            const response = await axios.put(url,requestData);
            getData()
            setOpen(false)
            setUndo(false)

        } catch (error) {

            console.error('ERROR')

        }
    };
    
    React.useEffect(()=>{
        
        getData();
        
    }, []);
    
    
    React.useEffect(()=>{
        
        if(!undo) return;
        undoData()
        
    }, [undo]);
    
    
    return(
        <>
            {
                
                open ? 
                    <>
                        
                        <Payment 
                            close={()=>setOpen(false)} 
                            empleadoID={empleadoID} 
                            nombre={nombre} 
                            contratoID={contratoID}
                            getData={getData}
                            {...props}
                        /> 
                        <br/><br/>
                    </>
                
                
                : <></>
            }
            
            
            
            
            <div style={{ height: 750, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={cols}
                    pageSize={15}
                    rowsPerPageOptions={[15]}
                />
            </div>
        </>
    );
    
}
