import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import apiDateTimeFormatter from '../../utils/apiDateTimeFormatter';
import { region, comuna } from '../../data/dict';
import { Button, ButtonGroup, TextField, Typography } from '@mui/material';
import { regionOptions } from '../../data/options';
import { comunas } from '../../data/comuna_data';
import Dropdown from "../Dropdown";

import EditIcon from '@mui/icons-material/Edit';

/* Custom Themes for buttons */
import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";
import ModalGrid from '../reusable/ModalGrid';
import ModalItem from '../reusable/ModalItem';
import DateSelector from '../reusable/DateSelector';
import axios from 'axios';
import { numberToDate } from '../../utils/date';
import { scrollFunction } from '../../utils/scrollFunction';
import clpFormat from '../../utils/clpFormat';






const FIELD = {

              
  NOMBRE:          'nombre',                       
  DESCRIPCION:     'descripcion', 
  PRECIO:          'precio', 
  MARGEN:          'expect',
  FECHA:           'fecha_inicio',
  LUGAR:           'lugar',
  COMUNA:          'comuna_id',
  REGION:          'region_id',
  DURACION:        'tiempo_estimado',
  TIEMPO_OFICIAL:  'tiempo_oficial'

};





const fieldLabel = {

             
  'nombre'            : 'Nombre',           
  'descripcion'       : 'Descripción', 
  'precio'            : 'Precio', 
  'expect'            : 'Utilidad Esperada',
  'fecha_inicio'      : 'Fecha de Inicio',
  'lugar'             : 'Lugar del Proyecto',
  'comuna_id'         : 'Comuna del Proyecto',
  'region_id'         : 'Región del Proyecto',
  'tiempo_estimado'   : 'Duración Estimada (Días)',
  'tiempo_oficial'    : 'Duración Oficial (Días)',

};






