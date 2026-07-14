import  { useEffect, useState } from "react";
import { Button, ButtonGroup, Typography } from "@mui/material";
import UploadFactura from "./UploadFactura";
import CreateFactura from "./CreateFactura";
import ViewFactura from "./ViewFactura";
import ExportFactura from "./ExportFactura";
import Compare from "./Compare";
import BttnGroup from "../reusable/BttnGroup";





const OPTIONS = {
    COMPARE       : Symbol(),
    UPLOAD        : Symbol(),
    CREATE        : Symbol(),
    VIEW          : Symbol(),
    NULL          : Symbol(),
    XPORT         : Symbol(),
}


export default function FacturaIngreso(props){

    const [option, setOption] = useState(null);


    useEffect(()=>{

    },[option]);

    const handleClose =  () => {

        setOption(OPTIONS.NULL)

    }



  const buttonProps = [

    {label:  'Ver',         handler: ()=>{setOption(OPTIONS.VIEW)}  },
    {label:  'Subir',       handler: ()=>{setOption(OPTIONS.UPLOAD)}  },
    {label:  'Crear',       handler: ()=>{setOption(OPTIONS.CREATE)}  },
    {label:  'Exportar',    handler: ()=>{setOption(OPTIONS.XPORT)}  },
  ]





    return(
        <>

            <Typography variant="h6">{"Facturas EQC"}</Typography>

            <br/><br/>

            <BttnGroup buttonProps={buttonProps}/>
            

            <br/><br/>


            {
                option === OPTIONS.UPLOAD ? <UploadFactura {...props}/> :
                option === OPTIONS.CREATE ? <CreateFactura {...props } handleClose={handleClose}/> :
                option === OPTIONS.COMPARE ? <Compare/> :
                option === OPTIONS.VIEW ? <ViewFactura /> :
                option === OPTIONS.XPORT ? <div>EN CONSTRUCCIÓN</div> :
                option === OPTIONS.NULL ? <Typography variant='button'>Seleccione una sección</Typography> :
                <></>
            }
        </>
    )
}