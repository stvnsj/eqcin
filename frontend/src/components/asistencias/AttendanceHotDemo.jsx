import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import axios from "axios";
import toast from "react-hot-toast";

import MonthSelector from "../reusable/MonthSelector";

import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";


registerAllModules();

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function parseFecha(fecha) {
  const [y, m] = fecha.split("-").map(Number);
  return { year: y, month: m };
}

function monthLabel(year, month) {
  const names = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  return `${names[month - 1]} ${year}`;
}



function weekdayShortEs(year, month, day) {
  const date = new Date(year, month - 1, day);

  const weekday = new Intl.DateTimeFormat("es-CL", {
    weekday: "short",
  })
    .format(date)
    .replace(".", "")
    .slice(0, 3);

  return `${weekday} ${day}`;
}

function employeeToHotRow(employee, totalDays) {
  const row = {
    employeeId: employee.employeeId,
    employeeName: employee.name,
  };

  for (let d = 1; d <= totalDays; d += 1) {
    row[`d${d}`] = "";
  }

  for (const item of employee.attendance ?? []) {
    const day = Number(item.date.slice(8, 10));
    if (day >= 1 && day <= totalDays) {
      row[`d${day}`] = item.present ? "P" : "";
    }
  }

  return row;
}

function toMonthStart(date) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }));
}

function buildAttendanceMap(rows, year, month, totalDays) {
  const map = new Map();

  for (const row of rows) {
    const employeeId = Number(row.employeeId);

    for (let d = 1; d <= totalDays; d += 1) {
      const fecha = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const key = `${employeeId}|${fecha}`;
      map.set(key, row[`d${d}`] === "P");
    }
  }

  return map;
}

function computeAttendanceDiff(originalRows, currentRows, year, month, totalDays) {
  const originalMap = buildAttendanceMap(originalRows, year, month, totalDays);
  const currentMap = buildAttendanceMap(currentRows, year, month, totalDays);

  const nuevas_asistencias = [];
  const asistencias_anuladas = [];

  for (const row of currentRows) {
    const employeeId = Number(row.employeeId);

    for (let d = 1; d <= totalDays; d += 1) {
      const fecha = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const key = `${employeeId}|${fecha}`;

      const originalPresent = originalMap.get(key) ?? false;
      const currentPresent = currentMap.get(key) ?? false;

      if (!originalPresent && currentPresent) {
        nuevas_asistencias.push({
          empleado_id: employeeId,
          fecha,
        });
      } else if (originalPresent && !currentPresent) {
        asistencias_anuladas.push({
          empleado_id: employeeId,
          fecha,
        });
      }
    }
  }

  return { nuevas_asistencias, asistencias_anuladas };
}

export default function AttendanceHotDemo({
  projectId = 35,
  fecha = "2026-01-01",
}) {
  const initialFecha = useMemo(() => new Date(fecha), [fecha]);

  const [projectOptions, setProjectOptions] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(initialFecha);

  const monthStart = useMemo(() => toMonthStart(selectedMonth), [selectedMonth]);
  const { year, month } = useMemo(
    () => parseFecha(monthStart || fecha),
    [monthStart, fecha]
  );
  const totalDays = useMemo(() => daysInMonth(year, month), [year, month]);

  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProjects() {
      setLoadingProjects(true);

      try {
        const response = await axios.get("http://localhost:8000/proyecto/options");
        const options = response.data.data ?? [];

        if (ignore) return;

        setProjectOptions(options);

        const matched = options.find((p) => Number(p.id) === Number(projectId));
        if (matched) {
          setSelectedProyecto(matched);
        } else if (options.length > 0) {
          setSelectedProyecto(options[0]);
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          toast.error("No se pudieron cargar los proyectos");
        }
      } finally {
        if (!ignore) {
          setLoadingProjects(false);
        }
      }
    }

    loadProjects();

    return () => {
      ignore = true;
    };
  }, [projectId]);

  const columns = useMemo(() => {
    const fixed = [
      { data: "employeeId", type: "numeric", readOnly: true },
      { data: "employeeName", type: "text", readOnly: true },
    ];

    const days = Array.from({ length: totalDays }, (_, i) => ({
      data: `d${i + 1}`,
      type: "dropdown",
      source: ["", "P"],
      strict: true,
      allowInvalid: false,
    }));

    return [...fixed, ...days];
  }, [totalDays]);

