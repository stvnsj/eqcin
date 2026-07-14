
import * as React from "react";
import { Divider, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import statusPOST from "../../utils/statusPOST";
import axios from "axios";
import Alrt from "../reusable/Alrt";
import sqlErrorSplitter from "../../utils/sqlErrorSplitter";
import Dropdown from "../Dropdown";




export default function Payment(props){



  const [valor,setValor] = React.useState(null);
  const [save,setSave] = React.useState(false);
  const [error, setError] = React.useState(null);


  /* proyecto state variables. */
  const [proyecto, setProyecto] = React.useState(null);
  const [options, setOptions] = React.useState([]);

  

  const proyectoOptions = (query) => {
    
    let opt = query.map( proyecto =>(
        {id: proyecto.id, label: proyecto.nombre + "; ID:" + proyecto.id}
    ))
    
    setOptions(opt);
}


  const validate = () => {

    if(!valor){


    }
  }



  const putData = async () => {

    if(!valor){

      props.notify( "Debe especificar un monto",'error');
      return;
    }


    const URL = `http://localhost:8000/contrato/pay/${props.contratoID}/${valor}/${proyecto?.id}`

    try{

      const res = await axios.put(URL);
      if(res.status == 201){
        props.notify("Finiquito pagado exitosamente",'success')
        props.close();
        setError(false);
        props.getData();
      }
    }

    catch(err){

      setError(err.response.data.message);
      props.notify(err.response.status + ": No se pudo pagar el finiquito",'error');
    }
  }


  React.useEffect(()=>{

    if (!save) return;

    putData();

    setSave(false);
      

  }, [save])



  React.useEffect(()=>{

    const url = `http://localhost:8000/proyecto`;

    const requestOptions = {
      method: 'GET',
    }
    fetch(url,requestOptions)
    .then((res)=>res.json())
    .then((json)=>{proyectoOptions(json.data)});

  }, []);





  return(

      <>


          
          <br />
          <br />

          <Typography variant='h6'>Finiquito del contrato {props.nombre}</Typography>

          <br />
          <br />

            <Dropdown 
                options={options} 
                value={proyecto} 
                label={"Proyecto"} 
                changeHandler={setProyecto}
            /> 
          <br />
          <br />

          {
              error ?

              <Alrt severity={'error'}>
                  {sqlErrorSplitter(error)}
              </Alrt>

              : <></>
          }

          {/* Valor del Finiquito */}
          <TextField
              value={valor}
              onChange={(e)=>{setValor(e.target.value)}}
              style={{ width: "500px" }}
              type="text"
              label="Valor del Finiquito"
              variant="outlined"
              size="small"
          />



          <br/>
          <br/>

          <ButtonGroup size='small' variant="outlined" aria-label="contained primary button group">
              <Button color="primary" onClick={()=>setSave(true)}>Guardar</Button>                
              <Button color='error' onClick={props.close}>Cancelar</Button>
          </ButtonGroup>

          <br/><br/><br/>
          <Divider/>
          <br/>

      </>
  )
}