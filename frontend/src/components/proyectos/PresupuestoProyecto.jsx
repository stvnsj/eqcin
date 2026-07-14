

import {useEffect, useState} from 'react';
import axios from 'axios';
import statusPOST from '../../utils/statusPOST';
import sqlErrorSplitter from '../../utils/sqlErrorSplitter';
import Alrt from '../reusable/Alrt';
import Grd from '../reusable/Grd';
import Ntfy from '../reusable/Ntfy';
import clpFormat from '../../utils/clpFormat';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';



const cols = [

  {
    field:'nombre',
    headerName:'Categoría',
    type:'string',
    align:'left',
    flex:1,
  },

  {
    field:'valor',
    headerName:'Presupuesto',
    type:'number',
    align:'right',
    flex: 1,
    valueFormatter: params => clpFormat(params?.value)
  },
]





export default function PresupuestoProyecto(props){

  const [selectedFile,setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);


  const [ppto, setPpto] = useState(false);








  /* ========= Ntfy component variables and functions ========= */
  const [ntfyProps, setNtfyProps] = useState({open:false,content:'',severity:"success"});
  const notify    = (content, severity) => setNtfyProps({open: true, content:content, severity:severity})
  const dinotify  = () => setNtfyProps({...ntfyProps, open: false})
  /* ========================================================== */  



  const onFileChange = event => {

    setSelectedFile(event.target.files[0]);
  }

  let input = document.getElementById('xxx')



  const getPresupuesto = async (_proyecto_id) => {

    axios.get(`http://localhost:8000/proyecto/presupuesto/get/${_proyecto_id}`)
    .then(response => {
      
      console.log(response.data.data.length);

      if(response.data.data.length > 1) {
        setPpto(true);
        setRows(response.data.data);
      }
      else{
        setPpto(false)
      }
    
    });
  }



  useEffect(()=>{

    getPresupuesto(props.proyectoID);

  },[])






  const onFileUpload = async () => {

    if(!selectedFile) return;

    const formData = new FormData();

    formData.append(
      "avatar",
      selectedFile,
      selectedFile.name,
    );

    formData.append(
      'proyecto_id',
      props.proyectoID
    )


    await axios.post('http://localhost:8000/proyecto/presupuesto/upload',formData)
    .then(response => statusPOST(response))
    .then(reponse => {

      notify("Presupuesto ingresado exitosamente",'success')
      input.value='';
      setSelectedFile(null);

      setError(null);
    })
    .catch((err) =>{

      setError(err.response.data.message)
      notify(err.response.status + ": Planilla no se pudo ingresar",'error')

    });
    getPresupuesto(props.proyecto)
  }



      return(
    <>
      <Ntfy {...ntfyProps} close={dinotify}/>
      <Grd>


        
        {
          error ?
          <Grd item={true}>
              <Alrt severity={'error'}>
                  {sqlErrorSplitter(error)}
              </Alrt>
          </Grd>
          : <></>
        }

        <Grd item={true}>               
            <input type="file" onChange={onFileChange} id='xxx' />
        </Grd>

        <Grd item={true}>
          <button onClick={onFileUpload}>
              Upload!
          </button>
        </Grd>

        <Grd item={true} marginTop={15}>
          {
            ppto ?
            
            <>
              <Typography>
                Presupuesto Neto
              </Typography>            
              <DataGrid
                getRowId={(row) => row.nombre}
                hideFooter={true}
                pagination={false}
                headerHeight={35}
                rowHeight={30}
                sx={{minWidth:'80vh', minHeight:'70vh'}}
                rows={rows}
                columns={cols}
              />
            </> :

            <Typography>
              No se ha cargado un presupuesto neto.
            </Typography>
          }  

        </Grd>
      </Grd>   
    </>
  )
}
