import { useEffect, useState } from "react"
import { Modal, TextField, Typography, useThemeProps } from "@mui/material";
import Box from "@mui/material/Box";
import {Button,ButtonGroup} from "@mui/material";
import statusPOST from "../../utils/statusPOST";
import Dropdown from "../Dropdown";
import {cuentaOptions, bancoOptions, previsionOptions, saludOptions, regionOptions  } from "../../data/options"
import { comunas } from "../../data/comuna_data";
import {Grid} from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {es} from 'date-fns/locale'
import { minimoOptions, vinculoOptions } from "../../data/options";
import ModalGrid from "../reusable/ModalGrid";
import ModalItem from "../reusable/ModalItem";
import axios from "axios";




/* Gets through the props the field to edit */
export default function EditContrato({open, handleClose,field,notify,contrato, getProfile}) {

    const FIELD = {

               
        LABOR       : 'labor',
        COSTO       : 'costo',
        INICIO      : 'inicio',
        FORMAL      : 'formal',
        BASE        : 'base',
        MINIMO      : 'minimo',                      
    };


    const fieldLabel = {

        'labor'      : 'Labor',
        'costo'      : 'Costo Diario',
        'inicio'     : 'Fecha de Inicio',
        'formal'     : 'Tipo de Vínculo',
        'base'       : 'Sueldo Base Imponible',
        'minimo'     : 'Minimo',
    };


    const [put, setPut] = useState(false);
    const [textField, setTextField] = useState(null);
    const [optionField, setOptionField] = useState(null);
    const [dateField, setDateField] = useState(new Date());


    const newVal = () => {

      if (

        FIELD.LABOR===field     ||
        FIELD.COSTO===field     ||
        FIELD.BASE===field
      )
      return textField;

      if(

        FIELD.FORMAL===field    ||
        FIELD.MINIMO===field    
      )
      return optionField.id;

      if(

        FIELD.INICIO===field 
      )
      return dateField.getFullYear() + '-' + (dateField.getMonth()+1) + '-' + (dateField.getDate());

      else return null;

  }



  const putData = async () => {

    const edition = {

      id           :contrato.id,
      field        :field,
      newvalue     :newVal(),
    }

    const URL = `http://localhost:8000/contrato/edit`;

    try{

      const res = await axios.put(URL, edition);
      notify(`Actualización exitosa`,'success');
      setTextField(null);
      handleClose();
      getProfile(contrato.id)
    }

    catch(err){

      notify("Error en la actualización",'error');
    }
  }



  useEffect(()=>{

    if(!put) return;


    putData();



    setPut(false);

  },[put])







  return (


    <ModalGrid open={open}>
      <ModalItem>
        {

          field===FIELD.LABOR  ||
          field===FIELD.COSTO  ||
          field===FIELD.BASE   ?


          <TextField onChange={(e)=>{
            setTextField(e.target.value)

          }}
          value={textField}
          style={{ width: "500px" }}
          type="text"
          label={fieldLabel[field]}
          variant="outlined"/> :


          field===FIELD.FORMAL ?
          <Dropdown options={vinculoOptions} value={optionField} changeHandler={setOptionField} label={fieldLabel[field]}/> :


          field===FIELD.MINIMO ?
          <Dropdown options={minimoOptions} value={optionField} changeHandler={setOptionField} label={fieldLabel[field]}/> :


          field===FIELD.INICIO ? 
          <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
          <DatePicker
            label={"Fecha de Término del Contrato"}
            value={dateField}
            minDate={"2020-01-01"}
            maxDate={ "2024-12-31"}
            onChange={(newValue) => {setDateField(newValue)}}
            renderInput={(params) => 
              <TextField {...params}
              variant="outlined"
              style={{
                width:'300px',
              }}
              />
            }
          />
          </LocalizationProvider> :

          ''

        }
      </ModalItem>
      <ModalItem>
      <ButtonGroup variant='contained'  aria-label="primary button group">
        <Button color='success' onClick={()=>setPut(true)}>Guardar</Button>
        <Button color='error' onClick={handleClose}>Cancelar</Button>
      </ButtonGroup>
      </ModalItem>
    </ModalGrid>
  )
}