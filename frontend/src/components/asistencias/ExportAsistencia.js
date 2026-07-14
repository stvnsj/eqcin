import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { dayName, monthName } from "../../data/timeWords";
import MonthSelector from "../reusable/MonthSelector";
import FileDownloadTwoToneIcon from '@mui/icons-material/FileDownloadTwoTone';
import Grd from "../reusable/Grd";

export default function ExportAsistencia(){




    const [fecha, setFecha] = useState(new Date())
    const [xport, setXport] = useState(false);
    const [xport1, setXport1] = useState(false);

    
    useEffect(()=>{

        if(!xport) return;

        const year = fecha.getFullYear();
        const month = fecha.getMonth()+1;

        const url = `http://localhost:8000/asistencia/export/${year}/${month}`;
  
        const requestOptions = {
          method: 'GET',
        }

        fetch(url,requestOptions)
        .then(response => response.blob())
        .then(blob => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = `asistencia_${monthName[fecha.getMonth()]}_${year}` + '.xlsx' ;
            a.click();
        } );



        setXport(false);

    },[xport])




    useEffect(()=>{

        if(!xport1) return;

        const year = fecha.getFullYear();
        const month = fecha.getMonth()+1;

        const url = `http://localhost:8000/asistencia/resumen/${year}/${month}`;
  
        const requestOptions = {
          method: 'GET',
        }

        fetch(url,requestOptions)
        .then(response => response.blob())
        .then(blob => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = `Lista_Asistentes ${month} ${year} ` + '.xlsx' ;
            a.click();
        } );



        setXport1(false);

    },[xport1])








    return (

        <Grd>
            <Grd item={true}>
                <MonthSelector fecha={fecha} setFecha={setFecha} label={'Mes Asistencia'}/>
            </Grd>
            <Grd item={true} mt={5}>
                <Typography>
                    Planilla de asistencia del mes seleccionado
                </Typography>
                <Button variant="contained" onClick={()=>setXport(true)} size='small'>
                    <FileDownloadTwoToneIcon fontSize="large"/> Descargar
                </Button>
            </Grd>


            <Grd item={true} mt={5}>
                <Typography>
                    Resumen de trabajadores asistentes a <br/> cada proyecto en el mes seleccionado
                </Typography>
                <Button variant="contained" onClick={()=>setXport1(true)} size='small'>
                    <FileDownloadTwoToneIcon fontSize="large"/> Descargar
                </Button>
            </Grd>



        </Grd>

    )
}