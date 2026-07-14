

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import clpFormat from "../../utils/clpFormat";
import percentFormat from '../../utils/percentFormat';





const RED        = '#ff2020'
const BLUE       = '#001868'
const ANGLE      = 15


export default function BarChartCategory({categoriaData}){





  return (

    <BarChart
     
      layout='vertical'
      width={860}
      height={700}
      data={categoriaData}
      margin={{
        top: 5,
        right: 45,
        left: 60,
        bottom: 5,
      }}
      barSize={25}
    >


      <XAxis type='number' tickFormatter={clpFormat} tick={{fontSize: 13}}/>
      <YAxis type='category'  padding={{ left: 20}} dataKey="categoria_nombre" tick={{fontSize: 10}}/>
      <Tooltip formatter={(value) => clpFormat(value)} />
      <Legend />
      <CartesianGrid strokeDasharray="3 3" />
      <Bar name='Gasto Real' stroke="#000000" strokeWidth={1} dataKey="categoria_total" fill={RED} background={{ fill: '#eee' }} >
        <LabelList
          fill="#000000"
          dataKey='categoria_porcentaje'
          fontSize={13}
          angle={ANGLE}
          position='inside' 
          formatter={(v)=> percentFormat(v)}
        />
        <LabelList
          fill='#001868'
          dataKey='categoria_total'
          fontSize={15} 
          position='right' 
          formatter={(v)=> clpFormat(v)}
        />
      </Bar>
      <Bar name='PPTO Neto' stroke="#000000" strokeWidth={1} dataKey="categoria_presupuesto" fill={BLUE} background={{ fill: '#eee' }}>
        <LabelList
          fill={BLUE}
          dataKey='categoria_presupuesto'
          fontSize={15}
          position='right' 
          formatter={(v)=> clpFormat(v)}
        />
      </Bar>



    </BarChart>
  );
}
