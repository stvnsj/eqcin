import CreateBoleta from "./CreateBoleta";
import UploadBoleta from "./UploadBoleta";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import ViewBoleta from "./ViewBoleta";
import ExportBoleta from "./ExportBoleta";
import SearchBoleta from "./SearchBoleta";
import BttnGroup from "../reusable/BttnGroup";

const OPTIONS = {
  UPLOAD: Symbol(),
  CREATE: Symbol(),
  VIEW: Symbol(),
  XPORT: Symbol(),
  SEARCH: Symbol(),
  NULL: Symbol(),
};

export default function Boleta(props) {
  const [option, setOption] = useState(null);

  const handleClose = () => {
    setOption(OPTIONS.NULL);
  };

  const buttonProps = [
    { label: "Ver", handler: () => setOption(OPTIONS.VIEW) },
    { label: "Subir", handler: () => setOption(OPTIONS.UPLOAD) },
    { label: "Crear", handler: () => setOption(OPTIONS.CREATE) },
    { label: "Exportar", handler: () => setOption(OPTIONS.XPORT) },
    { label: "Buscar", handler: () => setOption(OPTIONS.SEARCH) },
  ];

  useEffect(() => {}, [option]);

  return (
    <>
      <BttnGroup buttonProps={buttonProps} />

      <br />
      <br />

      {option === OPTIONS.UPLOAD ? (
        <UploadBoleta {...props} />
      ) : option === OPTIONS.CREATE ? (
        <CreateBoleta {...props} handleClose={handleClose} />
      ) : option === OPTIONS.VIEW ? (
        <ViewBoleta />
      ) : option === OPTIONS.XPORT ? (
        <ExportBoleta />
      ) : option === OPTIONS.SEARCH ? (
        <SearchBoleta />
      ) : option === OPTIONS.NULL ? (
        <Typography variant="button">Seleccione una sección</Typography>
      ) : (
        <></>
      )}
    </>
  );
}
