import { useEffect, useState } from "react";
import PayContrato from "./PayContrato"
import { Typography } from '@mui/material';
import OldContratos from "./OldContratos";
import ViewContrato from "./ViewContrato";
import ExploreContrato from "./ExploreContrato";
import BttnGroup from "../reusable/BttnGroup";


const OPTIONS = {
    
    // CREATE    : 1, // DEPRECATED
    TERMINATE : 2,
    PAY       : 3,
    VIEW      : 4,
    OLD       : 5,
    EXPLORE   : 6,
    
}




export default function Contrato(props){
    
    const [option,setOption] = useState(null);
    
    const buttonProps = [
        
        // {label:'Crear',      handler:()=>{setOption(OPTIONS.CREATE)}}, // DEPRECATED
        // {label:'Vigentes',   handler:()=>{setOption(OPTIONS.VIEW)}},
        {label:'Explorar',   handler:()=>{setOption(OPTIONS.EXPLORE)}},
        {label:'Finiquitar', handler:()=>{setOption(OPTIONS.PAY)}},
        {label:'Antiguos',   handler:()=>{setOption(OPTIONS.OLD)}},
        
    ]
    
    
    
    useEffect(()=>{
        
    },[option])
    
    return(
        <>
            <Typography variant="h5">Contratos</Typography>
            <BttnGroup buttonProps={buttonProps}/>
            <br/><br/>
            
            
            
            { 

                /* Crear Contrato */
                /* DEPRECATED */
                /* option===OPTIONS.CREATE        ?  <CreateContrato {...props}/> : */

                /* Pagar finiquito de Contrato */
                option===OPTIONS.PAY           ?  <PayContrato    {...props}/> :

                /* Ver/editar contratos */
                option===OPTIONS.VIEW          ?  <ViewContrato   {...props}/> :

                /* Ver Contratos terminados */
                option===OPTIONS.OLD           ?  <OldContratos/> :

                /* Explorar Contratos */
                option===OPTIONS.EXPLORE       ?  <ExploreContrato/> :
                    
                <Typography> Seleccione una opción </Typography>
            }
        
        <br/>
        <br/>
        
        </>
    );
}
