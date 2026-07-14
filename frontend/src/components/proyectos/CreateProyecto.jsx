import * as React from "react";
import {Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import { comunas } from "../../data/comuna_data";
import { regionOptions } from "../../data/options";
import SaveIcon from '@mui/icons-material/Save';
import DateSelector from '../reusable/DateSelector';
import statusPOST from "../../utils/statusPOST";



export default function CreateProyecto(props){

    const [comunasOptions, setComunasOptions] = React.useState([]);

    const [save, setSave] = React.useState(false);


    /* Proyecto Creation Data */
    const [nombre, setNombre]                         = React.useState(null);
    const [descripcion, setDescripcion]               = React.useState(null);
    const [lugar, setLugar]                           = React.useState(null);
    const [comuna, setComuna]                         = React.useState(null);
    const [region, setRegion]                         = React.useState(null);
    const [precio, setPrecio]                         = React.useState(null);
    const [duracion, setDuracion]                     = React.useState(null);
    const [tiempoOficial, setTiempoOficial]           = React.useState(null); 
    const [margen, setMargen]                         = React.useState(null);
    const [fecha, setFecha]                           = React.useState(new Date());








    React.useEffect(()=>{

        if(!save) return;

        const dd = fecha.getDate();
        const mm = fecha.getMonth()+1;
        const yyyy = fecha.getFullYear();
        const myDate = `${yyyy}-${mm}-${dd}`


        let proyecto = {

            "fecha_inicio"    : myDate,
            "lugar"           : lugar,
            "nombre"          : nombre,
            "descripcion"     : descripcion,
            "region_id"       : region?region.id:null,
            "comuna_id"       : comuna?comuna.id:null,
            "precio"          : precio,
            "expect"          : margen,
            "tiempo_estimado" : duracion,
            "tiempo_oficial"  : tiempoOficial,
        }



        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proyecto)
        }

        fetch('http://localhost:8000/proyecto',requestOptions)
        .then(response => statusPOST(response))
        .then(response => response.json())
        .then(json => {

            props.notify("Proyecto Creado Exitosamente",'success')
            props.closeForm();

        })
        .catch((status) => props.notify(status + ": Error en la creación del proyecto",'error'));
        

        setSave(false);


    }, [save])



    



    return(

        <Stack spacing={2}>
            
            <br/>
            <br/>
        


            <Typography variant="paragrap">Creación de Proyecto</Typography>

            <form>



                {/* Nombre del Proyecto */}
                <TextField
                    value={nombre}
                    onChange={(e)=>{setNombre(e.target.value)}}
                    style={{ width: "500px", margin: "10px" }}
                    type="text"
                    label="Nombre"
                    variant="outlined"
                />
                


                <br />



                {/* Descripción del Proyecto */}
                <TextField
                  value={descripcion}
                  onChange={(e)=>{setDescripcion(e.target.value)}}
                  style={{ width: "500px", margin: "20px" }}
                  id="outlined-multiline-static"
                  label="Descripción (opcional)"
                  multiline
                  rows={4}
                />



                <br/>

                



                {
                  //Tiempo estimado de duración del proyecto
                }
                <TextField
                  value={duracion}
                  onChange={(e)=>{setDuracion(e.target.value)}}
                  style={{ width: "500px", margin: "20px" }}
                  type="text"
                  label="Duración Estimada(Días)"
                  variant="outlined"
                />

                <br/>

                {
                  //Tiempo oficial de duración del proyecto
                }
                <TextField
                  value={tiempoOficial}
                  onChange={(e)=>{setTiempoOficial(e.target.value)}}
                  style={{ width: "500px", margin: "20px" }}
                  type="text"
                  label="Duración Oficial(Días)"
                  variant="outlined"
                />

                <br/>

                {/* Margen esperada */}
                <TextField
                    value={precio}
                    onChange={(e)=>{setPrecio(e.target.value)}}
                    style={{ width: "500px", margin: "20px" }}
                    type="text"
                    label="Presupuesto Oficial"
                    variant="outlined"
                />

                <br/>




                {/* Lugar del Proyecto */}
                <TextField
                    value={lugar}
                    onChange={(e)=>{setLugar(e.target.value)}}
                    style={{ width: "500px", margin: "20px" }}
                    type="text"
                    label="Lugar"
                    variant="outlined"
                />

                <br />
 

                {/* Comuna */}
                <Autocomplete
                    options={comunasOptions==null?[]:comunasOptions}
                    value={comuna}
                    onChange={(event, newValue) => {

                        setComuna(newValue);
                    }}
                    getOptionLabel={(option)=>option.label}
                    getOptionSelected={(option, value) => option.id === value.id}

                    renderInput={(params) => 

                        <TextField
                            variant="outlined"
                            style={{ width: "500px" , margin: "20px"}}
                            {...params} 
                            label={"Comuna (opcional)"}
                            size="small"

                        />
                    }
                />

                <br/>

                
                {/* Región  */}
                <Autocomplete
                    options={regionOptions}
                    value={region}
                    onChange={(event, newValue) => {
                        setRegion(newValue);
                        setComunasOptions(comunas[newValue.id]);
                        setComuna(null);
                      }}
                    getOptionLabel={(option)=>option.label}
                    getOptionSelected={(option, value) => option.id === value.id}
                    renderInput={(params) => 

                        <TextField 
                            variant="outlined"
                            style={{ width: "500px", margin: "10px"}}
                            {...params} 
                            label={"Región (opcional)"}
                            size="small"
                        />
                    }
                />

                <br />
                <br />
                
                <DateSelector date={fecha}  setDate={setFecha}  label={"Fecha de Inicio"} />

                <br />
                <br />

                <Button variant="contained" color="primary" onClick={()=>setSave(true)}>

                    <SaveIcon/> guardar
                </Button>

            </form>
        </Stack>
    )
}
