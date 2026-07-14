import * as React from "react";
import {Divider, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import axios from "axios";
import Alrt from "../reusable/Alrt";
import sqlErrorSplitter from "../../utils/sqlErrorSplitter";
import Dropdown from "../Dropdown";


/*=======================================
    Props List

    id: id of contracto to be terminated.
  =======================================*/
export default function FiniquitoProject(props){


  const [edit, setEdit] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [options, setOptions] = React.useState([]);
  const [value, setValue] = React.useState(null);
  const [id,setId] = React.useState(null)




  const putData = async () => {



    const URL = `http://localhost:8000/contrato/edit`;

    const contrato = {
      field: "proyecto_id",
      newvalue: value.id,
      id: id
    }

    try{

      const res = await axios.put(URL,contrato)
      if(res.status == 201){
        props.getData();
        setEdit(false)
      }
    }
    catch(err){


    }

  }


  const getProyectos = async () => {

    const URL = `http://localhost:8000/proyecto/options`;


    try{

      const res = await axios.get(URL)
      setOptions(res.data.data.map(proyecto => ({
        id : proyecto.id , label: proyecto.label
      })));
      console.log(res.data.data)
    }
    catch(err){

      console.log(err)
      setError(err)
    }
  }





  React.useEffect(()=>{

    getProyectos();

  },[])



  React.useEffect(()=>{

    if(!edit) return;

    putData(props.documento_id);

    setEdit(false)
    
  }, [edit]);

  React.useEffect(()=> {

    setId(props.contratoID);

  },[props.contratoID])


  return(

    <div>
      <br/>

      {
        error ?
        <Alrt severity={'error'}>
            {sqlErrorSplitter(error)}
        </Alrt>
        : <></>
      }

      <br/>
      <Typography>Proyecto que asume el costo del fíniquito de {props.nombre}</Typography>
      <br/>

      <Dropdown options={options} value={value} changeHandler={setValue} label={"Proyecto"}/> 

      <br/>
      <ButtonGroup size='small' variant="outlined" aria-label="contained primary button group">
        <Button color="primary" onClick={()=>setEdit(true)}>Guardar</Button>                
        <Button color='error' onClick={props.close}>Cancelar</Button>
      </ButtonGroup>
      <br/><br/>
    </div>
  )
}