import { Button, ButtonGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Factura from "../facturas/Factura";
import Boleta from "../boletas/Boleta";
import Transferencia from "../transferencias/Transferencia";
import CostoPersonal from "../personal/CostoPersonal.jsx"
import General from "./General";
import BttnGroup from "../reusable/BttnGroup";


const OPTIONS = {

    FACTURA       :  Symbol(),
    BOLETA        :  Symbol(),
    TRANSFERENCIA :  Symbol(),
    GENERAL       :  Symbol(),
    PERSONAL      :  Symbol(),
}


export default function Costo(props){





    const [option, setOption] = useState(null);

    const buttonProps = [

	{label:'Transferencias',handler:()=>{setOption(OPTIONS.TRANSFERENCIA)}},
	{label:'Boletas',handler:()=>{setOption(OPTIONS.BOLETA)}},
	{label:'Facturas',handler:()=>{setOption(OPTIONS.FACTURA)}},
	{label:'General',handler:()=>{setOption(OPTIONS.GENERAL)}},
	{label:'Personal',handler:()=>{setOption(OPTIONS.PERSONAL)}},

    ]

    

    useEffect(()=>{},[option])



    return(

	    <>
	    <Typography variant="h5">Costos</Typography>
	    <BttnGroup buttonProps={buttonProps}/>

	    <br/> <br/>



	{
            option==OPTIONS.FACTURA           ?  <Factura notify={props.notify}/>         :     
            option==OPTIONS.BOLETA            ?  <Boleta notify={props.notify}/>          :
            option==OPTIONS.TRANSFERENCIA     ?  <Transferencia notify={props.notify}/>   : 
            option==OPTIONS.GENERAL           ? <General/>                                :
		option==OPTIONS.PERSONAL            ? <CostoPersonal/>                     : 
		<></>
	}

	</>

    )
}
