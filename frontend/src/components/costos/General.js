

import  { useEffect, useState } from "react";
import { Button, ButtonGroup, Typography } from "@mui/material";
import DownloadCosto from "./DownloadCosto";
import Chart from "./Chart";





const OPTIONS = {

  SUMMARY        : Symbol(),
  MATRIX         : Symbol(),
  OTHER          : Symbol(),
  PROYECTO       : Symbol(),
  CHART          : Symbol(),
  XPORT          : Symbol(),
}



export default function General(){


  const [option, setOption] = useState(OPTIONS.XPORT);


  useEffect(()=>{

  },[option]);

  






  return(

    <>
      
      <ButtonGroup size='small' aria-label="contained primary button group">
        <Button  onClick={()=>{setOption(OPTIONS.XPORT)}}>Exportar</Button>
      </ButtonGroup>

      <br/> <br/>
  
      {
        option === OPTIONS.XPORT        ?  <DownloadCosto/>  :
        option === OPTIONS.MATRIX       ?  <></>       :
        option === OPTIONS.CHART        ?  <Chart/>    :
        option === OPTIONS.CHART        ?  <>Proyecto</>    :
        option === OPTIONS.OTHER        ? <Typography variant="caption">EN CONSTRUCCIÓN</Typography>       :  <></>
      }
        
    </>
  );
}