import { useEffect, useState } from "react"
import { Modal, TextField, Typography, useThemeProps } from "@mui/material";
import Box from "@mui/material/Box";
import {Button,ButtonGroup} from "@mui/material";
import statusPOST from "../../utils/statusPOST";
import Dropdown from "../Dropdown";
import {cuentaOptions, bancoOptions, previsionOptions, saludOptions, regionOptions  } from "../../data/options"
import { comunas } from "../../data/comuna_data";
import {Grid} from "@mui/material";
import ModalGrid from "../reusable/ModalGrid";
import ModalItem from "../reusable/ModalItem";




/* Gets through the props the field to edit */
export default function EditEmpleado({open, handleClose,field,notify, empleado}) {

  const FIELD = {

      ID:            'id',
      NOMBRE:        'nombre',
      APELLIDO1:     'apellido_paterno',
      APELLIDO2:     'apellido_materno',
      TELEFONO:      'telefono',
      CUENTA:        'cuenta',
      EMAIL:         'email',
      BANCO_ID:      'banco_id',
      CUENTA_ID:     'cuenta_id',
      REGION_ID:     'region_id',
      COMUNA_ID:     'comuna_id',
      DOMICILIO:     'domicilio',
      NUMERO:        'numero_domicilio',
      DPTO:          'departamento',
      RUT:           'rut',
      SALUD:         'salud',
      PREVISION:     'prevision',
  };

  const newVal = () => {

    if (

      FIELD.TELEFONO  === field ||
      FIELD.CUENTA    === field ||
      FIELD.EMAIL     === field ||
      FIELD.RUT       === field ||
      FIELD.DOMICILIO === field ||
      FIELD.NUMERO    === field ||
      FIELD.DPTO      === field
    )

    return textField;

    else if(
      FIELD.BANCO_ID   === field ||
      FIELD.CUENTA_ID  === field ||
      FIELD.REGION_ID  === field ||
      FIELD.COMUNA_ID  === field ||
      FIELD.SALUD      === field ||
      FIELD.PREVISION  === field  
    )

    return optionField?optionField.id:null;

    else return null;

  }



  const fieldLabel = {

    'id'                : 'id',
    'nombre'            : 'Nombre',
    'apellido_paterno'  : 'Apellido Paterno',
    'apellido_materno'  : 'Apellido Materno',
    'telefono'          : 'Teléfono',
    'cuenta'            : 'Número de Cuenta',
    'email'             : 'Email',
    'banco_id'          : 'Banco',
    'cuenta_id'         : 'Tipo de Cuenta',
    'region_id'         : 'Región',
    'comuna_id'         : 'Comuna',
    'domicilio'         : 'Calle',
    'numero_domicilio'  : 'Numero',
    'departamento'      : 'N. de Departamento',
    'rut'               : 'Rut',
    'salud'             : 'Salud',
    'prevision'         : 'Previsión',
  };


  const [put, setPut] = useState(false);
  const [putOption, setPutOption] = useState(false);
  const [textField, setTextField] = useState(empleado[field]);
  const [optionField, setOptionField] = useState(null);





  useEffect(()=>{
    if(!put) return;

    const edition = {

        id           :empleado.id,
        col          :field,
        newvalue     :newVal(),
    }


    const URL = `http://localhost:8000/empleado/edit`;

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edition)
    }

    fetch(URL,requestOptions)
    .then(response => statusPOST(response))
    .then(response => response.json())
    .then(json => {

      notify(`Actualización exitosa`,'success');
      empleado[field] = newVal();
      setTextField('');
      setOptionField(null);
      handleClose();

    })
    .catch((status) => notify(status + ": Error en la actualización",'error'));

    setPut(false);
  },[put])




    




    return (

        <ModalGrid open={open}>
            <ModalItem>
                {
                    field===FIELD.TELEFONO   ||
                    field===FIELD.EMAIL      ||
                    field===FIELD.DOMICILIO  ||
                    field===FIELD.RUT        ||
                    field===FIELD.CUENTA     ||
                    field===FIELD.NUMERO     ||
                    field===FIELD.DPTO 
                    
                    ?

                    <TextField onChange={(e)=>{setTextField(e.target.value)}}
                    value={textField}
                    style={{ width: "500px" }}
                    type="text"
                    label={fieldLabel[field]}
                    variant="outlined"/>

                    :

                    field===FIELD.BANCO_ID ?
                    <Dropdown options={bancoOptions} value={optionField} changeHandler={setOptionField} label={fieldLabel[field]}/> :
                    
                    field===FIELD.REGION_ID ?
                    <Dropdown options={regionOptions} value={optionField} changeHandler={setOptionField} label={fieldLabel[field]}/> :

                    field===FIELD.CUENTA_ID ?
                    <Dropdown options={cuentaOptions} value={optionField} changeHandler={setOptionField} label={fieldLabel[field]}/> :

                    field===FIELD.SALUD ?
                    <Dropdown options={saludOptions} value={optionField} changeHandler={setOptionField} label={fieldLabel[field]}/> :

                    field===FIELD.PREVISION ?
                    <Dropdown options={previsionOptions} value={optionField} changeHandler={setOptionField} label={fieldLabel[field]}/> :

                    field===FIELD.COMUNA_ID && (empleado.region_id == null ||empleado.region_id == undefined ) ? 
                    <Typography variant="h5">Seleccione primero una región</Typography> :
                    
                    field===FIELD.COMUNA_ID && (empleado.region_id) ? 
                    <Dropdown options={comunas[empleado.region_id]} value={optionField} changeHandler={setOptionField} label={fieldLabel[field]}/> : ''

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