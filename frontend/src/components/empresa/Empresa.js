import { Button, ButtonGroup, Typography } from "@mui/material";
import { useState } from "react";
import ReportEmpresa from "./ReportEmpresa";
import { useEffect } from "react";

const OPTIONS = {


    PERSONAL : Symbol(),
    COSTO    : Symbol(),
    GLOBAL   : Symbol(),
}

export default function Empresa() {


    const [xport, setXport] = useState(false)



    useEffect(()=>{

        if(!xport) return;


        const url =  `http://localhost:8000/proyecto/pwdb`;

        const requestOptions = {
        method: 'GET',
        }
        const now = new Date();
        const isoDateString = now.toISOString().slice(0, 10);

        fetch(url,requestOptions)
        .then(response => response.blob())
        .then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = `proyectos_trabajadores_mantencion_${isoDateString}` + '.json' ;
        a.click();
        });



        setXport(false);

    },[xport])





    const [option, setOption] = useState(null);
    


    return(            
    
    <>
    
    <Typography variant="h5">Empresa</Typography>
        <ButtonGroup size='small' variant="contained" aria-label="contained primary button group">
{/*         <Button color='primary' onClick={()=>{setOption(OPTIONS.PERSONAL)}}>Personal</Button>

 */}
 <Button color='primary' onClick={()=>{setXport(true)}}>Personal</Button>
         <Button color='primary' onClick={()=>{setOption(OPTIONS.COSTO)}}>Costos </Button>
        <Button color='primary' onClick={()=>{setOption(OPTIONS.GLOBAL)}}>Global </Button>
        </ButtonGroup>

        

        <br/> <br/>



        {
            option==OPTIONS.PERSONAL           ?  <ReportEmpresa/>      :     
            option==OPTIONS.COSTO              ?  "..."                 :                    
            option==OPTIONS.GLOBAL             ?  "..."                 : 
            <></>
        }

    </>

    )
}