const colHeaders = useMemo(() => {
  return [
    "ID",
    "Empleado",
    ...Array.from({ length: totalDays }, (_, i) =>
      weekdayShortEs(year, month, i + 1)
    ),
  ];
}, [year, month, totalDays]);

  useEffect(() => {
    let ignore = false;

    async function loadAttendance() {
      if (!selectedProyecto?.id || !monthStart) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://localhost:8000/asistencia/proyecto/${selectedProyecto.id}/fecha/${monthStart}`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();

        if (!json.ok) {
          throw new Error("La respuesta del backend no vino con ok=true");
        }

        const employees = json.data?.employees ?? [];
        const hotRows = employees.map((employee) =>
          employeeToHotRow(employee, totalDays)
        );

        if (!ignore) {
          const cloned = cloneRows(hotRows);
          setData(cloned);
          setOriginalData(cloneRows(cloned));
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setError("No se pudo cargar la asistencia");
          setData([]);
          setOriginalData([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadAttendance();

    return () => {
      ignore = true;
    };
  }, [selectedProyecto, monthStart, totalDays]);

  const pendingDiff = useMemo(() => {
    return computeAttendanceDiff(originalData, data, year, month, totalDays);
  }, [originalData, data, year, month, totalDays]);

  const pendingCount =
    pendingDiff.nuevas_asistencias.length +
    pendingDiff.asistencias_anuladas.length;

  const handleAfterChange = (changes, source) => {
    if (!changes || source === "loadData") return;

    setData((prev) => {
      const next = [...prev];

      for (const [rowIndex, prop, oldValue, newValue] of changes) {
        next[rowIndex] = {
          ...next[rowIndex],
          [prop]: newValue,
        };

        const day = Number(String(prop).replace("d", ""));
        const fullDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        console.log("Cell changed:", {
          projectId: selectedProyecto?.id,
          employeeId: next[rowIndex].employeeId,
          employeeName: next[rowIndex].employeeName,
          field: prop,
          date: fullDate,
          oldValue,
          newValue,
        });
      }

      return next;
    });
  };

  const handleAfterOnCellMouseDown = (event, coords) => {
    const { row, col } = coords;

    if (row < 0 || col < 2) return;

    const dayProp = columns[col]?.data;
    if (!dayProp) return;

    setData((prev) => {
      const next = [...prev];
      const currentValue = next[row][dayProp];

      next[row] = {
        ...next[row],
        [dayProp]: currentValue === "P" ? "" : "P",
      };

      const day = Number(String(dayProp).replace("d", ""));
      const fullDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      console.log("Toggled by click:", {
        projectId: selectedProyecto?.id,
        employeeId: next[row].employeeId,
        employeeName: next[row].employeeName,
        field: dayProp,
        date: fullDate,
        newValue: next[row][dayProp],
      });

      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedProyecto?.id) {
      toast.error("Debes seleccionar un proyecto");
      return;
    }

    const payload = computeAttendanceDiff(originalData, data, year, month, totalDays);
    const totalChanges =
      payload.nuevas_asistencias.length + payload.asistencias_anuladas.length;

    if (totalChanges === 0) {
      toast("No hay cambios por guardar");
      return;
    }

    setSaving(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/asistencia/registro",
        {
          proyecto_id: selectedProyecto.id,
          nuevas_asistencias: payload.nuevas_asistencias,
          asistencias_anuladas: payload.asistencias_anuladas,
        }
      );

      toast.success(
        response.data?.message || `Se registraron ${totalChanges} cambios`
      );

      setOriginalData(cloneRows(data));
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "No se pudo registrar la asistencia"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Asistencia mensual
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ minWidth: 320 }}>
            <Autocomplete
              options={projectOptions}
              value={selectedProyecto}
              onChange={(event, newValue) => setSelectedProyecto(newValue)}
              loading={loadingProjects}
              getOptionLabel={(option) =>
                option ? `${option.label ?? ""} (${option.id})` : ""
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar proyecto"
                  placeholder="Buscar proyecto"
                />
              )}
            />
          </Box>

          <Box sx={{ minWidth: 220 }}>
            <MonthSelector
              fecha={selectedMonth}
              setFecha={setSelectedMonth}
              label="MES"
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={
                saving ||
                loading ||
                !selectedProyecto ||
                pendingCount === 0
              }
            >
              {saving ? "Guardando..." : `Guardar cambios (${pendingCount})`}
            </Button>

            <Typography variant="body2">
              Nuevas: {pendingDiff.nuevas_asistencias.length} | Anuladas:{" "}
              {pendingDiff.asistencias_anuladas.length}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ mb: 1 }}>
        {selectedProyecto
          ? `Proyecto ${selectedProyecto.label} (${selectedProyecto.id})`
          : "Proyecto"}
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        {monthLabel(year, month)}
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <CircularProgress size={20} />
          <Typography>Cargando asistencia...</Typography>
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <HotTable
          data={data}
          columns={columns}
          colHeaders={colHeaders}
          rowHeaders={true}
          width="100%"
          height="420"
          theme="ht-theme-main"
          stretchH="all"
          fixedColumnsStart={2}
          manualColumnResize={true}
          manualRowResize={true}
          rowHeights={32}
          contextMenu={true}
          dropdownMenu={true}
          filters={true}
          columnSorting={true}
          navigableHeaders={true}
          licenseKey="non-commercial-and-evaluation"
          afterChange={handleAfterChange}
          afterOnCellMouseDown={handleAfterOnCellMouseDown}
        />
      )}
    </Box>
  );
}