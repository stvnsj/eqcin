import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import apiDateTimeFormatter from '../../utils/apiDateTimeFormatter'
import ProfileProyecto from './ProfileProyecto'
import Button from '@mui/material/Button';
import AddEmpleado from './AddEmpleado';
import AsistenciaProyecto from './AsistenciaProyecto';
import EmpleadosProyecto from './EmpleadosProyecto';
import ReportProyecto from './ReportProyecto';
import CostoProyecto from './CostoProyecto';

/* Custom Themes for buttons */
import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";


import axios from 'axios';
import { scrollFunction } from '../../utils/scrollFunction';
import BttnGroup from '../reusable/BttnGroup';
import PresupuestoProyecto from './PresupuestoProyecto';




const OPTIONS = {

  PROFILE            : 1,
  ADD_EMPLEADO       : 2,
  LIST_EMPLEADO      : 3,
  ASISTENCIA         : 4,
  EDIT               : 5,
  REPORT             : 6,
  COSTO              : 7,
  PRESUPUESTO        : 8,

}


export default function ProyectoList(props){



  // STATE VARIABLES
  const [rows, setRows]                        = React.useState([]);
  const [proyectoID, setProyectoID]            = React.useState(null);
  const [proyectoNombre, setProyectoNombre]    = React.useState(null);
  const [open, setOpen]                        = React.useState(false);
  const [option, setOption]                    = React.useState(null);

  

  const clickHandler = (__proyecto_id,__proyecto_nombre) => {

    scrollFunction('ProyectoScroll');
    setProyectoID(__proyecto_id);
    setProyectoNombre(__proyecto_nombre);
    if(!open) setOpen(true);
    else setOption(OPTIONS.PROFILE);
  }

  const handleSection = (opt) => () => {

    setOption(opt);
  }


  const buttonProps = [

    {label:'Ver Proyecto',      handler:handleSection(OPTIONS.PROFILE)},
    {label:'Agregar Empleado',  handler:handleSection(OPTIONS.ADD_EMPLEADO)},
    {label:'Ver Empleados',     handler:handleSection(OPTIONS.LIST_EMPLEADO)},
    {label:'Asistencia',        handler:handleSection(OPTIONS.ASISTENCIA)},
    {label:'Costos',            handler:handleSection(OPTIONS.COSTO)},
    {label:'Resumen',           handler:handleSection(OPTIONS.REPORT)},
    {label:'Presupuesto',       handler:handleSection(OPTIONS.PRESUPUESTO)}
  ]



  const cols = [                                                             

    {field:'id',headerName:'ID',width:50},                                   
    {field:'nombre',headerName:'Nombre',width:300},
    {field:'lugar',headerName:'Lugar',width:300},
    {
      field:'fecha_inicio',
      headerName:'Inicio',
      width:200,
      valueFormatter:(params)=>apiDateTimeFormatter(params.value),
    },
    {
      field: "accion",
      headerName: "Acción",
      sortable: false,
      width: 230,
      renderCell: (params) => {
        return (
          <ThemeProvider theme={theme}>
              <Button
                  size = 'small'
              variant='contained' 
              color='green' 
              onClick={(e)=>{
                clickHandler(params.row.id, params.row.nombre)
              }}>
              Abrir
            </Button>
          </ThemeProvider>
        );
      } 
    } 
  
  ]


  
  

  const getData = async () => {
    
    const url = "http://localhost:8000/proyecto";
    const res = await axios.get(url);
    setRows(res.data.data)
  }





  React.useEffect(()=>{
    
    getData();

  }, []);



  
  /* Executed when 'profile' state 
  variable is updated. */
  React.useEffect(()=>{


  }, [open])



  React.useEffect(()=>{



  },[option])


  
  
  return (
    <>    
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid   
          rows={rows}
          rowHeight={35}
        columns={cols}
        pageSize={15}
      />
    </div>
    <br/>
    <br/>

    <div id='ProyectoScroll'>
      {/* Button group for a given proyecto */}
      {

        open ?

        <BttnGroup buttonProps={buttonProps}/>
        
        :

        <></>

      }


      <br/>
      <br/>
        {
          option===OPTIONS.PROFILE       ? <ProfileProyecto query={rows} id={proyectoID} getData={getData} {...props}/> :
          option===OPTIONS.ADD_EMPLEADO  ? <AddEmpleado proyectoID={proyectoID} {...props}/> :  
          option===OPTIONS.ASISTENCIA    ? <AsistenciaProyecto proyectoID={proyectoID} proyectoNombre={proyectoNombre} {...props}/> : 
          option===OPTIONS.LIST_EMPLEADO ? <EmpleadosProyecto proyectoID={proyectoID} {...props}/> :
          option===OPTIONS.REPORT        ? <ReportProyecto proyectoID={proyectoID}/> : 
          option===OPTIONS.COSTO         ? <CostoProyecto proyectoNombre={proyectoNombre} proyectoID={proyectoID}/> :
          option===OPTIONS.PRESUPUESTO   ? <PresupuestoProyecto proyectoID={proyectoID}/> :
          <></> 
        }
      <br/>
      <br/>
    </div>
    </>


  );
}


