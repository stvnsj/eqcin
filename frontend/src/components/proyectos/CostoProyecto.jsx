import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FileDownloadTwoToneIcon from '@mui/icons-material/FileDownloadTwoTone';
import Grd from "../reusable/Grd";
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


export default function CostoProyecto(props) {




    const documentoOptions = [

	{value:"boleta",          label:"Boletas"},
	{value:"factura",         label:"Facturas"},
	{value:"transferencia",   label:"Transferencias"},
	{value:"full",            label:"Boletas Facturas y Transferencias"},

    ]




    const [options, setOptions]       = useState([

	{value:"full",       label:"Ninguno"},
	{value:"categoria",  label:"Categoria"},

    ])


    const [xport2, setXport2]         = useState(false);
    const [option, setOption]         = useState("boleta")
    const [documento, setDocumento]   = useState("boleta")

    const filenameBuilder  =  (documento) => {


	const timeRange = `(${props.proyectoNombre})`

	if(documento==="boleta")         return `Boletas_${timeRange}`
	if(documento==="factura")        return `Facturas_${timeRange}`
	if(documento==="transferencia")  return `Transferencias_${timeRange}`
	if(documento==="full")           return `Bol_Fac_Trans_${timeRange}`

    }


    
    useEffect(()=> {

	console.log(option)

	if(documento === "full"){

	    setOptions([

		{value:"full",       label:"Ninguno"},
		{value:"categoria",  label:"Categoria"},
		{value:"tipo",       label:"Tipo de Documento"},
		
	    ])
	}


	else {

	    setOptions([

		{value:"full",       label:"Ninguno"},
		{value:"categoria",  label:"Categoria"},
		
	    ])
	    setOption("full")
	}

    }, [documento])



    useEffect(()=>{

	if(!xport2) return;

	const url = `http://localhost:8000/costo/proyecto/${documento}/${option}/${props.proyectoID}`;

	const requestOptions = {
	    method: 'GET',
	}

	fetch(url,requestOptions)
	    .then(response => response.blob())
	    .then(blob => {

		let url = window.URL.createObjectURL(blob);
		let a = document.createElement('a');
		a.href = url;
		a.download = `${filenameBuilder(documento)}` + '.xlsx' ;
		a.click();

	    });

	setXport2(false);

    },[xport2])





    return (




	<>
	    <Grd>

		<Grd item={true}>
		    <OptionSelector
			value={documento}
			setter={setDocumento}
			options={documentoOptions}
			label={"Tipo de Documento"}/>
		</Grd>

		<Grd item={true}>
		    <OptionSelector
			value={option}
			setter={setOption}
			options={options}
			label={"Clasificación"}/>
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
