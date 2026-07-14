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


export default function CreateFactura(props) {


    const [save, setSave] = React.useState(false);
    const [proyectoOptions, setProyectoOptions] = React.useState([])


    const [rut, setRut]     = React.useState(null);
    const [folio, setFolio] = React.useState(null);
    const [fecha, setFecha] = React.useState(new Date());
    const [valor, setValor] = React.useState(null);
    const [razon, setRazon] = React.useState(null);
    
    const [categoriaID, setCategoriaID]  = React.useState(null);
    const [proyectoID, setProyectoID]    = React.useState(null);
    const [comentario, setComentario]    = React.useState(null);
    

    const clear_data = function () {

        setRut("");
        setFolio("");
        setFecha(new Date());
        setValor("");
        setRazon("");

        setCategoriaID(null);
        setProyectoID(null);
        setComentario("");
    }




    const post_data = async function () {

        if(!rut)    {toast.error("El rut no puede estar vacío"); return;}
        if(!folio) {toast.error("El folio no puede estar vacío"); return;}
        if(!razon) {toast.error("La razón social no puede estar vacía"); return;}
        if(!valor)  {toast.error("El valor no puede estar vacío"); return;}
        
        const dd = fecha.getDate();
        const mm = fecha.getMonth()+1;
        const yyyy = fecha.getFullYear();
        const myDate = `${yyyy}-${mm}-${dd}`
        
        
        let data = {
            
            rut,
            folio,
            fecha:myDate,
            valor,
            razon_social:razon,
            categoria_id:categoriaID,
            proyecto_id:proyectoID,
            comentario}
        
        const url = 'http://localhost:8000/factura/create';


        try{
            
            const res = await axios.post(url,data);            
            toast.success("Factura creada");
            clear_data();
            
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
        .catch((status) => props.notify(status + ": Error en la creación de la factura",'error'));


       setSave(false);

        

    }, [])





    return(

        <>
            <Toast/>
            
            <br />
            <br />

            <Typography variant="body1">Ingreso de Factura</Typography>

            <br />
            <br />



            <TxtField value={rut} setter={setRut} label={"Rut Beneficiario"}/>
            <br/><br/>
            <TxtField value={folio} setter={setFolio} label={"Folio"}/>
            <br/><br/>
            <TxtField value={valor} setter={setValor} label={"Valor"}/>
            <br/><br/>
            <TxtField value={razon} setter={setRazon} label={"Razón Social"}/>
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
