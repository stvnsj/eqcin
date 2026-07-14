
import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import clpFormat from '../../utils/clpFormat';
import { add, format, differenceInCalendarDays, isFuture } from "date-fns";
import { monthNameAbbrev } from '../../data/timeWords';





export default function LineAccumulation({accumData,presupuesto}){


  const dateFormat = (d) => {

    return d.getDate() + '/' + (d.getMonth()+1);
  } 

  const labelDateFormatter = (d) => {

    return d.getDate() + ' ' + monthNameAbbrev[d.getMonth()] + ' ' + d.getFullYear();
  }


  return(



    <LineChart
      isAnimationActive={false}
      width={1050}
      height={400}
      data={accumData}
      margin={{top:5,right:15,left:15,bottom:5,}}
    >
    <CartesianGrid strokeDasharray="3 3" />


    <XAxis
      dataKey="fecha"
      scale="time"
      tickFormatter={dateFormat}
    />

    <YAxis 
      yAxisId="left" 
      type="number" 
      tick={{fontSize: 15}} 
      orientation="left" 
      tickFormatter={clpFormat}
    />

    <YAxis
      domain={[0, presupuesto.oficial + 200000]}
      yAxisId="right" 
      type="number" 
      tick={{fontSize: 15}} 
      orientation="right" 
      tickFormatter={clpFormat}
    />

    <Tooltip formatter={(value) => clpFormat(value)} labelFormatter={labelDateFormatter} />
    <ReferenceLine yAxisId="right" y={presupuesto.presupuesto} stroke="green" label="ESTIMACIÓN"/>

    <Legend />


    {/* Cost Diario */}
    <Line 
      isAnimationActive={false}
      name="Costo Acumulado"
      yAxisId="right" 
      strokeWidth={2} 
      type="monotone" 
      dataKey="total_acumulado" 
      stroke="#4893ff"
      dot={false}
    />


    <Line
      isAnimationActive={false}
      name="Costo Diario"
      yAxisId="left" 
      strokeWidth={2} 
      type="monotone" 
      dataKey="total_diario" 
      stroke="#ff3636"
      dot={false}
    />


    </LineChart>

  )
}

