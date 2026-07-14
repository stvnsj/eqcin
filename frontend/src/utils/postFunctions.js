


export const addEmpleado = (proyecto_id, empleado_id)=>{





  if (empleado_id==null) return;


  var empleado = {

    "proyecto_id":proyecto_id,
    "empleado_id":empleado_id,
  }




  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(empleado)
  }



  fetch('http://localhost:8000/proyecto/addEmpleado',requestOptions)
  .then(response => response.json())




}