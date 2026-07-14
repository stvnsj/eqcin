import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const tableSx = {
  width: "100%",
  tableLayout: "fixed",
  "& .MuiTableCell-root": {
    //border: "1px solid",
    //borderColor: "divider",
    px: 1.5,
    py: 0.75,
  },
  "& .MuiTableHead-root .MuiTableCell-root": {
    fontWeight: 700,
    bgcolor: "grey.100",
  },
};

const fmtDate = (v) => {
  if (!v) return "";
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);

  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const fmtPercent = (v) => {
  if (v === null || v === undefined || v === "") return "";
  const n = Number(v);
  if (Number.isNaN(n)) return "";
  return `${n.toFixed(2)} %`;
};




export function ReportTable({ data, clpFormat }) {
  const rows = [
    { 
      label: "Inicio", value: fmtDate(data?.d1), 
      labelSx: { bgcolor: "rgb(210, 250, 255)" , borderLeft : "2px solid grey",
        borderTop : "2px solid grey"
      },
      valueSx: { bgcolor: "rgb(210, 250, 255)", px: 78 ,borderRight : "2px solid grey",
        borderTop : "2px solid grey"
      },
      raw: true,
    },
    { 
      label: "Fin", value: fmtDate(data?.d2), 
      labelSx: { bgcolor: "rgb(210, 250, 255)", 
        borderLeft : "2px solid grey",
        borderBottom : "2px solid grey",
    },
      valueSx: { bgcolor: "rgb(210, 250, 255)", pr: 3 ,
        borderRight : "2px solid grey",
        borderBottom : "2px solid grey",
    },
      raw: true,
    },
    { label: "Total Facturas", value: data?.total_factura , labelSx : {bgcolor: "rgb(250, 255, 163)", borderLeft : "2px solid grey"}, valueSx : {bgcolor: "rgb(250, 255, 163)",borderRight: "2px solid grey"}},
    { label: "Total Boletas", value: data?.total_boleta , labelSx : {bgcolor: "rgb(250, 255, 163)",borderLeft : "2px solid grey"}, valueSx : {bgcolor: "rgb(250, 255, 163)",borderRight: "2px solid grey"}},
    { label: "Total Transferencias", value: data?.total_transfer , labelSx : {bgcolor: "rgb(250, 255, 163)",borderLeft : "2px solid grey"}, valueSx : {bgcolor: "rgb(250, 255, 163)",borderRight: "2px solid grey"}},
    {
      label: "Total Documentos",
      value: data?.total_documento,
      labelSx: { fontWeight: 800, bgcolor: "rgb(255, 202, 137)" ,borderLeft : "2px solid grey",borderBottom:"2px solid grey"},
      valueSx: { fontWeight: 800, bgcolor: "rgb(255, 202, 137)", pr: 3, borderRight : "2px solid grey", borderBottom : "2px solid grey"},
    },
    { label: "Contratos", value: data?.total_contrato , labelSx : {bgcolor: "rgb(250, 255, 163)",borderLeft : "2px solid grey"},valueSx:{bgcolor: "rgb(250, 255, 163)",borderRight : "2px solid grey"}},
    { label: "Honorarios", value: data?.total_honorario , labelSx : {bgcolor: "rgb(250, 255, 163)",borderLeft : "2px solid grey"},valueSx:{bgcolor: "rgb(250, 255, 163)",borderRight : "2px solid grey"}},
    { label: "Bonos", value: data?.total_bono , labelSx : {bgcolor: "rgb(250, 255, 163)",borderLeft : "2px solid grey"},valueSx:{bgcolor: "rgb(250, 255, 163)",borderRight : "2px solid grey"}},
    { label: "Descuentos", value: data?.total_descuento , labelSx : {bgcolor: "rgb(250, 255, 163)",borderLeft : "2px solid grey"},valueSx:{bgcolor: "rgb(250, 255, 163)",borderRight : "2px solid grey"}},
    { label: "Finiquitos", value: data?.total_finiquito , labelSx : {bgcolor: "rgb(250, 255, 163)",borderLeft : "2px solid grey"},valueSx:{bgcolor: "rgb(250, 255, 163)",borderRight : "2px solid grey"}},
    {
      label: "Personal",
      value: data?.total_personal,
      labelSx: { fontWeight: 800, bgcolor: "rgb(255, 202, 137)", borderLeft : "2px solid grey", borderBottom : "2px solid grey" },
      valueSx: { fontWeight: 800, bgcolor: "rgb(255, 202, 137)", pr: 3 , borderRight : "2px solid grey", borderBottom : "2px solid grey"},
    },
    {
      label: "Total Gastos",
      value: data?.total_global,
      labelSx: { bgcolor: "rgb(228, 144, 138)",fontWeight: 800, borderLeft : "2px solid grey", borderBottom : "2px solid grey"},
      valueSx: { bgcolor: "rgb(228, 144, 138)", fontWeight: 900,  pr: 3, borderRight : "2px solid grey", borderBottom : "2px solid grey" },
    },
    {
      label: "Ingresos",
      value: data?.total_ingreso,
      labelSx: { fontWeight: 800, bgcolor: "rgb(209, 255, 166)",borderLeft : "2px solid grey" },
      valueSx: { fontWeight: 900, bgcolor: "rgb(209, 255, 166)", pr: 3, borderRight : "2px solid grey" },
    },
    {
      label: "Utilidad",
      value: data?.utilidad,
      labelSx: { fontWeight: 800, bgcolor: "rgb(209, 255, 166)",borderLeft : "2px solid grey" },
      valueSx: { fontWeight: 900, bgcolor: "rgb(209, 255, 166)", pr: 3, borderRight : "2px solid grey" },
    },
    {
      label: "Margen",
      value: data?.margen,
      percent: true,
      labelSx: { fontWeight: 800, bgcolor: "rgb(209, 255, 166)",borderLeft : "2px solid grey", borderBottom : "2px solid grey"},
      valueSx: { fontWeight: 900, bgcolor: "rgb(209, 255, 166)", pr: 3, borderRight : "2px solid grey", borderBottom: "2px solid grey" },
    },
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
      <TableContainer component={Paper} sx={{ width: 520, maxWidth: "100%" }}>
        <Table size="small" sx={tableSx}>
          <TableHead>
            <TableRow>
              <TableCell align="right" sx={{ width: "50%" }}>
                Campo
              </TableCell>
              <TableCell align="right" sx={{ width: "50%" }}>
                Valor
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.label}>
                <TableCell align="right" sx={r.labelSx}>
                  {r.label}
                </TableCell>
                <TableCell align="right" sx={r.valueSx}>
                  {r.raw
                    ? r.value
                    : r.percent
                    ? fmtPercent(r.value)
                    : clpFormat(r.value)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}