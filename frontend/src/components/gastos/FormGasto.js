import Button from '@mui/material/Button';
import { Typography, ButtonGroup, TextField,Autocomplete } from '@mui/material';
import * as React from "react";
import DateSelector from '../reusable/DateSelector';


export default function FormGasto(props){



    const [proyectoID,setProyectoID]    = React.useState(null);
    const [valor,setValor]              = React.useState(null);
    const [fecha,setFecha]              = React.useState(new Date());
    const [comentario,setComentario]    = React.useState(null);
    const [proyecto, setProyecto]       = React.useState(null);
    const [options, setOptions]         = React.useState([])

    /* 'save' is changed to true when the 'Guardar'
       button is clicked, and is changed back to
       false when the action of saving the data
       is carried out. */
    const [save,setSave] = React.useState(false);


    const proyectoOptions = (query) => {

        let opt = query.map( proyecto =>(
            {id: proyecto.id, label: proyecto.nombre + " (id:" + proyecto.id + ")"}
        ))
        
        setOptions(opt);
    }




    /* USE EFFECT SECTION */


    React.useEffect(()=>{

        if(!save) return;

        const dd = fecha.getDate();
        const mm = fecha.getMonth()+1;
        const yyyy = fecha.getFullYear();
        const myDate = `${yyyy}-${mm}-${dd}`

        let gasto = {

            empleado_id: props.empleadoID,
            proyecto_id: proyecto?proyecto.id:null,
            valor: valor,
            fecha: myDate,
            comentario: comentario,
        }


        let URL = "";

        if(props.option == props.options.BONO)      URL = 'http://localhost:8000/bono';
        if(props.option == props.options.DESCUENTO) URL = 'http://localhost:8000/descuento';
        if(props.option == props.options.ANTICIPO)  URL = 'http://localhost:8000/anticipo';
        if(props.option == props.options.TRASLADO)  URL = 'http://localhost:8000/traslado';

        let tipoGasto = 
        props.option == props.options.BONO         ?  "Bono"      :
        props.option == props.options.DESCUENTO    ?  "Descuento" :
        props.option == props.options.ANTICIPO     ?  "Anticipo"  :
        props.option == props.options.TRASLADO     ?  "Traslado"  : '';

        


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gasto)
        }


        fetch(URL,requestOptions)
        .then(json => {

            props.notify(tipoGasto + " creado exitosamente",'success')
            props.close();

        })
        .catch((status) => props.notify(status + ": Error en la creación del " + tipoGasto,'error'));


        setSave(false);
   


    },[save])


    React.useEffect(()=>{

        const url = `http://localhost:8000/empleado/${props.empleadoID}/proyectos`;
  
        const requestOptions = {
          method: 'GET',
        }
        fetch(url,requestOptions)
        .then((res)=>res.json())
        .then((json)=>{proyectoOptions(json.data)});

    }, []);
    





    return (
        <>  
            <Typography variant="h6">{props.nombre}</Typography>

            {/* Proyecto (optional) */}
            <Autocomplete
                disablePortal
                value={proyecto}
                options={options}
                onChange={(event,newValue)=>{setProyecto(newValue)}}
                getOptionLabel={(option)=>option.label}
                getOptionSelected={(option, value) => option.id === value.id}
                renderInput={(params) => 
                    <TextField
                        variant="outlined"
                        style={{ width: "500px" }}
                        {...params} 
                        label={"Proyecto"}
                        size="small"
                    />
                }
            />

            <br/>
            <br/>

            {/* Costo Diario */}
            <TextField
                value={valor}
                onChange={(e)=>{setValor(e.target.value)}}
                style={{ width: "500px" }}
                type="text"
                label="Valor"
                variant="outlined"
                size="small"
            />

            <br/>
            <br/>

            {/* Descripción del Proyecto */}
            <TextField
                value={comentario}
                onChange={(e)=>{setComentario(e.target.value)}}
                style={{ width: "500px", margin: "5px" }}
                id="outlined-multiline-static"
                label="Comentario"
                multiline
                rows={4}
            />

            <br/>
            <br/>

            <DateSelector date={fecha}  setDate={setFecha}  label={"Fecha"} />

            <br/>
            <br/>

            <ButtonGroup size='small' variant="outlined" aria-label="contained primary button group">
                <Button color="primary" onClick={()=>setSave(true)}>Guardar</Button>                
                <Button color='error' onClick={props.close}>Cancelar</Button>
            </ButtonGroup>

            <br/>
            <br/>
        </>
    );
}
