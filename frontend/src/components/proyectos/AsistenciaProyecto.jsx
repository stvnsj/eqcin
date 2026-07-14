import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button  from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {es} from 'date-fns/locale'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {  Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DataGrid } from '@mui/x-data-grid';
import ModalGrid from '../reusable/ModalGrid';
import ModalItem from '../reusable/ModalItem';
import { scrollFunction } from '../../utils/scrollFunction';
import DateSelector from '../reusable/DateSelector';
import axios from 'axios';
import { useRef } from 'react';

import Toast from '../reusable/Toast';
import toast  from 'react-hot-toast';


const day = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]

const mes = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]




/* This component lets mark asistencia for a given
   proyecto and fecha */

export default function AsistenciaProyecto(props) {

  const [date, setDate] = React.useState(new Date());
  const [rows, setRows] = React.useState([]);
  const [save, setSave] = React.useState(false);
  const [modal,setModal] = React.useState(false);

  const [selectionModel, setSelectionModel] = React.useState([]);

  React.useEffect(()=>{

  },[selectionModel])


  const dayForward = () => setDate(new Date(date.getFullYear(),date.getMonth(),date.getDate()+1))
  const dayBackward = () => setDate(new Date(date.getFullYear(),date.getMonth(),date.getDate()-1))


  const cols = [

    { field: 'id',     headerName: 'ID', width: 70 },
    { field: 'nombre', headerName: 'Nombre', width: 240 },
    { field: 'rut',    headerName: 'Rut', width: 130 },
    { field: 'labor',  headerName: 'Cargo', width: 200 },
  ]




  function rowBuilder(input) {

    let arr = input.map(
      function(empleado){
        return {
          id:                       empleado.id,
          nombre:                   empleado.nombre,
          rut:                      empleado.rut,
          labor:                    empleado.labor,
          present:                  empleado.registro===1?true:false,
        }
      }
    )

    setRows(arr);

    let s_model = arr
    .filter( empleado => empleado.present)
    .map(empleado => empleado.id)

    setSelectionModel(s_model)

  }

  const updateAsistencia = (id_array) => {

    let arr = rows.map(

      function(row){

        if (id_array.includes(row.id)) return {...row, present:true,};
        else return {...row, present:false,}
      }
    )

    setRows(arr);
  }




    const export_JSON = async function (){

        const proyecto_id = props.proyectoID;
        const proyecto_nombre = props.proyectoNombre
        
        
        const url = `http://localhost:8000/asistencia/generate-json/${proyecto_id}`;
        
       	const requestOptions = {method: 'GET'}

	    fetch(url,requestOptions)
	    .then(response => response.blob())
	    .then(blob => {

            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = `${proyecto_nombre}` + '.json' ;
            a.click();

	    });

       
    }

    const fileInput = useRef(null);

    const handleClick = () => fileInput.current?.click();


    const import_JSON  = async e => {
        const file = e.target.files[0];
        if (!file) return;

        try {
        // ① read the file
        const text   = await file.text();
        // ② quick client-side parse so we can show an early error
        const parsed = JSON.parse(text);

        // ③ POST raw JSON (simplest; no multipart needed)
        const res = await axios.post('http://localhost:8000/asistencia/import-json', parsed, {
            headers: { 'Content-Type': 'application/json' }
        });

        toast.success(res.data.message);
        } catch (err) {
        toast.error(err.response.data.message);
        console.error(err);
        } finally {
        // reset input so selecting the same file twice still triggers onChange
        e.target.value = '';
        }
    };
    




  /***********************
  * USE EFFECT SECTION 
  ************************/



    const save_asistencia = async function () {

        const dd = date.getDate();
        const mm = date.getMonth()+1;
        const yyyy = date.getFullYear();
        const myDate = `${yyyy}-${mm}-${dd}`

        const data = {
            fecha:myDate,
            proyecto_id:props.proyectoID,
            asistencia:rows};

        const url = 'http://localhost:8000/asistencia/all';

        try {

            const res = await axios.post(url, data);
            const succ_message = "Asistencia registrada exitosamente"
            toast.success(succ_message);

            
        } catch (err) {
 
            const err_message = err.response.data.message;
            toast.error('Error: ' + err_message)
            
        } 

        setSave(false);
        setModal(false)
    }




    
    React.useEffect(()=>{

        if(!save) return;

        save_asistencia();

    }, [save]);


  React.useEffect(()=>{


    const dd = date.getDate();
    const mm = date.getMonth()+1;
    const yyyy = date.getFullYear();
    const url = `http://localhost:8000/proyecto/empleados/asistencia/${props.proyectoID}/${yyyy}/${mm}/${dd}`;

    const requestOptions = {
      method: 'GET',
    }

    fetch(url,requestOptions)
    .then((res)=>res.json())
    .then((json)=>{rowBuilder(json.data)});

    

  }, [date]);

  React.useEffect(()=>{

    scrollFunction('ProyectoScroll');

  },[])




    return (

        <>

            <Toast/>
            
            <br/>

            <ButtonGroup >
                <Button variant='outlined' onClick={export_JSON}>EXPORTAR </Button>
                <Button variant='outlined' onClick={handleClick}>IMPORTAR</Button>
                <input
                    type="file"
                    accept=".json,application/json"
                    onChange={import_JSON}
                    ref={fileInput}
                    hidden
                />
            </ButtonGroup>

            <br/>

            <Typography variant='body1'>
                {day[date.getDay()] + ' ' + date.getDate() + ' de ' + mes[date.getMonth()]}
            </Typography>
            
            <br/>
            
            <DateSelector date={date}  setDate={setDate}  label={"Fecha de Asistencia"} />

            <br/>
            
            <ButtonGroup >
                <Button variant='outlined' onClick={dayBackward}><ArrowBackIcon/> </Button>
                <Button variant='outlined' onClick={dayForward}><ArrowForwardIcon/></Button>
                <Button variant='outlined' onClick={()=>setModal(true)}>Editar</Button>
            </ButtonGroup>


            
            
            <br/>




            <TableContainer  component={Paper}>
                <Table sx={{ minWidth: 420 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell component="th">ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>RUT</TableCell>
                            <TableCell>Cargo</TableCell>
                            <TableCell align="right">Asistencia</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow height='20px' key={row.id}>
                                <TableCell scope="row"> {row.id} </TableCell>
                                <TableCell scope="row"> {row.nombre} </TableCell>
                                <TableCell scope="row"> {row.rut} </TableCell>
                                <TableCell scope="row"> {row.labor} </TableCell>
                                <TableCell align="right">{row.present ? <CheckCircleIcon color="success" fontSize="medium"/> : ""}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>




            {/*===========================================================*/}
            {/*================ MODAL ASISTENCIA SELECTION ===============*/}
            {/*===========================================================*/}
            <ModalGrid open={modal}>
                <ModalItem>
                    <div >
                        <DataGrid
                            rowHeight={30}
                            rows={rows}
                            columns={cols}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            checkboxSelection
                            sx={{
                                bgcolor:'white',
                                width:800,
                                height:470
                            }}
                            
                            
                            onSelectionModelChange={(newSelectionModel) => {
                                
                                updateAsistencia(newSelectionModel);
                                setSelectionModel(newSelectionModel);
                                
                                
                            }}
                            selectionModel={selectionModel}
                        />
                    </div>
                </ModalItem>
                <ModalItem>
                    <ButtonGroup>
                        <Button variant='contained' color='success' onClick={()=>setSave(true)}>Guardar</Button>
                        <Button variant='contained' color='error' onClick={()=>setModal(false)}>Cancelar</Button>
                    </ButtonGroup>
                </ModalItem>
            </ModalGrid>
            {/*===========================================================*/}
            {/*================ MODAL ASISTENCIA SELECTION ===============*/}
            {/*===========================================================*/}


        </>
    );
}
