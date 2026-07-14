
import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Typography } from '@mui/material';
import GeneralAsistencia from './GeneralAsistencia';
import { Box } from '@mui/system';
import ExportAsistencia from './ExportAsistencia';
import BttnGroup from '../reusable/BttnGroup';
import AttendanceHotDemo from './AttendanceHotDemo';



const OPTIONS = {

    GENERAL             : Symbol(),
    EDIT                : Symbol(),
    EXPORT              : Symbol(),
    MANAGE              : Symbol(),
    DEACTIVATE          : Symbol(),
    REGISTRO            : Symbol()
}




export default function Asistencia(props){

    const [option, setOption] = React.useState(OPTIONS.GENERAL);
    const buttonProps = [

      {label:'Ver'      ,handler:()=>{setOption(OPTIONS.GENERAL)}},
      {label:'Exportar' ,handler:()=>{setOption(OPTIONS.EXPORT)}},
      {label:'Registrar',handler:()=>{setOption(OPTIONS.REGISTRO)}}
    
    ]
    
    
    React.useEffect(()=>{

    }, [option])

    return (
        <Box maxWidth={'150vh'} justifyContent="center" alignItems="center" minHeight="30vh">
            <Typography variant='h5'>Asistencias</Typography>
            <BttnGroup buttonProps={buttonProps} />

            <br/>
            <br/>
              { 
                /* Views for a given proyecto */
                option===OPTIONS.GENERAL ? <GeneralAsistencia/> :
                option===OPTIONS.EXPORT  ? <ExportAsistencia/> :
                option===OPTIONS.REGISTRO ? <AttendanceHotDemo/> :
                <Typography>Seleccione una opción</Typography>
              }
            <br/>
            <br/>
        </Box>
    )
}