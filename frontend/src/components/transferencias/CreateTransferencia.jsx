import * as React from "react";
import { Divider, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {es} from 'date-fns/locale'
import statusPOST from "../../utils/statusPOST";
import { minimoOptions } from "../../data/options";
import { vinculoOptions } from "../../data/options";
import TxtField from "../reusable/TxtField";
import OptionSelector from "../reusable/OptionSelector";
import { categorias } from "../../data/categorias";
import axios from "axios";
import DateSelector from '../reusable/DateSelector';
import Toast from '../reusable/Toast';
import toast  from 'react-hot-toast';


export default function CreateTransferencia(props) {


    const [save, setSave] = React.useState(false);
    const [proyectoOptions, setProyectoOptions] = React.useState([])


    const [rut, setRut]       = React.useState(null);
    const [codigo, setCodigo]   = React.useState(null);
    const [fecha, setFecha]   = React.useState(new Date());
    const [valor, setValor]   = React.useState(null);
    const [nombre, setNombre] = React.useState(null);

    const [categoriaID, setCategoriaID]  = React.useState(null);
    const [proyectoID, setProyectoID]    = React.useState(null);
    const [comentario, setComentario]    = React.useState(null);


    const clear_data = function () {

        setRut("");
        setCodigo("");
        setFecha(new Date());
        setValor("");
        setNombre("");

        setCategoriaID(null);
        setProyectoID(null);
        setComentario("");



    }
   




    const post_data = async function () {

        if(!rut)    {toast.error("El rut no puede estar vacío"); return;}
        if(!codigo) {toast.error("El código no puede estar vacío"); return;}
        if(!nombre) {toast.error("El nombre no puede estar vacío"); return;}
        if(!valor)  {toast.error("El valor no puede estar vacío"); return;}
        
        const dd = fecha.getDate();
        const mm = fecha.getMonth()+1;
        const yyyy = fecha.getFullYear();
        const myDate = `${yyyy}-${mm}-${dd}`
        
        
        let data = {
            rut,
            codigo,
            fecha:myDate,
            valor,
            nombre:nombre,
            categoria_id:categoriaID,
            proyecto_id:proyectoID,
            comentario}

        const url = 'http://localhost:8000/transferencia/create';

        
        try{
            
            const res = await axios.post(url,data);
            clear_data();
            toast.success("Transferencia creada");
            // props.handleClose();
            
        } catch(e) {

            toast.error(e.response.data.message);
        }
        
        
    }
    
    
    React.useEffect(()=>{
        
        if (!save) return;
        post_data();
        setSave(false);
        
    }, [save])
    

    React.useEffect(()=>{



        const requestOptions = {
            method: 'GET',
        }


        fetch('http://localhost:8000/proyecto',requestOptions)
        .then(response => response.json())
        .then(json => setProyectoOptions(
            json.data.map(p=>({value:p.id,label:p.nombre}))
        ))
        .catch((status) => props.notify(status + ": Error en la creación del contrato",'error'));


       setSave(false);

        

    }, [])





    return(

        <>
            <Toast/>
            
            <br />
            <br />

            <Typography variant="body1">Ingreso de Transferencia</Typography>

            <br />
            <br />



            <TxtField value={rut} setter={setRut} label={"Rut Beneficiario"}/>
            <br/><br/>
            <TxtField value={codigo} setter={setCodigo} label={"Código de la Transferencia"}/>
            <br/><br/>
            <TxtField value={valor} setter={setValor} label={"Valor"}/>
            <br/><br/>
            <TxtField value={nombre} setter={setNombre} label={"Nombre del Destinatario"}/>
            <br/><br/>
            <TextField
                value={comentario}
                onChange={(e)=>{setComentario(e.target.value)}}
                style={{ width: "500px", margin: "20px" }}
                id="outlined-multiline-static"
                label="Comentario"
                multiline
                rows={4}
            />
            <br/><br/>
            <OptionSelector 
                value={categoriaID} 
                setter={setCategoriaID} 
                label={"Categoría"}
                options={categorias}
            />

            <br/><br/>

            <OptionSelector 
                value={proyectoID} 
                setter={setProyectoID} 
                label={"Proyecto"}
                options={proyectoOptions}
            />

            <br/><br/>


            <DateSelector date={fecha}  setDate={setFecha}  label={"Fecha"} />                   


            <br/>
            <br/>

            <ButtonGroup size='small' variant="outlined" aria-label="contained primary button group">
                <Button color="primary" onClick={()=>setSave(true)}>Guardar</Button>                
                <Button color='error'   onClick={props.handleClose}>Cancelar</Button>
            </ButtonGroup>

            <br/><br/><br/>
            <Divider/>
            <br/>

        </>
    )
}
