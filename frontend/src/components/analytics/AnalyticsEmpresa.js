
import DateSelector from '../reusable/DateSelector';
import * as React from "react";
import { Button,Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { ReportTable } from './ReportTable';



import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import clpFormat from '../../utils/clpFormat';
import toast from 'react-hot-toast';

import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


export default function AnalyticsEmpresa(props){

    // const [fecha, setFecha] = React.useState(new Date());

    const [fecha1, setFecha1] = React.useState(new Date())
    const [fecha2, setFecha2] = React.useState(new Date())
    const [generate, setGenerate] = React.useState(false)
    const [xport, setXport] = React.useState(false)
    const [data, setData] = React.useState({});
    const [rows, setRows] = React.useState([])
    const [selectedFile,setSelectedFile] = useState(null);
    const [empresaOptions, setEmpresaOptions] = useState([]);
    const [selectedEmpresas, setSelectedEmpresas] = useState([]);
    const [loadingEmpresas, setLoadingEmpresas] = useState(false);
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const empresaIds = selectedEmpresas.map((e) => e.id);

    const cols = [
        {
            field:'d1',
            headerName:'Inicio' ,
            align:'right',
            width:110,
            valueFormatter: (params) => {
                const v = params.value;
                if (!v) return "";
                return new Date(v).toISOString().slice(0, 10); // YYYY-MM-DD
            },
        },
        {
            field:'d2',
            headerName: 'Fin',
            align:'right',
            width:110,
            valueFormatter: (params) => {
                const v = params.value;
                if (!v) return "";
                return new Date(v).toISOString().slice(0, 10); // YYYY-MM-DD
            },
        },


        {
            field:'total_factura',
            headerName: 'Facturas',
            type:'number',
            align:'right',
            width:100
        },
        {
            field:'total_boleta',
            headerName: 'Boletas',
            type:'number',
            align:'right',
            width:100
        },
        {
            field:'total_transfer',
            headerName: 'Transfer.',
            type:'number',
            align:'right',
            width : 100,
        },
        {
            field:'total_documento',
            headerName: 'Documentos',
            type:'number',
            align:'right',
            width:100
        },

        {
            field:'total_contrato',
            headerName: 'Contratos',
            type:'number',
            align:'right',
            width:100
        },
        {
            field:'total_honorario',
            headerName: 'Honorarios',
            type:'number',
            align:'right',
            width:100
        },
        {
            field:'total_finiquito',
            headerName: 'Finiquitos',
            type:'number',
            align:'right'
        },
        {
            field:'total_bono',
            headerName: 'Bonos',
            type:'number',
            align:'right'
        },
        {
            field:'total_descuento',
            headerName: 'Descuentos',
            type:'number',
            align:'right'
        },
        {
            field:'total_personal',
            headerName: 'Personal',
            type:'number',
            align:'right',
            width:100

        },
        {
            field:'total_global',
            headerName: 'Global',
            type:'number',
            align:'right'
        },

        {
            field:'total_ingreso',
            headerName: 'Ingreso',
            type:'number',
            align:'right'
        },



    ]

    useEffect(() => {
    setLoadingEmpresas(true);

    axios
        .get('http://localhost:8000/proyecto/options')
        .then((response) => {
            const options = response.data.data ?? [];
            setEmpresaOptions(options);

            // optional: preselect all
            // setSelectedEmpresas(options);
        })
        .catch((error) => {
            console.error(error);
            toast.error('No se pudieron cargar las empresas');
        })
        .finally(() => {
            setLoadingEmpresas(false);
        });
    }, []);


const handleGenerate = async () => {
    try {
        const dd1 = fecha1.getDate();
        const mm1 = fecha1.getMonth() + 1;
        const yyyy1 = fecha1.getFullYear();
        const myDate1 = `${yyyy1}-${mm1}-${dd1}`;

        const dd2 = fecha2.getDate();
        const mm2 = fecha2.getMonth() + 1;
        const yyyy2 = fecha2.getFullYear();
        const myDate2 = `${yyyy2}-${mm2}-${dd2}`;

        const empresaIds = selectedEmpresas.map((e) => e.id);

        const response = await axios.post('http://localhost:8000/costo/report', {
            fecha1: myDate1,
            fecha2: myDate2,
            empresaIds,
        });

        console.log("FRONT RESPONSE:", response.data);

        const reportRows = response.data.data[3] ?? [];
        const withoutLast = reportRows.slice(0, -1);
        const totalRow = reportRows.at(-1) ?? {};

        setRows(withoutLast.map((r, idx) => ({ ...r, id: idx })));
        setData(totalRow);
    } catch (error) {
        console.error(error);
        toast.error('No se pudo generar el reporte');
    }
};


/* 
    useEffect(()=>{

        if(!xport) return;

        const dd1 = fecha1.getDate();
        const mm1 = fecha1.getMonth()+1;
        const yyyy1 = fecha1.getFullYear();
        const myDate1 = `${yyyy1}-${mm1}-${dd1}`


        const dd2 = fecha2.getDate();
        const mm2 = fecha2.getMonth()+1;
        const yyyy2 = fecha2.getFullYear();
        const myDate2 = `${yyyy2}-${mm2}-${dd2}`
        

        const url =  `http://localhost:8000/costo/reportxlsx/${myDate1}/${myDate2}`;

        const requestOptions = {
        method: 'GET',
        }

        fetch(url,requestOptions)
        .then(response => response.blob())
        .then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = `Analisis_${myDate1}_${myDate2}` + '.xlsx' ;
        a.click();
        });



        setXport(false);

    },[xport])
 */


    useEffect(() => {
    if (!xport) return;

    const exportXlsx = async () => {
        try {
            const myDate1 = [
                fecha1.getFullYear(),
                String(fecha1.getMonth() + 1).padStart(2, "0"),
                String(fecha1.getDate()).padStart(2, "0"),
            ].join("-");

            const myDate2 = [
                fecha2.getFullYear(),
                String(fecha2.getMonth() + 1).padStart(2, "0"),
                String(fecha2.getDate()).padStart(2, "0"),
            ].join("-");

            const empresaIds = selectedEmpresas.map((e) => e.id);

            const response = await fetch("http://localhost:8000/costo/reportxlsx", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fecha1: myDate1,
                    fecha2: myDate2,
                    empresaIds,
                }),
            });

            if (!response.ok) {
                throw new Error("No se pudo exportar el archivo");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Analisis_${myDate1}_${myDate2}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            toast.error("No se pudo exportar el reporte");
        } finally {
            setXport(false);
        }
    };

    exportXlsx();
}, [xport, fecha1, fecha2, selectedEmpresas]);


    useEffect(()=>
    {
        if (generate == false) return;

        handleGenerate();

/*         const dd1 = fecha1.getDate();
        const mm1 = fecha1.getMonth()+1;
        const yyyy1 = fecha1.getFullYear();
        const myDate1 = `${yyyy1}-${mm1}-${dd1}`


        const dd2 = fecha2.getDate();
        const mm2 = fecha2.getMonth()+1;
        const yyyy2 = fecha2.getFullYear();
        const myDate2 = `${yyyy2}-${mm2}-${dd2}`
        
        

        const URL = `http://localhost:8000/costo/report/${myDate1}/${myDate2}`

        axios
        .get(URL)
        .then(response => {

            const withoutLast = response.data.data[0].slice(0, -1);
            const raw = withoutLast ?? [];
            setRows(raw.map((r, idx) => ({ ...r, id: idx })));
            setData(response.data.data[0].at(-1))

        })

        setGenerate(false) */
        setGenerate(false);

    },[generate])
        


  return (

    <div>
        <DateSelector date={fecha1}  setDate={setFecha1}  label={"Inicio Reporte"}/>
        <DateSelector date={fecha2}  setDate={setFecha2}  label={"Fin Reporte"}/>
        <br/>
        <br/>
        <Button variant="contained" onClick={handleGenerate}>
            GENERAR
        </Button>


            <Button variant='contained' onClick={() => {setXport(true)}}>
        Exportar 
        </Button>
        <br/>
        <Paper sx={{ p: 2, mb: 2 }}>
    <Typography variant="h6" sx={{ mb: 1 }}>
        Proyectos
    </Typography>

    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <Button
            variant="outlined"
            size="small"
            onClick={() => setSelectedEmpresas(empresaOptions)}
        >
            Marcar todas
        </Button>

        <Button
            variant="outlined"
            size="small"
            onClick={() => setSelectedEmpresas([])}
        >
            Limpiar
        </Button>
    </Box>

    <Autocomplete
        multiple
        disableCloseOnSelect
        options={empresaOptions}
        value={selectedEmpresas}
        onChange={(event, newValue) => setSelectedEmpresas(newValue)}
        loading={loadingEmpresas}
        getOptionLabel={(option) =>
            option ? `${option.label ?? ''} (${option.id})` : ''
        }
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderOption={(props, option, { selected }) => (
            <li {...props} key={option.id}>
                <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    checked={selected}
                    sx={{ mr: 1 }}
                />
                {option.label} ({option.id})
            </li>
        )}
        renderInput={(params) => (
            <TextField
                {...params}
                label="Seleccionar proyectos"
                placeholder="Buscar proyecto"
            />
        )}
    />
</Paper>
        <br/>
        <Typography variant='h6'>Intervalo Completo</Typography>
        <ReportTable data={data} clpFormat={clpFormat} />
        <br/>
        <br/>

        <br/>
        <Typography variant='h6'>Detalle Mensual</Typography>
        <DataGrid
            //getRowId={(row) => row.categoria_id}
            hideFooter={true}
            pagination={false}
            headerHeight={35}
            rowHeight={30}
            getRowClassName={(params) => {}}
              getCellClassName={(params) =>
                params.field === "total_global" ? "total-col" :
                params.field === "total_documento" ? "sub-total-col" :
                (params.field === "d1" || params.field ==="d2") ? "" :
                params.field === "total_personal" ? "sub-total-col" : "sub-sub-total-col"
            }
            sx={{
                minWidth: "170vh",
                minHeight: "75vh",

                // ✅ borders
                "& .MuiDataGrid-cell": {
                borderRight: "2px solid",
                borderBottom: "2px solid",
                borderColor: "divider",
                },
                "& .MuiDataGrid-columnHeaders": {
                borderBottom: "2px solid",
                borderColor: "divider",
                },
                "& .MuiDataGrid-columnHeader": {
                borderRight: "2px solid",
                borderColor: "divider",
                },

                // (optional) outer border around the whole grid
                border: "2px solid",
                borderColor: "divider",

                // your colors
                "& .total-col": { backgroundColor: "rgba(173, 255, 154, 0.59)" },
                "& .sub-total-col": { backgroundColor: "rgba(172, 209, 224, 1)" },
                "& .sub-sub-total-col": { backgroundColor: "rgba(255, 241, 162, 0.72)" },
            }}
            rows={rows}
            columns={cols} 
        />
    </div>

  );
}

