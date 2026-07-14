
import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CreateProyecto from './CreateProyecto';
import ProyectoList from './ProyectoList';


import DeactivateProyecto from './DeactivateProyecto';
import { Typography } from '@mui/material';
import BttnGroup from '../reusable/BttnGroup';



const OPTIONS = {

  MANAGE              : Symbol(),
  CREATE              : Symbol(),
  DEACTIVATE          : Symbol(),
}





export default function Proyecto(props){

  const [option, setOption] = React.useState(null);


  const buttonProps = [

    {label:'Administrar'  ,handler:()=>{setOption(OPTIONS.MANAGE)}},
    {label:'Crear'        ,handler:()=>{setOption(OPTIONS.CREATE)}},
    {label:'Desactivar'   ,handler:()=>{setOption(OPTIONS.DEACTIVATE)}},
  ]



  React.useEffect(()=>{

  }, [option])

  
  return (
    <>
      <Typography variant='h5'>Proyectos</Typography>
      <BttnGroup buttonProps={buttonProps}/>



      <br/>
      <br/>
        { 
          /* Views for a given proyecto */
          option===OPTIONS.MANAGE        ? <ProyectoList {...props}/> :
          option===OPTIONS.CREATE        ? <CreateProyecto closeForm={()=>{setOption(null)}} {...props}/> :  
          option===OPTIONS.DEACTIVATE    ? <DeactivateProyecto/> :
          <Typography>Seleccione una opción</Typography>
        }
      <br/>
      <br/>
    </>
  )
}