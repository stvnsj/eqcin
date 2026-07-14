import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FileDownloadTwoToneIcon from '@mui/icons-material/FileDownloadTwoTone';
import YearSelector from "../reusable/YearSelector";
import DateSelector from "../reusable/DateSelector";
import Grd from "../reusable/Grd";
import MonthMenu from "../reusable/MonthMenu";
import OptionSelector from "../reusable/OptionSelector";





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




export default function CostoPersonal(){




    const [xport, setXport]       = useState(false);
    const [fecha1, setFecha1]     = useState(new Date());
    const [fecha2, setFecha2]     = useState(new Date());



    
    useEffect(()=>{

	if(!xport) return;

	const year1  = fecha1.getFullYear();
	const month1 = fecha1.getMonth() + 1;
	const day1   = fecha1.getDate();
	const date1  = `${year1}-${month1}-${day1}`
	
	const year2  = fecha2.getFullYear();
	const month2 = fecha2.getMonth() + 1;
	const day2   = fecha2.getDate();
	const date2  = `${year2}-${month2}-${day2}`

	const url = `http://localhost:8000/costo/personal/${date1}/${date2}`;

	const requestOptions = {
	    method: 'GET',
	}

	fetch(url,requestOptions)
	    .then(response => response.blob())
	    .then(blob => {

		let url = window.URL.createObjectURL(blob);
		let a = document.createElement('a');
		a.href = url;
		a.download = `costo_personal_${date1}_${date2}` + '.xlsx' ;
		a.click();

	    });

	setXport(false);

    },[xport])





    return (




	<>
	    <Grd>


		<Grd item={true} mt={3}>
		    <Typography>
			Gastos de Personal
		    </Typography>
		</Grd>


		<Grd item={true}>
		    <DateSelector date={fecha1} setDate={setFecha1} label={'Inicio'}/>
		</Grd>

		<Grd item={true}>
		    <DateSelector date={fecha2} setDate={setFecha2} label={'Termino'}/>
		</Grd>


		<Grd item={true}>
		    <Button variant="contained" onClick={()=>setXport(true)} size='large'>
			<FileDownloadTwoToneIcon fontSize="large"/> Descargar
		    </Button>
		</Grd>

		<Grd item={true} mt={3}>

		</Grd>


	    </Grd>
	    

	    


	</>





    )
}
