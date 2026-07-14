import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FileDownloadTwoToneIcon from '@mui/icons-material/FileDownloadTwoTone';
import YearSelector from "../reusable/YearSelector";
import Grd from "../reusable/Grd";
import MonthMenu from "../reusable/MonthMenu";
import OptionSelector from "../reusable/OptionSelector";
import DateSelector from "../reusable/DateSelector.jsx";






const month = {
  0:"Enero",
  1:"Febrero",
  2:"Marzo",
  3:"Abril",
  4:"Mayo",
  5:"Junio",
  6:"Julio",
  7:"Agosto",
  8:"Septiembre",
  9:"Octubre",
  10:"Noviembre",
  11:"Diciembre",
}





export default function ExportFactura(){



  const options = [
    {value:"full",       label:"Ninguno"},
    {value:"proyecto",   label:"Proyecto"},
    {value:"categoria",  label:"Categoria"},
  ]




  const [fecha, setFecha] = useState(new Date())
  const [xport, setXport] = useState(false);




  const [xport2, setXport2]     = useState(false);
  const [option, setOption]     = useState("full")
  const [fecha1, setFecha1]     = useState(new Date());
  const [fecha2, setFecha2]     = useState(new Date());



  const filenameBuilder  =  () => {

    const y1 = fecha1.getFullYear();
    const y2 = fecha2.getFullYear();

    const m1 = fecha1.getMonth();
    const m2 = fecha2.getMonth();

    const timeRange = `${month[m1]}_${y1}_-_${month[m2]}_${y2}`

    return `Facturas_${timeRange}`;
  }




  
  useEffect(()=>{

    if(!xport) return;

    const year = fecha.getFullYear();

    const url = `http://localhost:8000/factura/xport/${year}`;

    const requestOptions = {
      method: 'GET',
    }

    fetch(url,requestOptions)
    .then(response => response.blob())
    .then(blob => {
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = `Facturas` + '.xlsx' ;
      a.click();
    });



    setXport(false);

  },[xport])


  useEffect(()=>{

    if(!xport2) return;



      const year1 = fecha1.getFullYear();
      const year2 = fecha2.getFullYear();

      const month1 = fecha1.getMonth() + 1;
      const month2 = fecha2.getMonth() + 1;

      const day1 = fecha1.getDate()
      const day2 = fecha2.getDate()

      const date1 = `${year1}-${month1}-${day1}`
      const date2 = `${year2}-${month2}-${day2}`
      


    const url = `http://localhost:8000/factura/detalle/${date1}/${date2}/${option}`;

    const requestOptions = {
      method: 'GET',
    }

    fetch(url,requestOptions)
    .then(response => response.blob())
    .then(blob => {

      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = `${filenameBuilder()}` + '.xlsx' ;
      a.click();

    });

    setXport2(false);

  },[xport2])








  return (


    <>
      <Grd>


        <Grd item={true} mt={3}>
          <Typography>
            Resumen Facturas
          </Typography>
        </Grd>


        <Grd item={true}>
          <YearSelector fecha={fecha} setFecha={setFecha} label={'Año Resumen'}/>
        </Grd>

        <Grd item={true}>
          <Button variant="contained" onClick={()=>setXport(true)} size='large'>
            <FileDownloadTwoToneIcon fontSize="large"/> Descargar
          </Button>
        </Grd>

        <Grd item={true} mt={3}>
          <Typography>
            Detalle Facturas
          </Typography>
        </Grd>


        <Grd item={true}>
          <DateSelector date={fecha1} setDate={setFecha1} label={'INICIO'}/>
          <DateSelector date={fecha2} setDate={setFecha2} label={'FIN'}/>
        </Grd>
	  
        <Grd item={true}>
          <OptionSelector value={option} setter={setOption} options={options} label={"CRITERIO"}/>
        </Grd>

        <Grd item={true}>
          <Button variant="contained" onClick={()=>setXport2(true)} size='large'>
            <FileDownloadTwoToneIcon fontSize="large"/> Descargar
          </Button>
        </Grd>

        <Grd item={true} mt={3}>

        </Grd>


      </Grd>

      


    </>


  )


}
