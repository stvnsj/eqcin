import React from "react";
import EditCosto from "../../costos/EditCosto";
import AlertDialog from "../../AlertDialog";
import clpFormat from "../../../utils/clpFormat";
import formatDateEs from "../../../utils/formatDateEs";

export default function FacturaActionOverlays({
  edit,
  setEdit,
  editProps,
  deleteOpen,
  deleteTarget,
  closeDelete,
  deleteFactura,
}) {
  return (
    <>
      <AlertDialog
        handleClose={closeDelete}
        content={
          <>
            Confirme que desea borrar la factura a nombre de{" "}
            <b>{deleteTarget?.nombre}</b>
            <br />
            por un monto de <b>{clpFormat(deleteTarget?.valor)}</b>, con fecha{" "}
            <b>{formatDateEs(deleteTarget?.fecha)}</b>
          </>
        }
        open={deleteOpen}
        accept={deleteFactura}
      />

      {edit ? (
        <EditCosto closeEdition={() => setEdit(false)} {...editProps} />
      ) : null}
    </>
  );
}
