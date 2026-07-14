import * as React from "react";
import Dropdown from "../Dropdown";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import Button  from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TxtField from '../reusable/TxtField';
import DateSelector from '../reusable/DateSelector';
import {theme} from '../../utils/themes';
import {ThemeProvider} from "@mui/material/styles";
import { numberToDate } from "../../utils/date";
import clpFormat from "../../utils/clpFormat";
import {Typography} from '@mui/material';
import Toast from '../reusable/Toast';
import toast from 'react-hot-toast';
import { TextField } from '@mui/material';


const OPTION = Object.freeze({
    BONO: 1,
    DESCUENTO: 2,
    ANTICIPO: 3
  });


const delete_operation = async function (option, gasto_id) {

    var url = ""

    if (option == OPTION.BONO){url = `http://localhost:8000/bono/delete/${gasto_id}`;} 
    else if (option == OPTION.ANTICIPO){url = `http://localhost:8000/anticipo/delete/${gasto_id}`;} 
    else if (option == OPTION.DESCUENTO){url = `http://localhost:8000/descuento/delete/${gasto_id}`;}
    
    try{
        const res = await axios.delete(url);
        toast.success("Eliminación Exitosa");
    } catch(e) {
        //alert(e.response.data.message);
        console.log(e);
    }
};

const edit_operation = async function (
    option,
    gasto_proyecto,
    gasto_monto,
    gasto_comentario,
    gasto_contrato,
    gasto_fecha,
    gasto_id
) {


    if(!gasto_monto) {
        toast.error("El valor no puede ser vacío");
        return
       
    }
    if(!gasto_fecha){ 
        toast.error("La fecha no puede estar vacía");
        return
    }

    const d0    = gasto_fecha.getDate();
    const m0    = gasto_fecha.getMonth()+1;
    const y0    = gasto_fecha.getFullYear();
    const date0 = numberToDate(y0,m0,d0);

    const data ={
        proyecto_id : gasto_proyecto.id,
        valor       : gasto_monto,
        fecha       : date0,
        comentario  : gasto_comentario,
        contrato_id : gasto_contrato.id,
        id          : gasto_id
    };

    var url = "";
    if (option == OPTION.BONO){url = `http://localhost:8000/bono/edit`;} 
    else if (option == OPTION.ANTICIPO){url = `http://localhost:8000/anticipo/edit`;} 
    else if (option == OPTION.DESCUENTO){url = `http://localhost:8000/descuento/edit`;}
    

    try{
        
        const res = await axios.put(url,data);
        toast.success("Edición Exitosa");
        
    } catch(e) {alert(e.response.data.message);
        console.log(e);
    }
};



const init_table = async function (
    option, // expense type
    setter  // row setter
){
    var url = ""
    if (option == OPTION.BONO){url = `http://localhost:8000/bono/historial`;} 
    else if (option == OPTION.ANTICIPO){url = `http://localhost:8000/anticipo/historial`;} 
    else if (option == OPTION.DESCUENTO){url = `http://localhost:8000/descuento/historial`;}
    
    try{
        const res = await axios.get(url);
        setter(
            res.data.data.map(
                c => ({ "id":c.id,
                        "monto":c.monto,
                        "proyecto":c.proyecto,
                        "fecha":c.fecha,
                        "comentario":c.comentario,
                        "contrato":c.contrato,
                        "proyecto_id":c.proyecto_id,
                        "contrato_id":c.contrato,
                        "datetime": c.datetime,
                        "empleado": c.empleado,
                        "empleado_id" : c.empleado_id
                    })));
                    
    } catch(error) {console.log(error);}
};





