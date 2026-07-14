import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import * as React from "react";

import { Typography } from "@mui/material"

import {Book } from '@mui/icons-material';
import RecordGasto from './RecordGasto';
import CreateGasto from './CreateGasto';
import ExploreGasto from './ExploreGasto'
import GlobalGasto  from './GlobalGasto'
import AddIcon from '@mui/icons-material/Add';




const SECTIONS = {
  EXPLORE     : Symbol(),
  CREATION    : Symbol(),
  EDITION     : Symbol(),
  RECORD      : Symbol(),
  GLOBAL      : Symbol(),
};


export default function Gasto(props){

    const [open,setOpen] = React.useState(false);


    const [section,setSection] = React.useState(SECTIONS.CREATION);

    const title = 
    props.option===props.options.BONO ? "BONOS" :
    props.option===props.options.ANTICIPO ? "ANTICIPOS" :
    props.option===props.options.DESCUENTO ? "DESCUENTOS" :
    props.option===props.options.TRASLADO ? "Traslado" : "";


    React.useEffect(()=>{

      setOpen(false);

    }, [props.option]);





    React.useEffect(()=>{

      if (!section) return;

    },[section])





  return (
    <>

      <Typography variant="h6">{title}</Typography>
      <ButtonGroup size='small' variant="contained" aria-label="contained primary button group">
        <Button color='primary' onClick={()=>{setSection(SECTIONS.EXPLORE);setOpen(true)}}><Book/> Explorar </Button>
        <Button color='primary' onClick={()=>{setSection(SECTIONS.GLOBAL);setOpen(true)}}><Book/> Historial </Button>
      </ButtonGroup>

      <br/>
      <br/>

	    {section===SECTIONS.EXPLORE  && open   ?  <ExploreGasto {...props}/> : <></>}
      {section===SECTIONS.GLOBAL   && open   ?   <GlobalGasto {...props}/> : <></>}

    </>
  );
}
