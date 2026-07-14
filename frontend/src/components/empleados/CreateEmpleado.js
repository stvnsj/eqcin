import * as React from "react";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { regiones } from "../../data/region_data";
import { comunas } from "../../data/comuna_data";
import { cuentaOptions } from "../../data/options";
import { bancoOptions } from "../../data/options";
import { regionOptions } from "../../data/options";
import SaveIcon from '@mui/icons-material/Save';
import statusPOST from "../../utils/statusPOST";
import { saludOptions , previsionOptions } from "../../data/options";
import Dropdown from "../Dropdown";
import TxtField from "../reusable/TxtField";



export default function CreateEmpleado(props){

    const [comunasOptions, setComunasOptions] = React.useState(null);


    
    const [nombre,setNombre]                       = React.useState(null);
    const [apellido1,setApellido1]                 = React.useState(null);
    const [apellido2,setApellido2]                 = React.useState(null);
    const [telefono,setTelefono]                   = React.useState(null);
    const [cuenta,setCuenta]                       = React.useState(null);
    const [email,setEmail]                         = React.useState(null);
    const [bancoID,setBancoID]                     = React.useState(null);
    const [cuentaID,setCuentaID]                   = React.useState(null);
    const [region,setRegion]                       = React.useState(null);
    const [comuna,setComuna]                       = React.useState(null);
    const [domicilio,setDomicilio]                 = React.useState(null);
    const [rut, setRut]                            = React.useState(null);
    const [salud, setSalud]                        = React.useState(null);
    const [prevision, setPrevision]                = React.useState(null);

    const [numeroDomicilio, setNumeroDomicilio]    = React.useState(null);
    const [dpto, setDpto]                          = React.useState(null);
    
    const [save, setSave]                          = React.useState(false);




    React.useEffect(()=>{


        if(!save) return;

        let empleado = {

            "nombre"           : nombre,
            "apellido_paterno" : apellido1,
            "apellido_materno" : apellido2,
            "telefono"         : telefono,
            "cuenta"           : cuenta,
            "email"            : email,
            "banco_id"         : bancoID?bancoID.id:null,
            "cuenta_id"        : cuentaID?cuentaID.id:null,
            "region_id"        : region?region.id:null,
            "comuna_id"        : comuna?comuna.id:null,
            "domicilio"        : domicilio,
            "numero_domicilio" : numeroDomicilio,
            "departamento"     : dpto,
            "rut"              : rut,
            "salud"            : salud?salud.id:null,
            "prevision"        : prevision?prevision.id:null,
        }


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(empleado)
        }


        fetch('http://localhost:8000/empleado',requestOptions)
        .then(response => statusPOST(response))
        .then(response => response.json())
        .then(json => {
            props.notify("Empleado Creado Exitosamente",'success')
            props.close(); // Empleado Creation form is closed only when successfully created
        })
        .catch((status) => props.notify(status + ": Error en la creación del empleado",'error'));
        

        setSave(false);
        
    }, [save])

    React.useEffect(()=>{

    },[comuna])


    return(

            <>
                <br />
                <br />

            <Typography variant="paragrap">Creación de Empleado</Typography>

            <br/>
            <br/>



                {/* Nombre del Empleado */}
                <TextField
                    onChange={(e)=>{setNombre(e.target.value)}}
                    value={nombre}
                    style={{ width: "500px" }}
                    type="text"
                    label="Nombres"
                    variant="outlined"
                    size="small"
                />


                <br/>
                <br/>
                
             

                {/* Apellido Paterno*/}
                <TextField
                    onChange={(e)=>{setApellido1(e.target.value)}}
                    value={apellido1}
                    style={{ width: "500px" }}
                    type="text"
                    label="Apellido Paterno"
                    variant="outlined"
                    size="small"
                />

                <br/>
                <br/>

                {/* Apellido Materno */}
                <TextField
                    onChange={(e)=>{setApellido2(e.target.value)}}
                    value={apellido2}
                    style={{ width: "500px"  }}
                    type="text"
                    label="Apellido Materno (opcional)"
                    variant="outlined"
                    size="small"
                />

                <br/>
                <br/>
                
                {/* RUT */}
                <TextField
                    onChange={(e)=>{setRut(e.target.value)}}
                    value={rut}
                    style={{ width: "500px" }}
                    type="text"
                    label="RUT"
                    variant="outlined"
                    size="small"
                />
                <br/>
                <br/>

                {/* Teléfono */}
                <TextField
                    onChange={(e)=>{setTelefono(e.target.value)}}
                    value={telefono}
                    style={{ width: "500px" }}
                    type="text"
                    label="Teléfono (opcional)"
                    variant="outlined"
                    size="small"
                />

                <br/>
                <br/>




                {/* Email */}
                <TextField
                    onChange={(e)=>{setEmail(e.target.value)}}
                    value={email}
                    style={{ width: "500px" }}
                    type="text"
                    label="Email (opcional)"
                    variant="outlined"
                    size="small"
                />

                <br/>
                <br/>               

                {/* Número de Cuenta Bancaria */}
                <TextField
                    onChange={(e)=>{setCuenta(e.target.value)}}
                    value={cuenta}
                    style={{ width: "500px" }}
                    type="text"
                    label="Número de Cuenta (opcional)"
                    variant="outlined"
                    size="small"
                />


                <br/>
                <br/>


                {/* Tipo de Cuenta */}
                <Autocomplete
                    disablePortal
                    options={cuentaOptions}
                    value={cuentaID}
                    onChange={(event, newValue) => {
                        setCuentaID(newValue);
                      }}
                    getOptionLabel={(option)=>option.label}
                    getOptionSelected={(option, value) => option.id === value.id}

                    renderInput={(params) => 

                        <TextField
                            variant="outlined"
                            style={{ width: "500px" }}
                            {...params} 
                            label={"Tipo de Cuenta (opcional)"}
                            size="small"
                        />
                    }
                />


                <br/>
                <br/>                


                {/* Banco */}
                <Autocomplete
                    disablePortal
                    options={bancoOptions}
                    value={bancoID}
                    onChange={(event, newValue) => {
                        setBancoID(newValue);
                      }}
                    getOptionLabel={(option)=>option.label}
                    getOptionSelected={(option, value) => option.id === value.id}

                    renderInput={(params) => 

                        <TextField
                            variant="outlined"
                            style={{ width: "500px" }}
                            {...params} 
                            label={"Banco (opcional)"}
                            size="small"

                        />
                    }
                />
                <br/>
                <br/>


                {/* Previsión */}
                <Dropdown options={previsionOptions} value={prevision} changeHandler={setPrevision} label='Prevision  (opcional)'/>

                <br/>
                <br/>

                {/* Salud */}
                <Dropdown options={saludOptions} value={salud} changeHandler={setSalud} label="Salud  (opcional)"/>

                <br/>
                <br/>

                {/* Domicilio */}
                <TextField
                    onChange={(e)=>{setDomicilio(e.target.value)}}
                    value={domicilio}
                    style={{ width: "500px" }}
                    type="text"
                    label="Calle (opcional)"
                    variant="outlined"
                    size="small"
                />
                <br/>
                <br/>

                <TxtField value={numeroDomicilio} setter={setNumeroDomicilio} label={"Número"}/>

                <br/>
                <br/>

                <TxtField value={dpto} setter={setDpto} label={"N. de Departamento"}/>

                <br/>
                <br/>

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
                            style={{ width: "500px" }}
                            {...params} 
                            label={"Comuna (opcional)"}
                            size="small"

                        />
                    }
                />

                <br/>
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
                            style={{ width: "500px"}}
                            {...params} 
                            label={"Región (opcional)"}
                            size="small"
                        />
                    }
                />


                <br/>
                <br/>
                <br/>


                <Button variant="contained" color="primary" onClick={()=>setSave(true)}>
                    <SaveIcon/>Guardar 
                </Button>
                

        </>
    )
}