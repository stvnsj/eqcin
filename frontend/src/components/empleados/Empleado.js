import * as React from 'react';
import ButtonGroup from "@mui/material/ButtonGroup"
import Button from "@mui/material/Button"
import CreateEmpleado from "./CreateEmpleado"
import ListEmpleado from './ListEmpleado';
import { Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const OPTIONS = {

    CREATE              : Symbol("CREATE_EMPLEADO"),
    EDIT                : Symbol("UPDATE_EMPLEADO"),
    LIST                : Symbol("LIST_EMPLEADO"),

}



export default function Empleado(props){


    const [option, setOption] = React.useState(null)
    
    const close = ()=>{
        setOption(null)
    }

    React.useEffect(()=>{

    }, [option])


    return (

        <>
            <Typography variant='h5'>Empleados</Typography>

            <ButtonGroup size='small' variant="contained" aria-label="outlined primary button group">
                <Button onClick={()=>{setOption(OPTIONS.CREATE)}}>Crear</Button>
                <Button onClick={()=>{setOption(OPTIONS.LIST)}}>Lista</Button>
            </ButtonGroup>

            <br/>
            <br/>
              { 
                /* Views for a given proyecto */
                option===OPTIONS.CREATE         ?  <CreateEmpleado close={close} {...props}/> :
                option===OPTIONS.LIST           ?  <ListEmpleado {...props}/> :  
                <Typography>Seleccione una opción</Typography>
              }
            <br/>
            <br/>
        </>
    )
}