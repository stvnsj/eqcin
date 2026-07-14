



import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import clpFormat from '../../utils/clpFormat';
import { Button, Typography } from '@mui/material';
import BttnGroup from '../reusable/BttnGroup';
import MonthSelector from '../reusable/MonthSelector';



const cols = [                                                             

  {field:'id',headerName:'ID',width:50},
  {field:'nombre',headerName:'Nombre',width:240},
  {field:'dt',headerName:'DT',width:50},
  {field:'mensual',headerName:'Pactado (M)',width:145,  valueFormatter: (params) => clpFormat(params.value)},
  {field:'total_bonos',headerName:'Bonos (B)',width:130,  valueFormatter: (params) => clpFormat(params.value)},
  {field:'total_descuentos',headerName:'Descuentos (D)',width:130,  valueFormatter: (params) => clpFormat(params.value)},
  {field:'liquido',headerName:'Líquido (M+B-D)', width:130,  valueFormatter: (params) => clpFormat(params.value)},
  {field:'total_anticipos',headerName:'Anticipos (A)',width:130,  valueFormatter: (params) => clpFormat(params.value)},
  {field:'saldo',headerName:'Saldo (M+B-D-A)', width:130,  valueFormatter: (params) => clpFormat(params.value)},
]


export default function AbridgedPrevired(props){


  /*  STATE VARIABLES  */


  const [formalRows, setFormalRows]         = React.useState([]);
  const [informalRows, setInformalRows]     = React.useState([])
  const [xport, setXport]                   = React.useState(false);
  const [fecha, setFecha]                   = React.useState(new Date());



  const rowBuilder = (q) => {

    let f_rows  = [];
    let if_rows = [];
    let myRows  = [];
    



    q.forEach(function(empleado){

        const show = empleado.DT || empleado.liquido || empleado.finiquito_fecha;

        if (empleado.formal && show)
            f_rows.push({
                id:                empleado.empleado_id,
                nombre:            empleado.nombre,
                rut:               empleado.rut,
                dt:                empleado.DT,
                saldo:             empleado.saldo,
                liquido:           empleado.liquido,
                total_anticipos:   empleado.total_anticipos,
                mensual:           empleado.sueldo_mensual,
                total_bonos:       empleado.total_bonos,
                total_descuentos:  empleado.total_descuentos
            });


        else if(show)
            if_rows.push({
                id:                empleado.empleado_id,
                nombre:            empleado.nombre,
                rut:               empleado.rut,
                dt:                empleado.DT,
                saldo:             empleado.saldo,
                liquido:           empleado.liquido,
                total_anticipos:   empleado.total_anticipos,
                mensual:           empleado.sueldo_mensual,
                total_bonos:       empleado.total_bonos,
                total_descuentos:  empleado.total_descuentos
            });

    })

  
    setFormalRows(f_rows);
    setInformalRows(if_rows);


    return q;
  }





    /* Executed at component rendering */
    React.useEffect(()=>{

        const year   = fecha.getFullYear();
        const month  = fecha.getMonth() + 1;

        const URL = `http://localhost:8000/previred/abridged/${year}/${month}`;

        const requestOptions = {
            method: 'GET',
        }

        fetch(URL,requestOptions)
            .then((res)=>res.json())
            .then((json)=>{

                rowBuilder(json.data[0]);
            })

    }, [fecha]);





  React.useEffect(()=>{

      if(!xport) return;

      const year = fecha.getFullYear();
      const month = fecha.getMonth()+1;

      const url = `http://localhost:8000/previredFile/abridged/${year}/${month}`;

      const requestOptions = {
          method: 'GET',
      }

      fetch(url,requestOptions)
          .then(response => response.blob())
          .then(blob => {

              let url = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.href = url;
              a.download = 'Previred ' + new Date().getTime().toString()  + '.xlsx' ;
              a.click();

          });
      
      setXport(false);
      
  },[xport])


  return(


    <>      
    
      <MonthSelector fecha={fecha} setFecha={setFecha} label={'Mes Previred'}/>
      
      <br/><br/>

      <Button variant='outlined' onClick={()=>setXport(true)}>EXPORTAR</Button>
      
      <br/><br/>   
      
      <Typography variant='body2'>
        Empleados <b>Contratados</b> 
      </Typography>

      <div style={{ height: 500, width: '100%' }}>

          <DataGrid
                            rowHeight={30}
        rows={formalRows}
        columns={cols}
        pageSize={20}
        rowsPerPageOptions={[20]}
      />

      </div>


      <br/><br/>
      <Typography variant='body2'>Empleados a <b>Honorarios</b></Typography>
      <div style={{ height: 500, width: '100%' }}>
          <DataGrid
              rowHeight={30}
          rows={informalRows}
          columns={cols}
          pageSize={20}
          rowsPerPageOptions={[20]}
        />
      </div>
    </>
  )
}
