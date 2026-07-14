import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

import ComponentSelector from './ComponentSelector';
import Header from './Header';
import Sidebar from './sidebar/Sidebar';


const OPTIONS = {

  ANALYTICS       : Symbol(),
  PROYECTO        : Symbol(),
  EMPLEADO        : Symbol(),
  CONTRATO        : Symbol(),
    INGRESO         : Symbol(),
  COSTO           : Symbol(),
  ASISTENCIA      : Symbol(),
  SOCIAL          : Symbol(),
  MAINTENANCE     : Symbol (),
  PREVIRED        : Symbol(),
  FINIQUITO       : Symbol(),
  SUELDO          : Symbol(),
  DESCUENTO       : Symbol(),
  ANTICIPO        : Symbol(),
  BONO            : Symbol(),
  MINIMO          : Symbol(),

    

  
  BANCO            : Symbol(),
  
  
  BOLETA          : Symbol(),
  FACTURA         : Symbol(),
  TRANSFERENCIA   : Symbol(),
  
  TRASLADO        : Symbol(),
  
  ANDROID         : Symbol(),
}



const drawerWidth = 230;

export default function ClippedDrawer() {

    const [componentOption, SetComponentOption] = React.useState(null);

    return (


        <Box sx={{ display: 'flex' }}>

            <CssBaseline />

            {/* This Component serves as header of the application */}
            <Header />
            

            {/* This Component serves as sidebar of the application */}
            <Sidebar options={OPTIONS} SetComponentOption={SetComponentOption}/>


            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                
                <Toolbar />
                <ComponentSelector options={OPTIONS} componentOption={componentOption}/>
            </Box>
            
        </Box>
    );
}
