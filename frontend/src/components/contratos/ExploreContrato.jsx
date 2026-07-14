
import * as React from "react";
import Dropdown from "../Dropdown";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import Button  from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TxtField from '../reusable/TxtField';
import OptionSelector from '../reusable/OptionSelector';
import DateSelector from '../reusable/DateSelector';
import { causaValueLabel } from "../../data/options";
import {theme} from '../../utils/themes';
import {ThemeProvider} from "@mui/material/styles";
import { numberToDate } from "../../utils/date";
import clpFormat from "../../utils/clpFormat";
import {Typography} from '@mui/material';
import Toast from '../reusable/Toast';
import toast from 'react-hot-toast';


export default function ExploreContrato(){

    const OPTION = {

        nuevo       : 1,
        anexo       : 2,        
        retroactivo : 3,
        edicion     : 4,
        termino     : 5,
    };

    const binary_options1 = [
        
        {value:1 , label:"SI"},
        {value:0 , label:"NO"},
    ];

    const binary_options2 = [
        
        {value:1 , label:"Contrato"},
        {value:0 , label:"Honorarios"},
    ]


    // Dropdown data
    const [empleado_option, set_empleado_option]     = React.useState(null);
    const [empleados_options, set_empleados_options] = React.useState(null);

    // Table data
    const [rows, setRows]          = React.useState([]);
    const [id_color, set_id_color] = React.useState({0:true});
    const [new_data, set_new_data] = React.useState(false);
    
    // Fields of Retroactive Contrato.
    const [contrato_id, set_contrato_id] = React.useState(null); // 
    const [costo, set_costo]     = React.useState(null); // int
    const [base, set_base]       = React.useState(null); // int
    const [labor, set_labor]     = React.useState(null); // string
    const [minimo, set_minimo]   = React.useState(null); // bool
    const [formal, set_formal]   = React.useState(null); // bool
    const [inicio, set_inicio]   = React.useState(new Date()); // date
    const [termino, set_termino] = React.useState(new Date()); // date
    const [causal, set_causal]   = React.useState(null); // int
    const [vigente, set_vigente] = React.useState(false);
    const [finiquitado, set_finiquitado] = React.useState(false)
    const [finiquito, set_finiquito] = React.useState(0)
    const [terminal, set_terminal] = React.useState(0)

    const [edit_inicio, set_edit_inicio] = React.useState(new Date());
    const [edit_termino, set_edit_termino] = React.useState(new Date());
    
    const [disable_minimo, set_disable_minimo] = React.useState(false);
    const [disable_causal, set_disable_causal] = React.useState(false);
    
    // form variables
    const [save_terminated, set_save_terminated] = React.useState(false);
    const [save_new       , set_save_new]        = React.useState(false);
    const [save_anexo     , set_save_anexo]      = React.useState(false);
    const [save_terminate , set_save_terminate]  = React.useState(false);
    const [save_edit      , set_save_edit]       = React.useState(false);

    
    const [option,set_option]                    = React.useState(0);

    const [edit_option, set_edit_option] = React.useState(0);

    
    const reset_state = async function () {
        set_option(0)
        set_costo(null);
        set_base(null);
        set_labor(null);
        set_minimo(null);
        set_formal(null);
        set_inicio(new Date());
        set_inicio(new Date());
        set_causal(null);
    };
    
    
    const cols = [

        {field:'id'      ,headerName:'ID', width: 50},
        {field:'costo'   ,headerName:'Costo Diario', width: 100, valueFormatter: params => clpFormat(params.value )},
        {field:'labor'   ,hedaerName:'Cargo', width:160},
        {field:'inicio'  ,headerName:'Inicio',width:100},
        {field:'termino' ,headerName:'Termino',width:100},
        {field:'formal' ,headerName:'Vínculo',width:100, valueFormatter: params => params.value ? "Contrato" : "Honorarios"},
        {field:'duracion',headerName:'Ext. (días)',width:90},

        {field:'inicio_sql', hide:true},
        {field:'termino_sql', hide:true},
        {field:'terminal', hide:true},
        {field:'finiquitado', hide:true},
        {field:'finiquito', hide:true},


        {
            field: "button1",
            headerName: "Anexo",
            sortable: false,
            width: 100,
            renderCell: (params) => {
                if(params.row.formal && params.row.vigente)
                    return (
                        
                        <ThemeProvider theme={theme}>
                            <Button
                                size='small'
                                color='green'
                                onClick={(e) => {
                                    set_contrato_id(params.row.id);
                                    set_labor(params.row.labor);
                                    set_costo(params.row.costo);
                                    set_option(OPTION.anexo);        
                                }}
                                variant="contained"
                            >
                                anexar
                            </Button>
                        </ThemeProvider>);
                else
                    return (<></>);
                   
            }
        },
        {
            field: "button2",
            headerName: "Terminar",
            sortable: false,
            width: 100,
            renderCell: (params) => {
                
                if(params.row.vigente)
                    return (
                        
                        <ThemeProvider theme={theme}>
                            <Button
                                size='small'
                                color='delete'
                                onClick={(e) => {
                                    set_contrato_id(params.row.id);
                                    set_formal(params.row.formal);
                                    !params.row.formal ? set_disable_causal(true) : set_disable_causal(false);
                                    set_option(OPTION.termino);
                                }}
                                variant="contained"
                            >
                                terminar
                            </Button>
                        </ThemeProvider>);
                else
                    return (<></>);
                
            }
        },
        {
            field: "button3",
            headerName: "Editar",
            sortable: false,
            width: 100,
            renderCell: (params) => {

                    return (
                        
                        <ThemeProvider theme={theme}>
                            <Button
                                size='small'
                                color='edit'
                                onClick={(e) => {
                                    
                                    set_contrato_id(params.row.id)
                                    set_labor(params.row.labor)
                                    set_costo(params.row.costo)
                                    set_option(OPTION.edicion)
                                    set_edit_inicio(params.row.inicio_sql)
                                    set_edit_termino(params.row.termino_sql)
                                    set_finiquitado(params.row.finiquitado)
                                    set_vigente(params.row.vigente)
                                    set_finiquito(params.row.finiquito)
                                    set_terminal(params.row.terminal)
                                    set_formal(params.row.formal)

                                }}
                                variant="contained"
                            >
                                editar
                            </Button>
                        </ThemeProvider>);

                
            }
        }
    ];




    

    
    
    // - Initialize Dropdown menu data.
    const init_data = async function (){

        try{
            const url = "http://localhost:8000/empleado/list";
            const res = await axios.get(url);
            
            set_empleados_options(
                res.data.data.map(
                    e => ({"id":e.id, "label": `${e.nombre} (${e.id})`})));
            
        } catch(error) { console.log(error); }
    };

    const save_terminated_data = async function (){
        
        const d0    = inicio.getDate();
        const m0    = inicio.getMonth()+1;
        const y0    = inicio.getFullYear();
        const date0 = numberToDate(y0,m0,d0);

        const d1    = termino.getDate();
        const m1    = termino.getMonth()+1;
        const y1    = termino.getFullYear();
        const date1 = numberToDate(y1,m1,d1);

        const data ={
            empleado_id: empleado_option.id,
            costo      : costo,
            labor      : labor,
            inicio     : date0,
            termino    : date1,
        };

        const url = "http://localhost:8000/contrato/cerrado";

        try{
            
            const res = await axios.post(url,data);
            toast.success("Vínculo retroactivo creado");
            
        } catch(e) {       alert(e.response.data.message);
                           console.log(e); }
    };

    

    const save_edit_data = async function (){

        if(!costo) toast.error("El costo no puede ser vacío");
        if(!labor) toast.error("El cargo no puede ser vacío");

        const data ={
            contrato_id : contrato_id,
            costo : costo,
            labor : labor,
        };

        const url = "http://localhost:8000/contrato/edit";

        try{
            const res = await axios.put(url,data);
            toast.success("Contrato actualizado");
        } catch(e) {       alert(e.response.data.message);
                           console.log(e); }
    };





    const save_new_data = async function (){

        if(!costo) toast.error("El costo no puede ser vacío");
        if(!labor) toast.error("El cargo no puede ser vacío");
        
        const d0    = inicio.getDate();
        const m0    = inicio.getMonth()+1;
        const y0    = inicio.getFullYear();
        const date0 = numberToDate(y0,m0,d0);

        const data ={
            empleado_id: empleado_option.id,
            costo      : costo,
            base       : base,
            labor      : labor,
            minimo     : minimo,
            formal     : formal,
            inicio     : date0,
        };

        const url = "http://localhost:8000/contrato/nuevo";

        try{
            
            const res = await axios.post(url,data);
            toast.access("Contrato creado");
            
        } catch(e) {
            
            alert(e.response.data.message);
        }

    };





    const save_anexo_data = async function () {

        if(!costo) toast.error("El costo no puede ser vacío");
        if(!labor) toast.error("El cargo no puede ser vacío");

        const d0    = inicio.getDate();
        const m0    = inicio.getMonth()+1;
        const y0    = inicio.getFullYear();
        const date0 = numberToDate(y0,m0,d0);

        const data ={
            costo       : costo,
            labor       : labor,
            inicio      : date0,
            base_id     : contrato_id,
        };

        const url = "http://localhost:8000/contrato/anexo";

        try{
            
            const res = await axios.post(url,data);
            toast.success("Anexo de contrato creado");
            
        } catch(e) {       alert(e.response.data.message);
                           console.log(e); }
    };


   
    const save_terminate_data = async function () {

        if(formal && !causal){

            toast.error("El campo de causal no puede estar vacío");
            return;

        }

        const d0    = termino.getDate();
        const m0    = termino.getMonth()+1;
        const y0    = termino.getFullYear();
        const date0 = numberToDate(y0,m0,d0);

        const data ={
            
            causal : causal,
            id     : contrato_id,
            year   : y0,
            month  : m0,
            day    : d0,
        };

        const url = "http://localhost:8000/contrato/terminate";

        try{
            
            const res = await axios.put(url,data);
            toast.success("Contrato terminado");
            
        } catch(e) {
            
            alert(e.response.data.message);
            console.log(e);
        }
    };



    const edit_finiquito = async function () {


        const data ={id : contrato_id, finiquito:finiquito}

        const url = "http://localhost:8000/contrato/edit_finiquito";

        try{
            
            const res = await axios.put(url,data);
            toast.success(res.data.message);
            
        } catch(e) {
            toast.error(e.response.data.message);
            //alert(e.response.data.message);
            console.log(e);
        }
    };

    


    const safe_edit_start = async function () {

        const date0 =  edit_inicio.toISOString().split("T")[0];

        const data ={
            contrato_id   : contrato_id,
            start         : date0
        };

        const url = "http://localhost:8000/contrato/safe-edit-start";

        try{
            
            const res = await axios.put(url,data);
            toast.success(res.data.message);
            
        } catch(e) {
            toast.error(e.response.data.message);
            //alert(e.response.data.message);
            console.log(e);
        }
    };


    const safe_edit_end = async function () {

        const date0 =  edit_termino.toISOString().split("T")[0];

        const data ={
            contrato_id   : contrato_id,
            end           : date0
        };

        const url = "http://localhost:8000/contrato/safe-edit-end";

        try{
            
            const res = await axios.put(url,data);
            // toast.success("Término de Contrato actualizado");
            console.log(res)
            toast.success(res.data.message);
            
        } catch(e) {
            
            toast.error(e.response.data.message);
            console.log(e);
        }
    };










 




    


    
    // - Initialize Contrato table data.
    const init_table = async function (){

        const id = empleado_option.id;

        let color = true;

        try{
            const url = `http://localhost:8000/contrato/empleado/${id}`;
            const res = await axios.get(url);
            setRows(
                res.data.data.map(
                    c => ({"id":c.id,
                           "costo":c.costo,
                           "labor":c.labor,
                           "inicio":c.inicio,
                           "termino":c.termino,
                           "inicial":c.inicial,
                           "terminal":c.terminal,
                           "duracion":c.duracion,
                           "formal":c.formal,
                           "vigente":c.vigente,
                           "inicio_sql":c.inicio_sql,
                           "termino_sql":c.termino_sql,

                           "finiquitado":c.finiquitado,
                           "vigente":c.vigente,
                           "finiquito":c.finiquito
                        })));

            

            let color_dict = {};

            res.data.data.forEach(c => {
                color_dict[c.id]= color;
                if (c.inicial) color = !color
                console.log("TERMINAL " , c.terminal)
            });

            set_id_color(color_dict);

        } catch(error) {console.log(error);}
    };



    
    

    /****************************/
    React.useEffect(() => {
        
        init_data();
    },[]);

    /****************************/
    React.useEffect(() => {
        
        if(!empleado_option) return;
        reset_state();
        init_table();
        
    } , [empleado_option]);

    /****************************/
    React.useEffect(() => {

        if(!save_terminated) return;
        save_terminated_data();
        set_save_terminated(false);
        set_new_data(true);
        set_option(0);
    } , [save_terminated]);


    /*====================
        POST NEW ANEXO 
      ====================*/     
    React.useEffect(() => {

        if(!save_anexo) return;
        save_anexo_data();
        set_save_anexo(false);
        set_new_data(true);
        set_option(0);
        init_table();
    }, [save_anexo]);

    /****************************/
    React.useEffect(()=> {

        if(!save_new) return;
        save_new_data();
        set_save_new(false);
        set_new_data(true);
        set_option(0);
    }, [save_new]);

    /****************************/
    React.useEffect(()=> {

        if(!new_data) return;
        set_new_data(false);
        init_table();
    }, [new_data]);


    /****************************/
    React.useEffect(()=> {

        if(!save_terminate) return;
        save_terminate_data();
        set_save_terminate(false);
        set_new_data(true);
        set_option(0);
    }, [save_terminate]);


    /************************
    React.useEffect(()=> {

        if(!save_edit) return;
        save_edit_data();
        set_save_edit(false);
        set_new_data(true);
        set_option(0);
    }, [save_edit]); ****/



    React.useEffect(()=> {

        if(!save_edit) return;


        if (edit_option == 1){ save_edit_data()} 
        else if (edit_option == 2) { safe_edit_start()}
        else if (edit_option == 3) { safe_edit_end()}
        else if (edit_option == 4) { edit_finiquito()}
        


        set_edit_option(0);
        set_save_edit(false);
        set_new_data(true);
        set_option(0);
    }, [save_edit]);



    /****************************/
    React.useEffect(()=> {

        if(minimo){
            
            set_base(0);
            set_disable_minimo(true);
            
        } else {

            set_disable_minimo(false);
        }
        
    }, [minimo]);





    
    return(

        <>
            <Toast/>
            <Dropdown options={empleados_options}
                      value={empleado_option}
                      changeHandler={set_empleado_option}
                      label={"empleado"}/>
            
            <br/>

            <ButtonGroup >
                <Button variant='contained' size='small' onClick={()=>{set_option(1);}}>Nuevo</Button>
                <Button variant='contained' size='small' onClick={()=>{set_option(3);}}>Retroactivo</Button>
            </ButtonGroup>

            <br/><br/><br/>

            {
                (option==OPTION["retroactivo"] && empleado_option) ?
                    
                    <div style={{backgroundColor: '#eeeeee',
                                 borderRadius: "10px",
                                 display: "inline-block",
                                 border: '1px solid #000',
                                 padding:"20px"}}>

                        <Typography>Contrato Retroactivo</Typography>
                        <br/>
                        <TxtField value={costo} setter={set_costo} label={"Costo Diario"}/>
                        <br/><br/>
                        <TxtField value={labor} setter={set_labor} label={"Cargo"}/>
                        <br/><br/>
                        <DateSelector date={inicio}  setDate={set_inicio}  label={"Inicio"} />                   
                        <DateSelector date={termino} setDate={set_termino} label={"Termino"} />
                        <br/><br/>                   
                        <ThemeProvider theme={theme}>
                            <ButtonGroup >                            
                                <Button color='green' variant='contained'  onClick={()=>{set_save_terminated(true)}}> Guardar</Button>
                                <Button color='close' variant='contained' onClick={()=>{reset_state()}}> Cancelar</Button>
                            </ButtonGroup>
                        </ThemeProvider>
                        <br/>
                    </div>
                
                
                : (option==OPTION["nuevo"] && empleado_option) ?

                <div style={{backgroundColor: '#eeeeee',
                             borderRadius: "10px",
                             display: "inline-block",
                             border: '1px solid #000',
                             padding:"20px"}}>
                    
                    <Typography>Nuevo Contrato</Typography>
                    <br/>
                    <TxtField value={costo} setter={set_costo} label={"Costo Diario"}/>
                    <br/><br/>
                    <TxtField value={labor} setter={set_labor} label={"Cargo"}/>
                    <br/><br/>
                    <OptionSelector value={minimo} setter={set_minimo} options={binary_options1} label={"Sueldo Base Minimo"}/>
                    <br/><br/>
                    <TxtField value={base} setter={set_base} label={"Sueldo Base"} disabled={disable_minimo}/>
                    <br/><br/>
                    <OptionSelector value={formal} setter={set_formal} options={binary_options2} label={"Vínculo"}/>
                    <br/><br/>
                    <DateSelector date={inicio}  setDate={set_inicio}  label={"Inicio"} />
                    <br/> <br/>
                    <ThemeProvider theme={theme}>
                        <ButtonGroup >                            
                            <Button color='green' variant='contained'  onClick={()=>{set_save_new(true)}}> Guardar</Button>
                            <Button color='close' variant='contained' onClick={()=>{reset_state()}}> Cancelar</Button>
                        </ButtonGroup>
                    </ThemeProvider>
                    <br/>
                </div>


                : (option==OPTION["anexo"] && empleado_option) ?
                <div style={{backgroundColor: '#eeeeee',
                             borderRadius: "10px",
                             display: "inline-block",
                             border: '1px solid #000',
                             padding:"20px"}}>
                    
                    <Typography>Anexo de Contrato</Typography>
                    <br/>
                    <TxtField value={costo} setter={set_costo} label={"Costo Diario"}/>
                    <br/><br/>
                    <TxtField value={labor} setter={set_labor} label={"Cargo"}/>
                    <br/><br/>
                    <DateSelector date={inicio}  setDate={set_inicio}  label={"Inicio"} />
                    <br/> <br/>
                    <ThemeProvider theme={theme}>
                        <ButtonGroup >                            
                            <Button color='green' variant='contained'  onClick={()=>{set_save_anexo(true)}}> Guardar</Button>
                            <Button color='close' variant='contained' onClick={()=>{reset_state()}}> Cancelar</Button>
                        </ButtonGroup>
                    </ThemeProvider>
                    <br/>
                </div>

                : (option==OPTION.termino && empleado_option) ?

                <div style={{backgroundColor: '#eeeeee',
                             borderRadius: "10px",
                             display: "inline-block",
                             border: '1px solid #000',
                             padding:"20px"}}>

                    <ThemeProvider theme={theme}>
                <Typography color='red' variant='e1'>Terminar vínculo</Typography>
                </ThemeProvider>

                    <br/>
                    <OptionSelector
                        value={causal}
                        setter={set_causal}
                        options={causaValueLabel}
                        label={"Causal"}
                        disabled={disable_causal}/>
                    <br/><br/>
                    <DateSelector date={termino}  setDate={set_termino}  label={"Término"} />
                    <br/> <br/>
                    <ThemeProvider theme={theme}>
                        <ButtonGroup >                            
                            <Button color='green' variant='contained'  onClick={()=>{set_save_terminate(true);}}> Guardar</Button>
                            <Button color='close' variant='contained' onClick={()=>{reset_state();}}> Cancelar</Button>
                        </ButtonGroup>
                    </ThemeProvider>
                    <br/>
                </div>


                : (option==OPTION.edicion && empleado_option) ?

                
                <div>
                    

                    {formal == 1 && terminal == 1 && vigente == 0 && finiquitado == 0 && // Option is displayed only if 
                    // contrato is finiquitado
                        (<div style={{
                                color: '#000000ff',
                                backgroundColor:"#fa3f3fff",
                                fontWeight:"1px",
                                borderRadius: "1px",
                                display: "inline-block",
                                border: '1px solid #000',
                                padding:"3px"}}>

                        <ThemeProvider theme={theme}>
                            <Typography   color='delete'>CONTRATO TERMINADO POR FINIQUITAR</Typography>
                        </ThemeProvider>
                        </div>)
                    }

                    <br/>
                    <br/>

                    <Typography>EDICIÓN</Typography>
                    
                    <div style={{backgroundColor: '#eeeeee',
                                borderRadius: "10px",
                                display: "inline-block",
                                border: '1px solid #000',
                                padding:"10px"}}>

                        <ThemeProvider theme={theme}>
                            <Typography  variant='e1' color='edit'>Costo y Cargo</Typography>
                        </ThemeProvider>

                        <br/>
                        <TxtField value={costo} setter={set_costo} label={"Costo"}/>
                        <br/><br/>
                        <TxtField value={labor} setter={set_labor} label={"Cargo"}/>
                        <br/><br/>
                        <ThemeProvider theme={theme}>
                            <ButtonGroup >                            
                                <Button color='green' variant='contained'  onClick={()=>{
                                    set_edit_option(1);
                                    set_save_edit(true);
                                    }}> Guardar</Button>
                                <Button color='close' variant='contained' onClick={()=>{reset_state();}}> Cancelar</Button>
                            </ButtonGroup>
                        </ThemeProvider>
                    </div>
                    <br/>



                    {formal == 1 && terminal == 1 && finiquitado == 1 && // Option is displayed only if 
                    // contrato is finiquitado
                        (<div style={{backgroundColor: '#eeeeee',
                                borderRadius: "10px",
                                display: "inline-block",
                                border: '1px solid #000',
                                padding:"10px"}}>

                        <ThemeProvider theme={theme}>
                            <Typography  variant='e1' color='edit'>Finiquito</Typography>
                        </ThemeProvider>
                        <br/>
                        <TxtField value={finiquito} setter={set_finiquito} label={"Finiquito"}/>
                        <br/><br/>
                        <ThemeProvider theme={theme}>
                            <ButtonGroup >                            
                                <Button color='green' variant='contained'  onClick={()=>{
                                    set_edit_option(4);
                                    set_save_edit(true);
                                    }}> Guardar</Button>
                                <Button color='close' variant='contained' onClick={()=>{reset_state();}}> Cancelar</Button>
                            </ButtonGroup>
                        </ThemeProvider>
                        </div>)
                    }





                    <div>
                        <div style={{backgroundColor: '#eeeeee',
                                borderRadius: "10px",
                                display: "inline-block",
                                border: '1px solid #000',
                                padding:"10px"}}>

                            <ThemeProvider theme={theme}>
                                <Typography  variant='e1' color='edit'>Inicio</Typography>
                            </ThemeProvider>

                            <br/>
                            <DateSelector date={edit_inicio}  setDate={set_edit_inicio}  label={"Inicio"} />  
                            
                            <ThemeProvider theme={theme}>
                                <ButtonGroup >                            
                                    <Button color='green' variant='contained'  onClick={()=>{
                                        set_edit_option(2)
                                        set_save_edit(true);
                                        }}> Guardar</Button>
                                    <Button color='close' variant='contained' onClick={()=>{reset_state();}}> Cancelar</Button>
                                </ButtonGroup>
                            </ThemeProvider>
                        </div>
                        <br/>
                        {vigente == 0 && // Termino edition is displayed only if contrato is not vigente.
                            (<div style={{backgroundColor: '#eeeeee',
                                    borderRadius: "10px",
                                    display: "inline-block",
                                    border: '1px solid #000',
                                    padding:"10px"}}>

                                <ThemeProvider theme={theme}>
                                    <Typography  variant='e1' color='edit'>Término</Typography>
                                </ThemeProvider>

                                <br/>
                                <DateSelector date={edit_termino}  setDate={set_edit_termino}  label={"Término"} />  
                                
                                <ThemeProvider theme={theme}>
                                    <ButtonGroup >                            
                                        <Button color='green' variant='contained'  onClick={()=>{
                                            set_edit_option(3);
                                            set_save_edit(true);
                                            }}> Guardar</Button>
                                        <Button color='close' variant='contained' onClick={()=>{reset_state();}}> Cancelar</Button>
                                    </ButtonGroup>
                                </ThemeProvider>
                            </div>)}
                        





                    </div>
                </div>



                
                
                : <></>
            }

            
            <br/><br/>


            <div style={{height: 750, width: '100%'}}>
                <DataGrid
                    sx={{
                        ".low": {
                            bgcolor: "#e3e3e3ff",
                            "&:hover": {
                                fontWeight: "bold"
                            },
                        },
                        ".high": {
                            bgcolor: "#bcbcbcff",
                            "&:hover": {
                                fontWeight: "bold"
                            },
                        },   
                    }}
                    rows={rows}
                    getRowId={(row) => row.id}
                    getRowClassName={ (params) => {return id_color[params.row.id] ? 'row' : 'low';}}
                    columns={cols}
                    pageSize={15}
                    rowsPerPageOptions={[15]}
                    checkboxSelection={false}
                    disableSelectionOnClick={true}/>
            </div>
        </>
    )
}
