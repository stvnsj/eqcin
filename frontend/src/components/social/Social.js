import { Grid, Typography } from "@mui/material";
import {useState } from "react";
import { TextField } from '@mui/material';
import MonthSelector from "../reusable/MonthSelector";
import TxtField from "../reusable/TxtField";
import { Button, ButtonGroup } from "@mui/material";
import { useEffect } from "react";
import Grd from "../reusable/Grd";
import {theme} from '../../utils/themes'
import {ThemeProvider} from "@mui/material/styles";
import toast from 'react-hot-toast';
import { numberToDate } from "../../utils/date";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';



const handle_save_social = async function (
    valor,
    fecha,
    comentario
){

  if(!valor) {
    toast.error("El valor no puede ser vacío");
    return
  }
  if(!fecha){ 
    toast.error("La fecha no puede estar vacía");
    return
  }

  const d0    = fecha.getDate();
  const m0    = fecha.getMonth()+1;
  const y0    = fecha.getFullYear();
  const date0 = numberToDate(y0,m0,d0);

  const data ={ 
    "valor" : valor, 
    "fecha" : date0, 
    "comentario" : comentario };
  var url = `http://localhost:8000/social/new`;

  try{
      
    const res = await axios.post(url,data);
    toast.access("Gasto social");
    return 0

  } catch(e) {
    toast.error("La fecha no puede estar vacía")
    // alert(e.response.data.message);
    return 1
  }

};




const init_table = async function (setter){
  var url = "http://localhost:8000/social/get"
  
  try{
      const res = await axios.get(url);
      setter(
          res.data.data.map(
              c => ({"valor":c.valor,
                     "fecha":c.fecha,
                     "comentario":c.comentario
                  })));
                  
  } catch(error) {console.log(error);}
}


export default function Social(){

  const [fecha, set_fecha] = useState(null);
  const [valor, set_valor] = useState("");
  const [comentario, set_comentario] = useState("");

  const [save_state, set_save_state] = useState(false)
  const [reset_state, set_reset_state] = useState(false)
  const [rows, setRows] = useState([])








  const cols = [

    {field:'fecha'      ,headerName:'Fecha'        ,width:200},
    {field:'valor'      ,headerName:'Valor'        ,width:200},
    {field:'comentario' ,headerName:'Comentario'   ,width:500},
    {
        field: "button1",
        headerName: "Edición",
        sortable: false,
        width: 100,
        renderCell: (params) => {
            return (
                <ThemeProvider theme={theme}>
                    <Button
                        size='small'
                        color='yellow'
                        onClick={(e) => {
                     
                        }}
                        variant="contained"
                    >
                        editar
                    </Button>
                </ThemeProvider>);    
        }
    },
      {
          field: "button2",
          headerName: "Eliminación",
          sortable: false,
          width: 100,
          renderCell: (params) => {
              return (
                  
                  <ThemeProvider theme={theme}>
                      <Button
                          size='small'
                          color='delete'
                          onClick={(e) => {
                      
                          }}
                          variant="contained"
                      >
                          eliminar
                      </Button>
                  </ThemeProvider>
              );  
          }
      },
    ];
  
  
  
  
      
  


  useEffect(() => {

    init_table(setRows)

  }, [])



  useEffect(()=>{

     if (!save_state) return;
     var return_code = handle_save_social(valor, fecha, comentario)
     set_comentario("")
     set_fecha(null)
     set_valor("")
     set_save_state(false)
     init_table(setRows)

  },[save_state])




  useEffect(()=>{

    if(!reset_state) return;
    set_comentario("")
    set_fecha(null)
    set_valor("")
    set_save_state(false)
    set_reset_state(false)

  },[reset_state])




    



  return(

    <Grid>
      <Grd item={true}>
        <Typography variant="h6">
          <b>SOCIAL</b>
        </Typography>
      </Grd>

      <Grd item={true}>
        <br/>
        <MonthSelector fecha={fecha} setFecha={set_fecha} label={"MES"}/>
      </Grd>


      <Grd item={true}>
        <br/>
        <br/>
        <TxtField value={valor} setter={set_valor} label={"Monto"}/>
      </Grd>


      <Grd item={true}>
        <br/>
        <br/>
        <TextField
          value={comentario}
          onChange={(e)=>{set_comentario(e.target.value)}}
          style={{ width: "500px", margin: "5px" }}
          label="Comentario"
          multiline
          rows={4}/>
      </Grd>

      <Grd item={true}>
        <br/> 
        <ThemeProvider theme={theme}>
            <ButtonGroup >                            
                <Button color='green' variant='contained'  onClick={()=>{set_save_state(true);}}> Guardar</Button>
                <Button color='close' variant='contained' onClick={()=>{set_reset_state(true);}}> Cancelar</Button>
            </ButtonGroup>
        </ThemeProvider>
        <br/>
      </Grd>

      <Grd item={true}>
        <br/><br/>
                    <div style={{height: 750, width: '100%'}}>
                        <DataGrid
                            sx={{
                                ".low": {
                                    bgcolor: "#cfffc8",
                                    "&:hover": {
                                        bgcolor: "#a9d4a3",
                                    },
                                },
                                ".high": {
                                    bgcolor: "#ffcaca",
                                    "&:hover": {
                                        bgcolor: "#ffa3a3",
                                    },
                                },   
                            }}
                            rows={rows}
                            getRowId={(row) => row.fecha}
                            //getRowClassName={ (params) => {return params.row.contrato ? 'low' : 'high';}}
                            columns={cols}
                            pageSize={30}
                            rowsPerPageOptions={[30]}
                            checkboxSelection={false}
                        rowHeight = {32}
                            disableSelectionOnClick={true}/>
                    </div>
      </Grd>

    </Grid>
  );
}