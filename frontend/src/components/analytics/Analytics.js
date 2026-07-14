import { Button, ButtonGroup, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import BttnGroup from "../reusable/BttnGroup";
import Grd from "../reusable/Grd";
import SelectorProyecto from "./SelectorProyecto";
import AnalyticsEmpresa from "./AnalyticsEmpresa";

const OPTIONS = {
    PROYECTO: Symbol(),
    EMPRESA: Symbol(),
};

export default function Analytics() {
    const [option, setOption] = useState(null);

    const buttonProps = [
        { label: "Proyectos", handler: () => setOption(OPTIONS.PROYECTO) },
        { label: "Empresa", handler: () => setOption(OPTIONS.EMPRESA) },
    ];

    return (
        <Grd>
            <Grd item={true}>
                <Typography variant="h5">Análisis</Typography>
            </Grd>

            <Grd item={true}>
                <BttnGroup buttonProps={buttonProps} />
            </Grd>

            <Grd item={true} xs={12}>
                <Box sx={{ width: "100%" }}>
                    {
                        option === OPTIONS.PROYECTO ? (
                            <SelectorProyecto />
                        ) : option === OPTIONS.EMPRESA ? (
                            <AnalyticsEmpresa />
                        ) : (
                            <Typography>
                                Seleccione una opción
                            </Typography>
                        )
                    }
                </Box>
            </Grd>
        </Grd>
    );
}
