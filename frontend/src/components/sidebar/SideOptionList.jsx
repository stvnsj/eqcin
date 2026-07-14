import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import SideOption from './SideOption'
import BadgeIcon from '@mui/icons-material/Badge';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import GridOnIcon from '@mui/icons-material/GridOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CheckIcon from '@mui/icons-material/Check';
import BarChartIcon from '@mui/icons-material/BarChart';
import PercentIcon from '@mui/icons-material/Percent';
import WalletIcon from '@mui/icons-material/Wallet';
import CarIcon from '@mui/icons-material/DirectionsCar';
import { Android,AttachMoney,Payments } from '@mui/icons-material';







export default function SideOptionList(props){


    
  const [pressedOption, setPressedOption] = React.useState(new Array(17).fill(0));
  const [color, setColor] = React.useState(false);

  const unselectedOption = {bgcolor:'#fcfcfc'}
  const selectedOption   = {bgcolor:'#aeaeae'}
  const colorArray = [unselectedOption, selectedOption];

  const pressOption = (i) => {

    let v = new Array(17).fill(0);
    v[i] =  1;
    setPressedOption(v);
    setColor(true);
  }
  





  React.useEffect(()=>{
    if(!color) return;






    setColor(false);
  },[])







  return(

    <Box sx={{ overflow: 'auto' }}>
      {/* Option list on side bar */}
      <List>
        <SideOption 
          key={0}
          colorProps={colorArray[pressedOption[0]]}
          primary={"Análisis"} 
          clickFunction={()=>{
            pressOption(0);
            props.SetComponentOption(props.options.ANALYTICS)}
          }
          icon={<BarChartIcon/>}
        />

        <SideOption 
          key={2}
          colorProps={colorArray[pressedOption[1]]}
          primary={"Proyectos"} 
          clickFunction={()=>{
            pressOption(1);
            props.SetComponentOption(props.options.PROYECTO)}
          }
          icon={<ArchitectureIcon/>}
        />

        <SideOption 
          key={3} 
          colorProps={colorArray[pressedOption[2]]}
          primary={"Empleados"} 
          clickFunction={()=>{
            pressOption(2);
            props.SetComponentOption(props.options.EMPLEADO)}
          }
          icon={<BadgeIcon/>}
        />

        <SideOption 
          key={4} 
          colorProps={colorArray[pressedOption[3]]}
          primary={"Contratos"} 
          clickFunction={()=>{
            pressOption(3);
            props.SetComponentOption(props.options.CONTRATO)}
          }
          icon={<HandshakeIcon/> }
        />

        <SideOption 
          key={17} 
          colorProps={colorArray[pressedOption[4]]}
          primary={"Ingresos"} 
          clickFunction={()=>{
            pressOption(4);
            props.SetComponentOption(props.options.INGRESO)}
          }
          icon={<Payments/>}
        />

        <SideOption 
          key={5} 
          colorProps={colorArray[pressedOption[5]]}
          primary={"Costos"} 
          clickFunction={()=>{
            pressOption(5);
            props.SetComponentOption(props.options.COSTO)}
          }
          icon={<AttachMoneyIcon/>}
        />

        <SideOption
          key={6}
          colorProps={colorArray[pressedOption[6]]}
          primary={"Asistencia"} 
          clickFunction={()=>{
            pressOption(6);
            props.SetComponentOption(props.options.ASISTENCIA)}
          }
          icon={<CheckIcon/>}
        />

        <SideOption 
          key={8}
          colorProps={colorArray[pressedOption[7]]}
          primary={"Social"}
          clickFunction={()=>{
            pressOption(7);
            props.SetComponentOption(props.options.SOCIAL)}
          }
          icon={<PercentIcon/>}
        />

      </List>

      <Divider textAlign="left">Aplicaciones</Divider>
      {/* DITTO */}
      <List>
        <SideOption 
          key={13} 
          colorProps={colorArray[pressedOption[8]]}

          primary={"Mantención"} 
          clickFunction={()=>{
            pressOption(8)
            props.SetComponentOption(props.options.MAINTENANCE)}
          }
          icon={<CarIcon/>}
        />
      </List>



      
      <Divider textAlign="left">planillas</Divider>

      {/* DITTO */}
      <List>
        <SideOption 
          key={13} 
          colorProps={colorArray[pressedOption[9]]}

          primary={"Previred"} 
          clickFunction={()=>{
            pressOption(9)
            props.SetComponentOption(props.options.PREVIRED)}
          }
          icon={<GridOnIcon/>}
        />

        <SideOption 
          key={14} 
          colorProps={colorArray[pressedOption[10]]}

          primary={"Finiquito"} 
          clickFunction={()=>{
            pressOption(10)
            props.SetComponentOption(props.options.FINIQUITO)}
          }
          icon={<GridOnIcon/>}
        />

        <SideOption 
          key={15} 
          colorProps={colorArray[pressedOption[11]]}

          primary={"Sueldos"} 
          clickFunction={()=>{
            pressOption(11)
            props.SetComponentOption(props.options.BANCO)}
          }
          icon={<GridOnIcon/>}
        />
      </List>



            {/* Separates Options with horizontal Line */}
            <Divider />

        {/* DITTO */}
        <List>
            
            <SideOption 
                key={9}
                colorProps={colorArray[pressedOption[12]]}
                primary={"Descuentos"} 
                clickFunction={()=>{
                    pressOption(12);
                    props.SetComponentOption(props.options.DESCUENTO)}
                              } 
            />
            
            <SideOption 
                key={10}
                colorProps={colorArray[pressedOption[13]]}
                primary={"Anticipos"} 
                clickFunction={()=>{
                    pressOption(13);
                    props.SetComponentOption(props.options.ANTICIPO)}}/>
            
            <SideOption 
                key={11}
                colorProps={colorArray[pressedOption[14]]}
                primary={"Bonos"} 
                clickFunction={()=>{
                    pressOption(14);
                    props.SetComponentOption(props.options.BONO)}}/>
            
        </List>


      <Divider />

      {/* DITTO */}
      <List>
        <SideOption 
          key={16} 
          colorProps={colorArray[pressedOption[15]]}

          primary={"Sueldo Mínimo"} 
          clickFunction={()=>{
            pressOption(16)
            props.SetComponentOption(props.options.MINIMO)}
          }
          icon={<AttachMoneyIcon/>}
        />

      </List>
    </Box>
  )
}
