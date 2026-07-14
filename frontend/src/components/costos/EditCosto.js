import { Button, ButtonGroup, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import ModalGrid from "../reusable/ModalGrid";
import Paper from '@mui/material/Paper';


import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";
import { useEffect, useState } from "react";
import ModalItem from "../reusable/ModalItem";
import TxtField from "../reusable/TxtField";
import axios from "axios";
import DateSelector from "../reusable/DateSelector";
import Dropdown from "../Dropdown";
import { categoriaOptions } from "../../data/categorias";
import { dateToDate } from "../../utils/date";
import clpFormat from "../../utils/clpFormat";
import CloseButton from "../reusable/CloseButton";


const fields = {

  "boletas": {
    "rut"           :"rut",
    "serie"         :"folio",
    "fecha"         :"fecha",
    "nombre"        :"razon_social",
    "proyecto_id"   :"proyecto_id",
    "categoria_id"  :"categoria_id",
    "valor"         :"valor",
    "comentario"    :"comentario"
    
  },

  "facturas": {
    "rut"           :"rut",
    "serie"         :"folio",
    "fecha"         :"fecha",
    "nombre"        :"razon_social",
    "proyecto_id"   :"proyecto_id",
    "categoria_id"  :"categoria_id",
    "valor"         :"valor",
    "comentario"    :"comentario"
  },

  "transferencias": {
    "rut"           :"rut",
    "serie"         :"codigo",
    "fecha"         :"fecha",
    "nombre"        :"nombre",
    "proyecto_id"   :"proyecto_id",
    "categoria_id"  :"categoria_id",
    "valor"         :"valor",
    "comentario"    :"comentario"
  }
}





export default function EditCosto 
({
  closeEdition,
  id,
  documento,
  rut,
  serie,
  comentario,
  fecha,
  nombre,
  valor,
  proyecto_nombre,
  categoria,
  getData,
}){


  const [newVal, setNewVal]                     =     useState(null);
  const [openDialog, setOpenDialog]             =     useState(false);
  const [field, setField]                       =     useState(null);
  const [accept, setAccept]                     =     useState(false);
  const [fieldType, setFieldType]               =     useState(null);
  const [date, setDate]                         =     useState(new Date());
  const [proyectoOptions, setProyectoOptions]   =     useState([]);
  const [editProyecto, setEditProyecto]         =     useState(false);
  const [option, setOption]                     =     useState(null);


  const getProyectos = async () => {

    try{

      const res = await axios.get("http://localhost:8000/proyecto/options")
      setProyectoOptions(res.data.data);
    }
    catch(err){

    }
  }

  useEffect(()=>{

    if(!editProyecto);
    getProyectos();
    setEditProyecto(false);

  },[editProyecto])





  const handleOpen =  (fld)  => async () => {

    setFieldType(fld);
    setField(fields[documento][fld]);
    setOpenDialog(true);

    if(fld === "proyecto_id"){
      setEditProyecto(true);
    }
  }



  const handleClose = () => {

    setOpenDialog(false);
    setAccept(false);
    setNewVal(null);
    setOption(null);
  }



  const handleAccept = () => {

    setAccept(true);
  }





  const putData = async () => {

    const data = {

      documento    :documento,
      field        :field,
      value        :newVal,
      id           :id
    }

    if(field === "proyecto_id" || field === "categoria_id") 
    if(option) data.value = option.id;

    if(field === "fecha") {
      data.value = dateToDate(date);
      closeEdition();
    }

    



    const url = 'http://localhost:8000/costo/edit';


    try{

      await axios.put(url,data);
    }
    catch(err){

    }

    try{
      await getData();

    }
    catch(err){

      
    }
  }





  useEffect(function(){

    if(!accept) return;
    
    putData();
    setOpenDialog(false);
    setAccept(false);
    setNewVal(null);
    setOption(null);
    

  },[accept])




  return(
    <>

      <ModalGrid open={openDialog}>


        <ModalItem>
          {field}
        </ModalItem>

        {field === "fecha" ? 
        <Typography>
          Al editar la fecha, se cerrará el panel de edición
        </Typography>:<></>}


        <ModalItem>

        {

          fieldType === "rut"          ||
          fieldType === "serie"        ||
          fieldType === "nombre"       ||
          fieldType === "valor"        ||
          fieldType === "comentario"   ?

          <TxtField value={newVal} setter={setNewVal}  label={field} />  :

          fieldType === "fecha"         ?

          <DateSelector date={date} setDate={setDate} label={"Fecha"}/> :

          fieldType === "proyecto_id"   ?

          <Dropdown options={proyectoOptions} value={option} changeHandler={setOption} label={"Proyecto"} /> :

          fieldType === "categoria_id"  ?

          <Dropdown options={categoriaOptions} value={option} changeHandler={setOption} label={"Categoria"}/> :  
          
          <></>



        }

        </ModalItem>




        <ModalItem>
          <ThemeProvider theme={theme}>
            <ButtonGroup>
              <Button variant="contained" color="green" onClick={handleAccept}>
                Editar
              </Button>
              <Button variant='contained' color="error" onClick={handleClose}>
                Cancelar
              </Button>
            </ButtonGroup>
          </ThemeProvider>
        </ModalItem>
      </ModalGrid>
      
      <br/>
      <br/>

      <CloseButton handleClose={closeEdition}/>
      <br/>
      <br/>
      <TableContainer component={Paper}>
        <Table  aria-label="simple table">
          <TableBody>




            <TableRow  key={1}>
              <TableCell height={24} component="tb" scope="row"><b>RUT</b></TableCell>
              <TableCell align="right">{rut}</TableCell>
              <TableCell align="right">
                <ThemeProvider theme={theme}>
                  <Button variant="contained" color="yellow" onClick={handleOpen("rut")}>
                    Editar
                  </Button>
                </ThemeProvider> 
              </TableCell>
            </TableRow>



            <TableRow key={2}>
              <TableCell component="tb" scope="row"><b>FOLIO</b></TableCell>
              <TableCell align="right">{serie}</TableCell>
              <TableCell align="right">
              <ThemeProvider theme={theme}>
                  <Button variant="contained" color="yellow" onClick={handleOpen("serie")}>
                    Editar
                  </Button>
                </ThemeProvider>  
              </TableCell>
            </TableRow>



            <TableRow key={3}>
              <TableCell component="tb" scope="row"><b>FECHA</b></TableCell>
              <TableCell align="right">{fecha}</TableCell>
              <TableCell align="right">
                <ThemeProvider theme={theme}>
                  <Button variant="contained" color="yellow" onClick={handleOpen("fecha")}>
                    Editar
                  </Button>
                </ThemeProvider> 
              </TableCell>
            </TableRow>


            <TableRow key={4}>
              <TableCell component="tb" scope="row"><b>VALOR</b></TableCell>
              <TableCell align="right">{clpFormat( valor)}</TableCell>
              <TableCell align="right">
                <ThemeProvider theme={theme}>
                  <Button variant="contained" color="yellow" onClick={handleOpen("valor")}>
                    Editar
                  </Button>
                </ThemeProvider> 
              </TableCell>
            </TableRow>


            <TableRow key={5}>
              <TableCell component="tb" scope="row"><b>NOMBRE</b></TableCell>
              <TableCell align="right">{nombre}</TableCell>
              <TableCell align="right">
                <ThemeProvider theme={theme}>
                  <Button variant="contained" color="yellow" onClick={handleOpen("nombre")}>
                    Editar
                  </Button>
                </ThemeProvider>
              </TableCell>
            </TableRow>


            <TableRow key={6}>
              <TableCell component="tb" scope="row"><b>PROYECTO</b></TableCell>
              <TableCell align="right">{proyecto_nombre}</TableCell>
              <TableCell align="right">
              <ThemeProvider theme={theme}>
                  <Button variant="contained" color="yellow" onClick={handleOpen("proyecto_id")}>
                    Editar
                  </Button>
                </ThemeProvider> 
              </TableCell>
            </TableRow>



            <TableRow key={7}>
              <TableCell component="tb" scope="row"><b>CATEGORIA</b></TableCell>
              <TableCell align="right">{categoria}</TableCell>
              <TableCell align="right">
                <ThemeProvider theme={theme}>
                  <Button variant="contained" color="yellow" onClick={handleOpen("categoria_id")}>
                    Editar
                  </Button>
                </ThemeProvider> 
              </TableCell>
            </TableRow>



            <TableRow key={8}>
              <TableCell component="tb" scope="row"><b>COMENTARIO</b></TableCell>
              <TableCell align="right">{comentario}</TableCell>
              <TableCell align="right">
                <ThemeProvider theme={theme}>
                  <Button variant="contained" color="yellow" onClick={handleOpen("comentario")}>
                    Editar
                  </Button>
                </ThemeProvider> 
              </TableCell>
            </TableRow>


          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
