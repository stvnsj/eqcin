import { Typography } from '@mui/material';
import * as React from "react";
import {Button} from '@mui/material';
import TablePrevired from './TablePrevired';
import MonthSelector from '../reusable/MonthSelector';
import BttnGroup from '../reusable/BttnGroup';
import AbridgedPrevired from './AbridgedPrevired';

const OPTIONS = {

  FULL      : 1,
  ABRIDGED  : 2,

}


export default function Previred() {



  const [option, setOption] = React.useState(0);


  const buttonProps = [

    {label:'Completo', handler:()=>{setOption(OPTIONS.FULL)}},
    {label:'Resumen',  handler:()=>{setOption(OPTIONS.ABRIDGED)}},  
  ]




  return (
    <>
      
      <BttnGroup  buttonProps={buttonProps}/>
      <br/><br/>

      <br/>
      {
        option === OPTIONS.FULL ?
        <TablePrevired /> :
        option === OPTIONS.ABRIDGED ?
        <AbridgedPrevired/> : 
        <></>
      }
    </>
  );
}
