import * as React from 'react';
import ButtonGroup from "@mui/material/ButtonGroup"
import Button from "@mui/material/Button"
import { Typography } from '@mui/material';
import RecordMinimo from './RecordMinimo';
import CreateMinimo from './CreateMinimo';
import BttnGroup from '../reusable/BttnGroup';

const OPTIONS = {

    CREATE              : Symbol("CREATE_EMPLEADO"),
    EDIT                : Symbol("UPDATE_EMPLEADO"),
    LIST                : Symbol("LIST_EMPLEADO"),
    RECORD              : Symbol(),

}



export default function Minimo(props){


  const [option, setOption] = React.useState(null)
  const buttonProps = [

    {label:'Crear'  ,handler:()=>{setOption(OPTIONS.CREATE)}},
    {label:'Ver'    ,handler:()=>{setOption(OPTIONS.RECORD)}},
  ]
  
    
  const close = ()=>{
      setOption(null)
  }

  React.useEffect(()=>{

  }, [option])


  return (

    <>
      <Typography variant='h5'>Sueldo Mínimo</Typography>
      <br/>
      <BttnGroup buttonProps={buttonProps}/>
      <br/>
      <br/>
        { 
          /* Views for a given proyecto */
          
          option===OPTIONS.CREATE         ?  <CreateMinimo close={close} {...props}/> : 
          option===OPTIONS.RECORD         ?  <RecordMinimo/> :
          <Typography>Seleccione una opción</Typography>
        }
      <br/>
      <br/>
    </>
  )
}