// src/components/apps/Maintenance.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Modal,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

/**
 * Read-only explorer for the Android Maintenance exported JSON.
 *
 * Expected files (from Android export):
 * - maintenance_db.json:
 *   {
 *     eqc_database_name: "MAINTENANCE_JSON_DATABASE",
 *     database_date: "YYYY-MM-DD",
 *     database_datetime: <millis>,
 *     vehicle: [{ license, description, maintenance[], review[], report[] }],
 *     equipment: [{ serial, type, brand, description, review[], report[] }]
 *   }
 *
 * - workers_projects.json (optional):
 *   {
 *     eqc_database_name: "EQC_WORKERS_AND_PROJECTS",
 *     project: [{ project_id, project_name }],
 *     worker: [{ worker_id, worker_name }]
 *   }
 */

// --------------------------- helpers ---------------------------
const isIsoDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}/.test(s);

const norm = (s) => String(s ?? "").trim();

function parseIsoDateOrNull(s) {
  if (!isIsoDate(s)) return null;
  const d = new Date(s.slice(0, 10) + "T00:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

function daysBetween(d1, d2) {
  // d2 - d1 in full days (floor)
  const ms = d2.getTime() - d1.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function maxByDate(records, getDateStr) {
  let best = null;
  let bestTime = -Infinity;
  for (const r of records || []) {
    const d = parseIsoDateOrNull(getDateStr(r));
    const t = d ? d.getTime() : -Infinity;
    if (t > bestTime) {
      bestTime = t;
      best = r;
    }
  }
  return best;
}

function safeNum(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x : null;
}

function fmtDate(s) {
  if (!s) return "—";
  if (isIsoDate(s)) return s.slice(0, 10);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toISOString().slice(0, 10);
}

function makeRows(arr, idPrefix = "row") {
  return (arr || []).map((r, i) => ({ id: `${idPrefix}-${i}`, ...r }));
}

function xport_pw() {
  const url = `http://localhost:8000/proyecto/pwdb`;

  const requestOptions = {
    method: "GET",
  };
  const now = new Date();
  const isoDateString = now.toISOString().slice(0, 10);

  fetch(url, requestOptions)
    .then((response) => response.blob())
    .then((blob) => {
      const objUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = `proyectos_trabajadores_mantencion_${isoDateString}.json`;
      a.click();
      window.URL.revokeObjectURL(objUrl);
    });
}

function getCurrentKm(vehicle) {
  // mirrors Android: currentKm = max of max km across maintenance/review/report
  const m = (vehicle.maintenance || []).map((x) => safeNum(x.km)).filter((x) => x != null);
  const r = (vehicle.review || []).map((x) => safeNum(x.km)).filter((x) => x != null);
  const rep = (vehicle.report || []).map((x) => safeNum(x.km)).filter((x) => x != null);
  const all = [...m, ...r, ...rep];
  if (!all.length) return null;
  return Math.max(...all);
}

function lookupName(map, id, fallbackLabel) {
  if (!id) return null;
  return map?.get?.(id) || map?.[id] || `${fallbackLabel} #${id}`;
}

// --------------------------- UI bits ---------------------------
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(1100px, 92vw)",
  maxHeight: "88vh",
  overflow: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

function SectionTitle({ children }) {
  return (
    <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 1 }}>
      {children}
    </Typography>
  );
}

function SmallLine({ label, value }) {
  return (
    <Typography variant="body2" sx={{ opacity: 0.9 }}>
      <b>{label}</b> {value ?? "—"}
    </Typography>
  );
}

// --------------------------- main component ---------------------------
export default function Maintenance() {
  const [maintenanceDb, setMaintenanceDb] = useState(null);
  const [lookups, setLookups] = useState({ projects: {}, workers: {} });

  const [view, setView] = useState("home"); // home | vehicles | equipment
  const [qVehicles, setQVehicles] = useState("");
  const [qEquipment, setQEquipment] = useState("");

  const [openItem, setOpenItem] = useState(null); // { kind: 'vehicle'|'equipment', key: license|serial }
  const [openTab, setOpenTab] = useState(0);

  const onLoadJsonFile = async (file, kind) => {
    const text = await file.text();
    let root;
    try {
      root = JSON.parse(text);
    } catch (e) {
      throw new Error("El archivo no es JSON válido.");
    }

    const dbName = root?.eqc_database_name || "";
    if (kind === "maintenance") {
      if (dbName !== "MAINTENANCE_JSON_DATABASE") {
        throw new Error(`eqc_database_name inválido para mantención: '${dbName}'`);
      }
      // normalize arrays
      const normalized = {
        ...root,
        vehicle: Array.isArray(root.vehicle) ? root.vehicle : [],
        equipment: Array.isArray(root.equipment) ? root.equipment : [],
      };
      setMaintenanceDb(normalized);
      return;
    }

    // NOTE: the UI loader for lookups was removed per your request.
    // Keeping this branch does not harm, and you can re-enable UI later if needed.
    if (kind === "lookups") {
      if (dbName !== "EQC_WORKERS_AND_PROJECTS") {
        throw new Error(`eqc_database_name inválido para workers/projects: '${dbName}'`);
      }
      const projects = {};
      const workers = {};

      (root.project || []).forEach((p) => {
        const id = Number(p.project_id);
        // Android accepts "project_name" and also a buggy "project_name " with trailing space
        const name = String(p.project_name || p["project_name "] || "").trim();
        if (id && name) projects[id] = name;
      });
      (root.worker || []).forEach((w) => {
        const id = Number(w.worker_id);
        const name = String(w.worker_name || "").trim();
        if (id && name) workers[id] = name;
      });

      setLookups({ projects, workers });
      return;
    }
  };

  const vehicles = maintenanceDb?.vehicle || [];
  const equipment = maintenanceDb?.equipment || [];

  // Dynamic items (mirrors Android logic on Home)
  const dynamicHome = useMemo(() => {
    if (!maintenanceDb) return [];

    const today = new Date();

    const vItems = vehicles.map((v) => {
      const lastMaint = maxByDate(v.maintenance, (x) => x.date);
      const lastRev = maxByDate(v.review, (x) => x.date);
      const lastRep = maxByDate(v.report, (x) => x.date);

      const currentKm = getCurrentKm(v);

      const kmSinceLastMaintenance =
        currentKm != null && lastMaint?.km != null ? Math.max(0, currentKm - Number(lastMaint.km || 0)) : null;

      const daysSinceLastReview = (() => {
        const d = parseIsoDateOrNull(lastRev?.date);
        return d ? daysBetween(d, today) : null;
      })();

      const lastProject = lastRep?.project_id
        ? lookupName(lookups.projects, Number(lastRep.project_id), "Proyecto")
        : null;
      const lastWorker = lastRep?.worker_id
        ? lookupName(lookups.workers, Number(lastRep.worker_id), "Trabajador")
        : null;

      return {
        kind: "vehicle",
        key: norm(v.license),
        title: `🚗 ${norm(v.license)}`,
        lines: [
          `Km desde mantención: ${kmSinceLastMaintenance ?? "—"}`,
          `Días desde revisión: ${daysSinceLastReview ?? "—"}`,
          `Último proyecto: ${lastProject ?? "—"}`,
          `Último trabajador: ${lastWorker ?? "—"}`,
        ],
      };
    });

    const eItems = equipment.map((e) => {
      const lastRev = maxByDate(e.review, (x) => x.date);
      const lastRep = maxByDate(e.report, (x) => x.date);

      const daysSinceLastReview = (() => {
        const d = parseIsoDateOrNull(lastRev?.date);
        return d ? daysBetween(d, today) : null;
      })();

      const lastProject = lastRep?.project_id
        ? lookupName(lookups.projects, Number(lastRep.project_id), "Proyecto")
        : null;
      const lastWorker = lastRep?.worker_id
        ? lookupName(lookups.workers, Number(lastRep.worker_id), "Trabajador")
        : null;

      return {
        kind: "equipment",
        key: norm(e.serial),
        title: `🧰 ${norm(e.serial)} (${norm(e.type)})`,
        lines: [
          `Días desde revisión: ${daysSinceLastReview ?? "—"}`,
          `Último proyecto: ${lastProject ?? "—"}`,
          `Último trabajador: ${lastWorker ?? "—"}`,
        ],
      };
    });

    return [...vItems, ...eItems].filter((x) => x.key);
  }, [maintenanceDb, vehicles, equipment, lookups]);

  // Your existing search logic kept (but used only to compute which keys to show)
  const vehiclesFiltered = useMemo(() => {
    const q = qVehicles.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) => {
      const lic = norm(v.license).toLowerCase();
      const desc = norm(v.description).toLowerCase();
      return lic.includes(q) || desc.includes(q);
    });
  }, [vehicles, qVehicles]);

  const equipmentFiltered = useMemo(() => {
    const q = qEquipment.trim().toLowerCase();
    if (!q) return equipment;
    return equipment.filter((e) => {
      const serial = norm(e.serial).toLowerCase();
      const type = norm(e.type).toLowerCase();
      const brand = norm(e.brand).toLowerCase();
      const desc = norm(e.description).toLowerCase();
      return serial.includes(q) || type.includes(q) || brand.includes(q) || desc.includes(q);
    });
  }, [equipment, qEquipment]);

  // ✅ These are the items shown in Autos/Equipos, but they come from dynamicHome (same cards as Home)
  const vehicleKeysFiltered = useMemo(() => {
    return new Set(vehiclesFiltered.map((v) => norm(v.license)));
  }, [vehiclesFiltered]);

  const equipmentKeysFiltered = useMemo(() => {
    return new Set(equipmentFiltered.map((e) => norm(e.serial)));
  }, [equipmentFiltered]);

  const vehicleItems = useMemo(() => {
    return dynamicHome.filter((it) => it.kind === "vehicle" && vehicleKeysFiltered.has(it.key));
  }, [dynamicHome, vehicleKeysFiltered]);

  const equipmentItems = useMemo(() => {
    return dynamicHome.filter((it) => it.kind === "equipment" && equipmentKeysFiltered.has(it.key));
  }, [dynamicHome, equipmentKeysFiltered]);

  const openData = useMemo(() => {
    if (!openItem || !maintenanceDb) return null;
    if (openItem.kind === "vehicle") {
      return vehicles.find((v) => norm(v.license) === openItem.key) || null;
    }
    return equipment.find((e) => norm(e.serial) === openItem.key) || null;
  }, [openItem, maintenanceDb, vehicles, equipment]);

  const headerChips = (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Chip size="small" label={`DB: ${maintenanceDb?.database_date ? maintenanceDb.database_date : "—"}`} variant="outlined" />
      <Chip size="small" label={`Vehículos: ${vehicles.length}`} variant="outlined" onClick={() => setView("vehicles")} />
      <Chip size="small" label={`Equipos: ${equipment.length}`} variant="outlined" onClick={() => setView("equipment")} />
      <Chip
        size="small"
        label={`Lookups: ${Object.keys(lookups.projects).length} proyectos · ${Object.keys(lookups.workers).length} trabajadores`}
        variant="outlined"
      />
    </Stack>
  );

  const topButtons = (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Button size="small" variant={view === "home" ? "contained" : "outlined"} onClick={() => setView("home")}>
        Home
      </Button>
      <Button size="small" variant={view === "vehicles" ? "contained" : "outlined"} onClick={() => setView("vehicles")}>
        Autos
      </Button>
      <Button size="small" variant={view === "equipment" ? "contained" : "outlined"} onClick={() => setView("equipment")}>
        Equipos
      </Button>
    </Stack>
  );

  // ✅ Removed optional loader button, and added Export button wired to xport_pw
  const fileLoaders = (
    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap alignItems="center">
      <Button variant="contained" component="label" size="small">
        Cargar maintenance_db.json
        <input
          hidden
          type="file"
          accept="application/json,.json"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            try {
              await onLoadJsonFile(f, "maintenance");
            } catch (err) {
              alert(err?.message || String(err));
            }
          }}
        />
      </Button>

      <Button variant="outlined" size="small" onClick={xport_pw}>
        Exportar Proyectos y Empleados
      </Button>
    </Stack>
  );

  const DynamicCard = ({ title, lines, onClick }) => (
    <Card variant="outlined">
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Stack spacing={0.5}>
            {lines.map((ln, i) => (
              <Typography key={i} variant="body2" sx={{ opacity: 0.92 }}>
                {ln}
              </Typography>
            ))}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  const openModal = (kind, key) => {
    setOpenItem({ kind, key });
    setOpenTab(0);
  };

  // --------------------------- detail modal tables ---------------------------
  const vehicleMaintCols = [
    { field: "date", headerName: "Fecha", width: 120, valueFormatter: (p) => fmtDate(p.value) },
    { field: "km", headerName: "Km", width: 90, type: "number" },
    { field: "cost", headerName: "Costo", width: 110, type: "number" },
    { field: "note", headerName: "Nota", flex: 1, minWidth: 240 },
  ];
  const vehicleReviewCols = [
    { field: "date", headerName: "Fecha", width: 120, valueFormatter: (p) => fmtDate(p.value) },
    { field: "km", headerName: "Km", width: 90, type: "number" },
    { field: "note", headerName: "Nota", flex: 1, minWidth: 240 },
  ];
  const vehicleReportCols = [
    { field: "date", headerName: "Fecha", width: 120, valueFormatter: (p) => fmtDate(p.value) },
    { field: "km", headerName: "Km", width: 90, type: "number" },
    {
      field: "project_id",
      headerName: "Proyecto",
      width: 220,
      valueGetter: (p) => lookupName(lookups.projects, Number(p.value), "Proyecto") || "—",
    },
    {
      field: "worker_id",
      headerName: "Trabajador",
      width: 220,
      valueGetter: (p) => lookupName(lookups.workers, Number(p.value), "Trabajador") || "—",
    },
    { field: "note", headerName: "Nota", flex: 1, minWidth: 240 },
  ];

  const equipReviewCols = [
    { field: "date", headerName: "Fecha", width: 120, valueFormatter: (p) => fmtDate(p.value) },
    { field: "note", headerName: "Nota", flex: 1, minWidth: 260 },
  ];
  const equipReportCols = [
    { field: "date", headerName: "Fecha", width: 120, valueFormatter: (p) => fmtDate(p.value) },
    {
      field: "project_id",
      headerName: "Proyecto",
      width: 220,
      valueGetter: (p) => lookupName(lookups.projects, Number(p.value), "Proyecto") || "—",
    },
    {
      field: "worker_id",
      headerName: "Trabajador",
      width: 220,
      valueGetter: (p) => lookupName(lookups.workers, Number(p.value), "Trabajador") || "—",
    },
    { field: "note", headerName: "Nota", flex: 1, minWidth: 260 },
  ];

  const renderDetailModal = () => {
    if (!openItem || !openData) return null;

    const isVehicle = openItem.kind === "vehicle";
    const title = isVehicle ? `Vehículo: ${norm(openData.license)}` : `Equipo: ${norm(openData.serial)}`;

    const tabs = isVehicle ? ["Perfil", "Mantenciones", "Revisiones", "Reportes"] : ["Perfil", "Revisiones", "Reportes"];

    // ✅ Show "días desde revisión" and "km desde mantención" (cars only) when you click (in Perfil)
    const today = new Date();
    const lastMaint = isVehicle ? maxByDate(openData.maintenance, (x) => x.date) : null;
    const lastRev = maxByDate(openData.review, (x) => x.date);
    const currentKm = isVehicle ? getCurrentKm(openData) : null;

    const kmSinceLastMaintenance =
      isVehicle && currentKm != null && lastMaint?.km != null
        ? Math.max(0, currentKm - Number(lastMaint.km || 0))
        : null;

    const daysSinceLastReview = (() => {
      const d = parseIsoDateOrNull(lastRev?.date);
      return d ? daysBetween(d, today) : null;
    })();

    return (
      <Modal open={!!openItem} onClose={() => setOpenItem(null)}>
        <Box sx={modalStyle}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {title}
            </Typography>
            <Button size="small" color="error" variant="outlined" onClick={() => setOpenItem(null)}>
              Cerrar
            </Button>
          </Stack>

          <Tabs value={openTab} onChange={(_, v) => setOpenTab(v)} sx={{ mt: 1 }}>
            {tabs.map((t) => (
              <Tab key={t} label={t} />
            ))}
          </Tabs>

          <Divider sx={{ my: 1 }} />

          {/* Perfil */}
          {openTab === 0 && (
            <Box>
              <SectionTitle>Datos</SectionTitle>

              {/* ✅ Requested metrics shown here after click */}
              <Stack spacing={0.5} sx={{ mt: 1, mb: 1 }}>
                {isVehicle ? (
                  <SmallLine label="Km desde última mantención:" value={kmSinceLastMaintenance ?? "—"} />
                ) : null}
                <SmallLine label="Días desde última revisión:" value={daysSinceLastReview ?? "—"} />
              </Stack>

              {isVehicle ? (
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  <SmallLine label="Patente:" value={openData.license || "—"} />
                  <SmallLine label="Descripción:" value={openData.description || "—"} />
                  <SmallLine label="Km actual (calculado):" value={getCurrentKm(openData) ?? "—"} />
                  <SmallLine
                    label="Registros:"
                    value={`M=${(openData.maintenance || []).length} · R=${(openData.review || []).length} · Rep=${
                      (openData.report || []).length
                    }`}
                  />
                </Stack>
              ) : (
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  <SmallLine label="Serial:" value={openData.serial || "—"} />
                  <SmallLine label="Tipo:" value={openData.type || "—"} />
                  <SmallLine label="Marca:" value={openData.brand || "—"} />
                  <SmallLine label="Descripción:" value={openData.description || "—"} />
                  <SmallLine label="Registros:" value={`R=${(openData.review || []).length} · Rep=${(openData.report || []).length}`} />
                </Stack>
              )}

              <SectionTitle>Últimos registros</SectionTitle>
              {isVehicle ? (
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  <SmallLine label="Últ. mantención:" value={fmtDate(maxByDate(openData.maintenance, (x) => x.date)?.date)} />
                  <SmallLine label="Últ. revisión:" value={fmtDate(maxByDate(openData.review, (x) => x.date)?.date)} />
                  <SmallLine label="Últ. reporte:" value={fmtDate(maxByDate(openData.report, (x) => x.date)?.date)} />
                </Stack>
              ) : (
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  <SmallLine label="Últ. revisión:" value={fmtDate(maxByDate(openData.review, (x) => x.date)?.date)} />
                  <SmallLine label="Últ. reporte:" value={fmtDate(maxByDate(openData.report, (x) => x.date)?.date)} />
                </Stack>
              )}
            </Box>
          )}

          {/* Vehicle tables */}
          {isVehicle && openTab === 1 && (
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                Solo lectura.
              </Typography>
              <DataGrid
                autoHeight
                rows={makeRows(openData.maintenance, "maint")}
                columns={vehicleMaintCols}
                hideFooter
                rowHeight={30}
                headerHeight={35}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  "& .MuiDataGrid-cell": { borderBottom: "1px solid", borderColor: "divider" },
                }}
              />
            </Box>
          )}

          {isVehicle && openTab === 2 && (
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                Solo lectura.
              </Typography>
              <DataGrid
                autoHeight
                rows={makeRows(openData.review, "rev")}
                columns={vehicleReviewCols}
                hideFooter
                rowHeight={30}
                headerHeight={35}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  "& .MuiDataGrid-cell": { borderBottom: "1px solid", borderColor: "divider" },
                }}
              />
            </Box>
          )}

          {isVehicle && openTab === 3 && (
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                Solo lectura.
              </Typography>
              <DataGrid
                autoHeight
                rows={makeRows(openData.report, "rep")}
                columns={vehicleReportCols}
                hideFooter
                rowHeight={30}
                headerHeight={35}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  "& .MuiDataGrid-cell": { borderBottom: "1px solid", borderColor: "divider" },
                }}
              />
            </Box>
          )}

          {/* Equipment tables */}
          {!isVehicle && openTab === 1 && (
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                Solo lectura.
              </Typography>
              <DataGrid
                autoHeight
                rows={makeRows(openData.review, "erev")}
                columns={equipReviewCols}
                hideFooter
                rowHeight={30}
                headerHeight={35}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  "& .MuiDataGrid-cell": { borderBottom: "1px solid", borderColor: "divider" },
                }}
              />
            </Box>
          )}

          {!isVehicle && openTab === 2 && (
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                Solo lectura.
              </Typography>
              <DataGrid
                autoHeight
                rows={makeRows(openData.report, "erep")}
                columns={equipReportCols}
                hideFooter
                rowHeight={30}
                headerHeight={35}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  "& .MuiDataGrid-cell": { borderBottom: "1px solid", borderColor: "divider" },
                }}
              />
            </Box>
          )}
        </Box>
      </Modal>
    );
  };

  // --------------------------- screen bodies ---------------------------
  const ScreenHome = () => (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 900 }}>
        Mantencion (visor)
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
        Carga los JSON exportados desde Android. Solo lectura.
      </Typography>

      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {fileLoaders}
        {maintenanceDb ? headerChips : null}
      </Stack>

      <Divider sx={{ my: 2 }} />

      {!maintenanceDb ? (
        <Typography>
          Primero cargue <b>maintenance_db.json</b>.
        </Typography>
      ) : (
        <Box>
          <SectionTitle>Home</SectionTitle>
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
            Resumen “dinámico” (como en Android: km desde última mantención, días desde revisión, último proyecto/trabajador).
          </Typography>

          <Stack spacing={1.2}>
            {dynamicHome.length ? (
              dynamicHome.map((it) => (
                <DynamicCard
                  key={`${it.kind}-${it.key}`}
                  title={it.title}
                  lines={it.lines}
                  onClick={() => openModal(it.kind, it.key)}
                />
              ))
            ) : (
              <Typography>— Sin datos —</Typography>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );

  // ✅ Autos uses the SAME cards as Home (dynamicHome), only filtered by your search
  const ScreenVehicles = () => (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Autos
        </Typography>
        {fileLoaders}
      </Stack>

      {!maintenanceDb ? (
        <Typography sx={{ mt: 2 }}>
          Primero cargue <b>maintenance_db.json</b>.
        </Typography>
      ) : (
        <>
          <Stack spacing={1} sx={{ mt: 2 }}>
            {headerChips}
            <TextField
              size="small"
              fullWidth
              label="Buscar (patente o descripción)"
              value={qVehicles}
              onChange={(e) => setQVehicles(e.target.value)}
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1.2}>
            {vehicleItems.length ? (
              vehicleItems.map((it) => (
                <DynamicCard
                  key={`${it.kind}-${it.key}`}
                  title={it.title}
                  lines={it.lines}
                  onClick={() => openModal(it.kind, it.key)}
                />
              ))
            ) : (
              <Typography>— Sin resultados —</Typography>
            )}
          </Stack>
        </>
      )}
    </Box>
  );

  // ✅ Equipos uses the SAME cards as Home (dynamicHome), only filtered by your search
  const ScreenEquipment = () => (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Equipos
        </Typography>
        {fileLoaders}
      </Stack>

      {!maintenanceDb ? (
        <Typography sx={{ mt: 2 }}>
          Primero cargue <b>maintenance_db.json</b>.
        </Typography>
      ) : (
        <>
          <Stack spacing={1} sx={{ mt: 2 }}>
            {headerChips}
            <TextField
              size="small"
              fullWidth
              label="Buscar (serial / tipo / marca / descripción)"
              value={qEquipment}
              onChange={(e) => setQEquipment(e.target.value)}
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1.2}>
            {equipmentItems.length ? (
              equipmentItems.map((it) => (
                <DynamicCard
                  key={`${it.kind}-${it.key}`}
                  title={it.title}
                  lines={it.lines}
                  onClick={() => openModal(it.kind, it.key)}
                />
              ))
            ) : (
              <Typography>— Sin resultados —</Typography>
            )}
          </Stack>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ maxWidth: "150vh" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        {topButtons}
        <Typography variant="body2" sx={{ opacity: 0.75 }}>
          Visor (solo lectura)
        </Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />

{view === "home" ? ScreenHome() : view === "vehicles" ? ScreenVehicles() : ScreenEquipment()}

      {renderDetailModal()}
    </Box>
  );
}
