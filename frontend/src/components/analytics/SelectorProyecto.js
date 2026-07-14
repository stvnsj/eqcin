import * as React from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import { ThemeProvider } from "@mui/material/styles";

import { theme } from "../../utils/themes";
import YearSelector from "../reusable/YearSelector";
import AnalyticsProyecto from "./AnalyticsProyecto";

export default function SelectorProyecto() {
    const [year, setYear] = React.useState(new Date());

    const [proyectoOptions, setProyectoOptions] = React.useState([]);
    const [selectedProyecto, setSelectedProyecto] = React.useState(null);
    const [loadingProyectos, setLoadingProyectos] = React.useState(false);

    const [proyectoID, setProyectoID] = React.useState(null);
    const [open, setOpen] = React.useState(false);

    const openProyecto = (proyecto) => {
        if (!proyecto) {
            setProyectoID(null);
            setOpen(false);
            return;
        }

        setProyectoID(proyecto.id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDownloadResumenAnual = async () => {
        try {
            const anno = year.getFullYear();

            const response = await fetch(
                `http://localhost:8000/analytics/resumen-anual/${anno}`
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `resumen_anual_${anno}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("No se pudo descargar el archivo:", err);
        }
    };

    React.useEffect(() => {
        setLoadingProyectos(true);

        fetch("http://localhost:8000/proyecto/options")
            .then((res) => res.json())
            .then((json) => {
                setProyectoOptions(json.data ?? []);
            })
            .catch((err) => {
                console.error("No se pudieron cargar los proyectos:", err);
            })
            .finally(() => {
                setLoadingProyectos(false);
            });
    }, []);

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "none",
                boxSizing: "border-box",
            }}
        >
            <YearSelector fecha={year} setFecha={setYear} label="Año Resumen" />

            <br />

            <ThemeProvider theme={theme}>
                <Button
                    variant="contained"
                    color="green"
                    onClick={handleDownloadResumenAnual}
                >
                    Descargar resumen anual
                </Button>
            </ThemeProvider>

            <br />
            <br />

            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    width: "100%",
                    maxWidth: "none",
                    boxSizing: "border-box",
                }}
            >
                <Typography variant="body1" sx={{ mb: 1 }}>
                    <b>PROYECTO</b>
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <Autocomplete
                        sx={{
                            flex: 1,
                            minWidth: 0,
                        }}
                        options={proyectoOptions}
                        value={selectedProyecto}
                        loading={loadingProyectos}
                        onChange={(event, newValue) => {
                            setSelectedProyecto(newValue);
                            openProyecto(newValue);
                        }}
                        getOptionLabel={(option) =>
                            option ? `${option.label ?? ""} (${option.id})` : ""
                        }
                        isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label="Seleccionar proyecto"
                                placeholder="Buscar proyecto"
                            />
                        )}
                    />

                    <Button
                        variant="outlined"
                        color="error"
                        disabled={!selectedProyecto}
                        sx={{ flexShrink: 0 }}
                        onClick={() => {
                            setSelectedProyecto(null);
                            setProyectoID(null);
                            setOpen(false);
                        }}
                    >
                        Limpiar
                    </Button>
                </Box>

                {selectedProyecto && !open ? (
                    <Box sx={{ mt: 2 }}>
                        <ThemeProvider theme={theme}>
                            <Button
                                variant="contained"
                                color="green"
                                onClick={() => openProyecto(selectedProyecto)}
                            >
                                Abrir análisis
                            </Button>
                        </ThemeProvider>
                    </Box>
                ) : null}
            </Paper>

            {open && proyectoID ? (
                <AnalyticsProyecto
                    handleClose={handleClose}
                    proyecto_id={proyectoID}
                />
            ) : (
                <Typography variant="body2" color="text.secondary">
                    Seleccione un proyecto para ver su análisis.
                </Typography>
            )}
        </Box>
    );
}
