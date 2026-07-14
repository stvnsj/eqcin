import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import Grd from "../reusable/Grd";
import MonthSelector from "../reusable/MonthSelector";



export default function BancoLista(props){

  const [fecha, setFecha] = useState(new Date());
  const [xport, setXport] = useState(false);

  

  useEffect(()=>{

    if(!xport) return;

    const year = fecha.getFullYear();
    const month = fecha.getMonth()+1;

    const url = `http://localhost:8000/sueldo/banco/${year}/${month}`;

    const requestOptions = {
      method: 'GET',
    }

    fetch(url,requestOptions)
    .then(response => response.blob())
    .then(blob => {

      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = `planilla_transferencias_${year}_${month}.xlsx` ;
      a.click();
      
    });

    setXport(false);

  },[xport])




  return (

    
    <Grd>

      <Grd item={true}>
        <MonthSelector fecha={fecha} setFecha={setFecha} label={'Mes Transferencia'}/>
      </Grd>
      

      <Grd item={true}>
        <Button variant='outlined' onClick={()=>setXport(true)}>EXPORTAR</Button>
      </Grd>

      </Grd>
          
  );
}
