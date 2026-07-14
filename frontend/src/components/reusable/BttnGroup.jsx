import { Button, ButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";

import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";


/*

STRUCTURE OF PROPS
===================

- label           :
- handler         :
- size            : 
- initialButton   :

*/



export default function BttnGroup({
  
  buttonProps,
  size = 'small',
  initialButton = -1,

}){



  const N = buttonProps.length;
  const [pressedButtons, setPressedButtons] = useState(new Array(N).fill(0));
  const [updateColor, setUpdateColor] = useState(false);
  const buttonColor = ['unselected','selected'];


  const pressButton = (i) => {

    let V = new Array(N).fill(0);
    V[i] = 1;
    setPressedButtons(V);
  }


  useEffect(()=>{
    if(!updateColor) return;





    setUpdateColor(false);
  },[updateColor])





  useEffect(()=>{

    if(initialButton==-1) return;
    pressButton(initialButton);

  },[])






  const handleClick = (i,handler) => () => {

    pressButton(i);
    handler();
    setUpdateColor(true);
  }



  return(
    <ThemeProvider theme={theme}>
      <ButtonGroup size={size}>
        {
          buttonProps.map( (b , i) => 
            <Button variant='contained' color={buttonColor[pressedButtons[i]]} onClick={handleClick(i,b.handler)}>
              {b.label}
            </Button>
          )
        }
      </ButtonGroup>
    </ThemeProvider>
  )
}