export default function ProfileProyecto(props){


  let proyecto = props.query.find(pro => pro.id === props.id);


  const [edit, setEdit]         = React.useState(false);
  const [put, setPut]           = React.useState(false);
  const [field, setField]       = React.useState(false);
  const [newVal, setNewVal]     = React.useState(null);
  

  
  const clickHandler = (f) => {

    return function(){
      setField(f);
      setEdit(true);
    }

  }




  React.useEffect(()=>{

    scrollFunction('ProyectoScroll');

  },[])


  React.useEffect(()=>{

    if(!put) return;

    putData();
    
    setPut(false);

  },[put])



  const putData = async () => {


    let edition = {

      id           :proyecto.id,
      col          :field,
      newvalue     :newVal,
    }



    if(field === FIELD.FECHA){
      edition.newvalue = numberToDate(newVal.getFullYear(),newVal.getMonth()+1, newVal.getDate());
    }

    if(field === FIELD.REGION){

      if(newVal) edition.newvalue = newVal.id;
    }

    if(field === FIELD.COMUNA){

      if(newVal) edition.newvalue = newVal.id;
    }

    
    const URL = `http://localhost:8000/proyecto/edit`;


    try{

      const res = await axios.put(URL, edition);
      if(res.status == 201){

        props.notify(`Actualización exitosa`,'success');
        setNewVal(null);
        setEdit(false);
        props.getData();

      }
    }
    catch ( err ){

      props.notify("Error en la edición",'error')

    }
  }


  const rows = [

    {
      field:'ID', 
      content: proyecto.id
    },
    {
      field:'Nombre', 
      content: proyecto.nombre,
      button:  
      <ThemeProvider 
        theme={theme}> 
        <Button 
          size='small' 
          variant='contained' 
          color='edit' 
          onClick={clickHandler(FIELD.NOMBRE)}
        >
          <EditIcon/>
        </Button>
      </ThemeProvider>
    },
    {
      field:'Descripción',
      content: proyecto.descripcion,
      button:  
      <ThemeProvider 
        theme={theme}> 
        <Button 
          size='small' 
          variant='contained' 
          color='edit' 
          onClick={clickHandler(FIELD.DESCRIPCION)}
        >
          <EditIcon/>
        </Button>
      </ThemeProvider>
    },
    {
      field:'Tiempo de Duración Estimado',
      content: (proyecto.tiempo_estimado?proyecto.tiempo_estimado:0) + " días",
      button:  
      <ThemeProvider 
        theme={theme}> 
        <Button 
          size='small' 
          variant='contained' 
          color='edit' 
          onClick={clickHandler(FIELD.DURACION)}
        >
          <EditIcon/>
        </Button>
      </ThemeProvider>
    },
    {
      field:'Tiempo de Duración Oficial',
      content: (proyecto.tiempo_oficial?proyecto.tiempo_oficial:0) + " días",
      button:
      <ThemeProvider
        theme={theme}> 
        <Button 
          size='small' 
          variant='contained' 
          color='edit' 
          onClick={clickHandler(FIELD.TIEMPO_OFICIAL)}
        >
          <EditIcon/>
        </Button>
      </ThemeProvider>
    },
    {
      field:'Presupuesto Oficial',
      content: clpFormat(proyecto.precio?proyecto.precio:0),
      button:
      <ThemeProvider
        theme={theme}> 
        <Button 
          size='small' 
          variant='contained' 
          color='edit' 
          onClick={clickHandler(FIELD.PRECIO)}
        >
          <EditIcon/>
        </Button>
      </ThemeProvider>
    },
    {
      field:'Fecha Inicio', 
      content: apiDateTimeFormatter(proyecto.fecha_inicio) ,
      button:  
      <ThemeProvider 
        theme={theme}> 
        <Button 
          size='small' 
          variant='contained' 
          color='edit' 
          onClick={clickHandler(FIELD.FECHA)}
        >
          <EditIcon/>
        </Button>
      </ThemeProvider>
    },
    {
      field:'Lugar',
      content: proyecto.lugar,
      button:  
      <ThemeProvider 
        theme={theme}> 
        <Button 
          size='small' 
          variant='contained' 
          color='edit' 
          onClick={clickHandler(FIELD.LUGAR)}
        >
          <EditIcon/>
        </Button>
      </ThemeProvider>
    },

    {
      field:'Comuna',
      content: comuna[proyecto.comuna_id],
      button:  
      <ThemeProvider 
        theme={theme}> 
        <Button 
          size='small' 
          variant='contained' 
          color='edit' 
          onClick={clickHandler(FIELD.COMUNA)}
        >
          <EditIcon/>
        </Button>
      </ThemeProvider>
    },

    {
      field:'Región',
      content: region[proyecto.region_id],
      button:  
      <ThemeProvider 
        theme={theme}> 
        <Button 
          size='small' 
          variant='contained' 
          color='edit' 
          onClick={clickHandler(FIELD.REGION)}
        >
          <EditIcon/>
        </Button>
      </ThemeProvider>
    },

  ];


  return(
    <div >
      <Typography variant='body2'>Perfil del proyecto</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>

            {rows.map((row) => (

              <TableRow key={row.field}>
                <TableCell component="th" scope="row"><b>{row.field}</b></TableCell>
                <TableCell align="right">{row.content}</TableCell>
                <TableCell align="right">{row.button}</TableCell>
              </TableRow>

            ))}
          </TableBody>
        </Table>
      </TableContainer>



      <ModalGrid open={edit}>

        <ModalItem>
          <Typography>
            Edición de {fieldLabel[field]}
          </Typography>
        </ModalItem>

        <ModalItem>
          {
            field===FIELD.NOMBRE         ||
            field===FIELD.DESCRIPCION    ||
            field===FIELD.PRECIO         ||
            field===FIELD.MARGEN         ||
            field===FIELD.LUGAR          ||
            field===FIELD.DURACION       ||
            field===FIELD.TIEMPO_OFICIAL
            
            ?

            <TextField onChange={(e)=>{setNewVal(e.target.value)}}
            value={newVal}
            style={{ width: "500px" }}
            type="text"
            label={fieldLabel[field]}
            variant="outlined"/>

            :

            field === FIELD.FECHA ? <DateSelector date={newVal} setDate={setNewVal}
            label={"Fecha de Inicio"} /> 
            
            :

            field == FIELD.COMUNA ?(
            proyecto.region_id ? 
            <Dropdown options={comunas[proyecto.region_id]} value={newVal} changeHandler={setNewVal} label="Comuna"/>:
            <>Debe seleccionar antes una región</>
            )



            :

            field == FIELD.REGION ? 
            <Dropdown options={regionOptions} value={newVal} changeHandler={setNewVal} label="Región"/>

            :

            <>hola</>

          }
        </ModalItem>
        <ModalItem>
          <ButtonGroup variant='contained'  aria-label="primary button group">
              <Button variant='contained' color='success' onClick={()=>setPut(true)}>Guardar</Button>
              <Button variant='contained' color='error' onClick={()=>{setEdit(false)}}>Cancelar</Button>
          </ButtonGroup>
        </ModalItem>
      </ModalGrid>
    </div>

  )
}