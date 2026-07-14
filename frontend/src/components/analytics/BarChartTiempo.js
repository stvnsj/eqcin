



import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import percentFormat from '../../utils/percentFormat';


const RED        = '#ff2020'
const BLUE       = '#001868'
const GREEN      = '#1c7e1c'
const ANGLE      = 15




export default function BarChartTiempo({proyectoData}){



  const renderLegend = (props) => {

    return (
      <div style={{background:'#eee'}}>
        {props}
      </div>
    );
  }



  return (

    <BarChart
    
      layout='vertical'
      width={600}
      height={200}
      data={proyectoData}
      margin={{
        top: 5,
        right: 20,
        left: 20,
        bottom: 5,
      }}
      barSize={32}
    >
 
      <XAxis type='number' tickFormatter={(n)=>(n + " días")} tick={{fontSize: 12}}/>
      <YAxis type='category' padding={{ left: 20 }} dataKey="nombre" tick={{fontSize: 12}}/>
      <Tooltip formatter={(value) => (value + " días")} />
      <CartesianGrid strokeDasharray="3 3" />

      <Bar 
        dataKey="duracion" 
        name='Duración Real' 
        fill={RED}
        stroke="#000000"
        strokeWidth={1} 
        background={{ fill: '#eee' }}>
        <LabelList
          fill='#000000'
          dataKey='porcentaje_duracion'
          fontSize={13}
          angle={ANGLE}
          position='inside' 
          formatter={(v)=> percentFormat(v)}
        />
        <LabelList
          fill='#000'
          dataKey='duracion'
          fontWeight={23}
          fontSize={13}
          position='right' 
          formatter={(n)=>(n + " días")}
        />
      </Bar>
      <Bar 
        dataKey="tiempo_estimado" 
        name='Duración Estimada' 
        fill={BLUE}  
        stroke="#000000"
        strokeWidth={1} 
        background={{ fill: '#eee' }}>

        <LabelList
          fill='#000'
          dataKey='tiempo_estimado'
          fontWeight={23}
          fontSize={13}
          position='right' 
          formatter={(n)=>(n + " días")}
        />

      </Bar>

      <Bar 
        dataKey="tiempo_oficial" 
        name='Duración Oficial' 
        fill={GREEN}
        stroke="#000000"
        strokeWidth={1} 
        background={{ fill: '#eee' }}>
        <LabelList
          fill='#000'
          dataKey='tiempo_oficial'
          fontWeight={23}
          fontSize={13}
          position='right' 
          formatter={(n)=>(n + " días")}
        />
      </Bar>

      <Legend layout="horizontal"  align="center" formatter={renderLegend}/>

    </BarChart>

  );
}

