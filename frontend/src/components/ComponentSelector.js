import Gasto from "./gastos/Gasto"
import Contrato from "./contratos/Contrato"
import Empleado from "./empleados/Empleado"
import Proyecto from "./proyectos/Proyecto"
import Previred from "./previred/Previred"
import Notification from "./Notification"
import { useEffect, useState } from "react"
import Minimo from "./minimos/Minimo"
import Empresa from "./empresa/Empresa"
import Transferencia from "./transferencias/Transferencia"
import Boleta from "./boletas/Boleta"
import Factura from "./facturas/Factura"
import Costo from "./costos/Costo"
import Asistencia from "./asistencias/Asistencia"
import Analytics from "./analytics/Analytics"
import Finiquito from "./finiquitos/Finiquito"
import Sueldo from "./sueldos/Sueldo"
import Social from "./social/Social"
import Banco from "./banco/Banco"
import Ingresos from "./ingresos/Ingresos"
import Maintenance from "./apps/Maintenance"
import { FakeTerminal } from "./terminal/Term"



export default function ComponentSelector(props){

    const OPTIONS = {

        DESCUENTO       : Symbol(),
        ANTICIPO        : Symbol(),
        BONO            : Symbol(),
        TRASLADO        : Symbol(),
    }

    /*======================================================================

        NOTIFICATIONS                 acc

        This state controls the visibility, message 
        handler, and severity of the 
        notification throughout the application  */
    const [notificationProps, setNotificationProps] = useState({
        open:false,
        mssg:"",
        severity:'success'
    })

    const handleClose = (event, reason) => {

        if (reason === 'clickaway') {
          return;
        }
    
        setNotificationProps({
            open:false,
            mssg:notificationProps.mssg,
            severity:notificationProps.severity
        });

    };

    const notify = (str,sev) => {

        setNotificationProps({open:true,mssg:str,severity:sev});
    }



  return(
    <>
      <Notification open={notificationProps.open} handleClose={handleClose} severity={notificationProps.severity} mssg={notificationProps.mssg}/>
      <div style={{

      padding:   14,
      overflowY: 'auto'
    }}>

    {/*<FakeTerminal/>*/}

      </div>
      {
        props.componentOption==props.options.INGRESO    ?  <Ingresos/>:
        props.componentOption==props.options.COSTO      ?  <Costo notify={notify}/>                                               :
        props.componentOption==props.options.EMPRESA    ?  <Empresa notify={notify}/>                                             :
        props.componentOption==props.options.ANALYTICS  ?  <Analytics notify={notify}/>                                           :
        props.componentOption==props.options.PROYECTO   ?  <Proyecto notify={notify}/>                                            :
        props.componentOption==props.options.EMPLEADO   ?  <Empleado notify={notify}/>                                            :
        props.componentOption==props.options.CONTRATO   ?  <Contrato notify={notify}/>                                            :
        props.componentOption==props.options.ASISTENCIA ?  <Asistencia notify={notify}/>                                          :
        props.componentOption==props.options.BONO       ?  <Gasto option={OPTIONS.BONO} options={OPTIONS} notify={notify}/>       : 
        props.componentOption==props.options.TRASLADO   ?  <Gasto option={OPTIONS.TRASLADO} options={OPTIONS} notify={notify}/>   :
        props.componentOption==props.options.ANTICIPO   ?  <Gasto option={OPTIONS.ANTICIPO} options={OPTIONS} notify={notify}/>   :
        props.componentOption==props.options.DESCUENTO  ?  <Gasto option={OPTIONS.DESCUENTO} options={OPTIONS} notify={notify}/>  :
        props.componentOption==props.options.PREVIRED   ?  <Previred/>                                                            :
        props.componentOption==props.options.FINIQUITO  ?  <Finiquito/>                                                           :
        props.componentOption==props.options.BANCO      ?  <Banco/>                                                           :
        props.componentOption==props.options.MINIMO     ?  <Minimo notify={notify}/>                                              :
        props.componentOption==props.options.SUELDO     ?  <Sueldo/>                                                              :
        props.componentOption==props.options.SOCIAL     ?  <Social/> :
        props.componentOption==props.options.MAINTENANCE ? <Maintenance/> :
        props.componentOption==props.options.ANDROID    ? <Maintenance/>                                                      :
        <></>
      }
    </>
  )
}