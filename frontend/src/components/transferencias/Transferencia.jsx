import CreateTransferencia from "./CreateTransferencia";
import UploadTransferencia from "./UploadTransferencia";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import ViewTransferencia from "./ViewTransferencia";
import ExportTransferencia from "./ExportTransferencia";
import SearchTransferencia from "./SearchTransferencia";
import BttnGroup from "../reusable/BttnGroup";

const OPTIONS = {
  UPLOAD: Symbol(),
  CREATE: Symbol(),
  VIEW: Symbol(),
  XPORT: Symbol(),
  SEARCH: Symbol(),
  NULL: Symbol(),
};

export default function Transferencia(props) {
  const [option, setOption] = useState(null);

  const handleClose = () => {
    setOption(OPTIONS.NULL);
  };

  useEffect(() => {}, [option]);

  const buttonProps = [
    { label: "Ver", handler: () => setOption(OPTIONS.VIEW) },
    { label: "Subir", handler: () => setOption(OPTIONS.UPLOAD) },
    { label: "Crear", handler: () => setOption(OPTIONS.CREATE) },
    { label: "Exportar", handler: () => setOption(OPTIONS.XPORT) },
    { label: "Buscar", handler: () => setOption(OPTIONS.SEARCH) },
  ];

  return (
    <>
      <BttnGroup buttonProps={buttonProps} />

      <br />
      <br />

      {option === OPTIONS.UPLOAD ? (
        <UploadTransferencia {...props} />
      ) : option === OPTIONS.CREATE ? (
        <CreateTransferencia {...props} handleClose={handleClose} />
      ) : option === OPTIONS.VIEW ? (
        <ViewTransferencia />
      ) : option === OPTIONS.XPORT ? (
        <ExportTransferencia />
      ) : option === OPTIONS.SEARCH ? (
        <SearchTransferencia />
      ) : option === OPTIONS.NULL ? (
        <Typography variant="button">Seleccione una sección</Typography>
      ) : (
        <></>
      )}
    </>
  );
}
