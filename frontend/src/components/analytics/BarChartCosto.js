



import React, {useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import clpFormat from "../../utils/clpFormat";
import percentFormat from '../../utils/percentFormat';


const RED        = '#ff2020'
const BLUE       = '#001868'
const GREEN      = '#1c7e1c'
const ANGLE      = 15




export default function BarChartCosto({proyectoData}){


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
      width={650}
      height={210}
      data={proyectoData}
      margin={{
        top: 5,
        right: 20,
        left: 20,
        bottom: 5,
      }}
      barSize={30}
    >
      <XAxis type='number' tickFormatter={clpFormat} tick={{fontSize: 12}}/>
      <YAxis type='category' padding={{ left: 20 }} dataKey="nombre" tick={{fontSize: 12}}/>
      <Tooltip formatter={(value) => clpFormat(value)} />
      <CartesianGrid strokeDasharray="3 3" />
      <Bar dataKey="gasto_real" stroke="#000000" strokeWidth={1}  name='Costo Real' fill={RED}  background={{ fill: '#eee' }}>
        <LabelList
          fill='#000000'
          dataKey='gasto_real'
          fontSize={13}
          position='right' 
          formatter={clpFormat}
        />
        <LabelList
          fill='#000000'
          dataKey='gasto_porcentaje'
          fontSize={13}
          angle={ANGLE}
          position='inside' 
          formatter={percentFormat}
        />
      </Bar>
      <Bar dataKey="presupuesto_total" stroke="#000000" strokeWidth={1} name='PPTO Neto' fill={BLUE}  background={{ fill: '#eee' }}>
        <LabelList
          fill='#000000'
          dataKey='presupuesto_total'
          fontWeight={12}
          fontSize={13}
          position='right' 
          formatter={clpFormat}
        />
      </Bar>
      <Bar dataKey="presupuesto_oficial" stroke="#000000" strokeWidth={1} name='PPTO Oficial' fill={GREEN}  background={{ fill: '#eee' }}>
        <LabelList
          fill='#000000'
          dataKey='presupuesto_oficial'
          fontWeight={12}
          fontSize={13}
          position='right' 
          formatter={clpFormat}
        />
      </Bar>
      <Legend layout="horizontal"  align="center" formatter={renderLegend}/>
    </BarChart>

  );
}

