import  { useEffect, useState } from "react";
import { Button, ButtonGroup, Typography } from "@mui/material";
import UploadFactura from "./UploadFactura";
import CreateFactura from "./CreateFactura";
import ViewFactura from "./ViewFactura";
import ExportFactura from "./ExportFactura";
import Compare from "./Compare";
import BttnGroup from "../reusable/BttnGroup";
import UploadSII from "./UploadSII";
import SearchBuilderDemo from "./SearchBuilderDemo";





const OPTIONS = {
    COMPARE       : Symbol(),
    UPLOAD        : Symbol(),
    UPLOAD_SII    : Symbol(),
    CREATE        : Symbol(),
    VIEW          : Symbol(),
    NULL          : Symbol(),
    XPORT         : Symbol(),
    SEARCH_DEMO   : Symbol(),
    
}


export default function Boleta(props){

    const [option, setOption] = useState(null);


    useEffect(()=>{

    },[option]);

    const handleClose =  () => {

        setOption(OPTIONS.NULL)

    }



    const buttonProps = [

        {label:  'Ver',         handler: ()=>{setOption(OPTIONS.VIEW)}  },
        {label:  'Subir',       handler: ()=>{setOption(OPTIONS.UPLOAD)}  },
        {label:  'Subir (SII)',  handler: ()=>{setOption(OPTIONS.UPLOAD_SII)}},
        {label:  'Crear',       handler: ()=>{setOption(OPTIONS.CREATE)}  },
        {label:  'Comparar *',  handler: ()=>{setOption(OPTIONS.COMPARE)}  },
        {label:  'Exportar',    handler: ()=>{setOption(OPTIONS.XPORT)}  },
        {label:  "Buscar", handler: ()=> setOption(OPTIONS.SEARCH_DEMO)}
    ]





    return(
        <>


            <BttnGroup buttonProps={buttonProps}/>
            

            <br/><br/>


            {
                option === OPTIONS.UPLOAD ? <UploadFactura {...props}/> :
                option === OPTIONS.CREATE ? <CreateFactura {...props } handleClose={handleClose}/> :
                option === OPTIONS.UPLOAD_SII ? <UploadSII/> : 
                    option === OPTIONS.COMPARE ? <Compare/> :
                    option === OPTIONS.VIEW ? <ViewFactura /> :
                    option === OPTIONS.XPORT ? <ExportFactura/> :
                    option === OPTIONS.SEARCH_DEMO ?  <SearchBuilderDemo/> :
                    option === OPTIONS.NULL ? <Typography variant='button'>Seleccione una sección</Typography> :
                    <></>
            }
        </>
    )
}