export default function ExploreGasto(props){

    const expense_type = function () {
        if (props.option == props.options.BONO){
            return OPTION.BONO
        } else if (props.option == props.options.DESCUENTO){
            return OPTION.DESCUENTO
        } else if (props.option == props.options.ANTICIPO){
            return OPTION.ANTICIPO
        } else return -1
    }

    const expense_name = function () {
        if (props.option == props.options.BONO){
            return "Bono"
        } else if (props.option == props.options.DESCUENTO){
            return "Descuento"
        } else if (props.option == props.options.ANTICIPO){
            return "Anticipo"
        } else return ""
    }

    const UI_OPTION = {
        edit        : 2,        
        delete      : 3,
    };
    

    // GASTO FIELDS
    const [gasto_id, set_gasto_id]                   = React.useState(null);
    const [gasto_empleado, set_gasto_empleado]       = React.useState(null);
    const [gasto_empleadoid, set_gasto_empleadoid ]  = React.useState(null)
    const [gasto_monto, set_gasto_monto]             = React.useState(null);
    const [gasto_proyecto, set_gasto_proyecto]       = React.useState(null);
    const [gasto_contrato, set_gasto_contrato]       = React.useState(null);
    const [gasto_comentario, set_gasto_comentario]   = React.useState(null);
    const [gasto_fecha, set_gasto_fecha]             = React.useState(null);



    // Dropdown data
    const [empleado_option, set_empleado_option]     = React.useState(null);
 
    // Dropdown DATA
    const [proyecto_options, set_proyecto_options]   = React.useState(null);
    const [contrato_options, set_contrato_options]   = React.useState(null);
    


    

    // Table data
    const [rows, setRows]          = React.useState([]);
    const [new_data, set_new_data] = React.useState(false);
    


    // form variables
    const [save_new       , set_save_new]        = React.useState(false);
    const [save_anexo     , set_save_anexo]      = React.useState(false);
    const [save_terminate , set_save_terminate]  = React.useState(false);

    
    const [option,set_option]                    = React.useState(0);

    
    const reset_state = async function () {
        set_gasto_monto(null)
        set_gasto_proyecto(null)
        set_gasto_contrato(null)
        set_gasto_comentario(null)
        set_gasto_fecha(null)
        set_option(0)
    };
    
    
    const cols = [

        {field:'id'         ,headerName:'ID'           ,width: 50},
        {field:'empleado'   ,headerName:'Empleado'     ,width: 200},
        {field:'monto'      ,headerName:'Monto'        ,width: 100, valueFormatter: params => clpFormat(params.value )},
	    {field:'comentario' ,headerName:'Comentario'   ,width:500},
        {field:'proyecto'   ,headerName:'Proyecto'     ,width:160},
	    {field:'contrato'   ,headerName:'Contrato'     ,width:100},
        {field:'fecha'      ,headerName:'Fecha'        ,width:120},
	    {field:'proyecto_id', hide:true},
    	{field:'contrato_id', hide:true},
    	{field:'datetime'   , hide:true},
        {field:'empleado_id', hide:true},
        {
            field: "button1",
            headerName: "Edición",
            sortable: false,
            width: 100,
            renderCell: (params) => {
                return (
                    <ThemeProvider theme={theme}>
                        <Button
                            size='small'
                            color='yellow'
                            onClick={async (e) => {

                                set_gasto_empleadoid(params.row.empleado_id);
                                const contratos = await init_contratos(Number(params.row.empleado_id));
                                const element = contratos.find(item => item.id === params.row.contrato_id);
                                set_gasto_id(params.row.id);
				                set_gasto_monto(params.row.monto);
				                set_gasto_comentario(params.row.comentario);
				                set_gasto_proyecto({"id":params.row.proyecto_id, "label":params.row.proyecto});
				                set_gasto_contrato(element ? element : null)
				                set_gasto_fecha(new Date(params.row.datetime))
                                set_option(UI_OPTION.edit); 
                            }}
                            variant="contained"
                        >
                            editar
                        </Button>
                    </ThemeProvider>);    
            }
        },
        {
            field: "button2",
            headerName: "Eliminación",
            sortable: false,
            width: 100,
            renderCell: (params) => {
                return (
                    
                    <ThemeProvider theme={theme}>
                        <Button
                            size='small'
                            color='delete'
                            onClick={(e) => {
				                set_gasto_comentario(params.row.comentario)
				                set_gasto_fecha(params.row.fecha)
				                set_gasto_id(params.row.id)
                                set_option(UI_OPTION.delete);
                            }}
                            variant="contained"
                        >
                            eliminar
                        </Button>
                    </ThemeProvider>
                );  
            }
        },
    ];





    const init_proyectos = async function (){
        try{
            const url = "http://localhost:8000/proyecto/options";
            const res = await axios.get(url);
            set_proyecto_options(
            res.data.data.map(
                e => ({"id":e.id, "label":e.label})));

        } catch (error) {console.log(error)}
    };





  




    const init_contratos = async function (id) {
        try {
            const url = `http://localhost:8000/contrato/options/${id}`;
            const res = await axios.get(url);
            const newOptions = res.data.data.map(e => ({ "id": e.id, "label": e.label }));
    
            set_contrato_options(newOptions); // Updates state but does NOT reflect immediately
            
            return newOptions; // Return the updated array
        } catch (error) {
            console.log(error);
            return [];
        }
    };





    const edit_expense = async function () {
        edit_operation(
            expense_type(),
            gasto_proyecto,
            gasto_monto,
            gasto_comentario,
            gasto_contrato,
            gasto_fecha,
            gasto_id
        )
    };



    


    const delete_expense = async function () {
        delete_operation(
            expense_type(),
            gasto_id
        ) 
    };



    React.useEffect(() => {
        
        // init_data()
        init_table(expense_type(),setRows)
	    init_proyectos()
	
    },[]);




    React.useEffect(() => {

        if(!save_anexo) return;
        edit_expense();
        set_save_anexo(false);
        set_new_data(true);
        set_option(0);
        init_table(
            expense_type(), 
            setRows
        );
	
    }, [save_anexo]);



    /****************************/
    React.useEffect(()=> {

        if(!new_data) return;
        set_new_data(false);
        init_table(
            expense_type(), 
            setRows
        );
    }, [new_data]);


    /****************************/
    React.useEffect(()=> {

        if(!save_terminate) return;
        delete_expense();
        set_save_terminate(false);
        set_new_data(true);
        set_option(0);
    }, [save_terminate]);






    
    return(

        <>
            <Toast/>            
            <br/>

            <ButtonGroup >
                <Button variant='contained' size='small' onClick={()=>{set_option(1);}}>Nuevo</Button>
            </ButtonGroup>

            <br/><br/><br/>

            {

             
                (option==UI_OPTION["edit"]) ?
                <div style={{backgroundColor: '#eeeeee',
                             borderRadius: "10px",
                             display: "inline-block",
                             border: '1px solid #000',
                             padding:"20px"}}>
                    
                    <Typography>Editar {expense_name()}</Typography>
                    <br/>
                    <TxtField value={gasto_monto} setter={set_gasto_monto} label={"Monto"}/>
                    <br/><br/>
		    
                    <Dropdown options={proyecto_options}
                        value={gasto_proyecto}
                        changeHandler={set_gasto_proyecto}
                        label={"Proyecto"}/>
                            <br/><br/>
                    
                    <Dropdown options={contrato_options}
                        value={gasto_contrato}
                        changeHandler={set_gasto_contrato}
                        label={"Contrato"}/>
                            <br/><br/>
                    <TextField
                    value={gasto_comentario}
                    onChange={(e)=>{set_gasto_comentario(e.target.value)}}
                    style={{ width: "500px", margin: "5px" }}
                    label="Comentario"
                    multiline
                    rows={4}/>
                    <br/><br/>
                    <DateSelector date={gasto_fecha}  setDate={set_gasto_fecha}  label={"Fecha"} />
                    <br/> <br/>
                    <ThemeProvider theme={theme}>
                        <ButtonGroup >                            
                            <Button color='green' variant='contained'  onClick={()=>{set_save_anexo(true)}}> Editar</Button>
                            <Button color='close' variant='contained' onClick={()=>{reset_state()}}> Cancelar</Button>
                        </ButtonGroup>
                    </ThemeProvider>
                    <br/>
                </div>









                : (option==UI_OPTION.delete /*&& empleado_option*/) ?
                <div style={{backgroundColor: '#eeeeee',
                             borderRadius: "10px",
                             display: "inline-block",
                             border: '1px solid #000',
                             padding:"20px"}}>
		    
                    <ThemeProvider theme={theme}>
                        <Typography color='red' variant='e1'>Eliminar {expense_name()}</Typography>
                        <br/>
                        <Typography color='black' variant='e1'>{gasto_comentario}</Typography>
                        <br/>
                        <Typography color='black' variant='e1'>{gasto_fecha}</Typography>
                    </ThemeProvider>
                    <br/>
                    <br/> 
                    <ThemeProvider theme={theme}>
                        <ButtonGroup >                            
                            <Button color='green' variant='contained'  onClick={()=>{set_save_terminate(true);}}> Confirmar</Button>
                            <Button color='close' variant='contained' onClick={()=>{reset_state();}}> Cancelar</Button>
                        </ButtonGroup>
                    </ThemeProvider>
                    <br/>
                </div>
                : <></>
            }

            {/* Data Table */}
            <br/><br/>
            <div style={{height: 1100, width: '100%'}}>
                <DataGrid
                    sx={{
                        ".low": {
                            bgcolor: "#cfffc8",
                            "&:hover": {
                                bgcolor: "#a9d4a3",
                            },
                        },
                        ".high": {
                            bgcolor: "#ffcaca",
                            "&:hover": {
                                bgcolor: "#ffa3a3",
                            },
                        },   
                    }}
                    rows={rows}
                    getRowId={(row) => row.id}
                    getRowClassName={ (params) => {return params.row.contrato ? 'low' : 'high';}}
                    columns={cols}
                    pageSize={30}
                    rowsPerPageOptions={[32]}
                    checkboxSelection={false}
		            rowHeight = {32}
                    disableSelectionOnClick={true}/>
            </div>
        </>
    )
}
