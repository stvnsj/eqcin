import React from "react";
import EditCosto from "../../costos/EditCosto";
import AlertDialog from "../../AlertDialog";
import clpFormat from "../../../utils/clpFormat";
import formatDateEs from "../../../utils/formatDateEs";

export default function DocumentActionOverlays({ config, actions }) {
  const dialogContent = config.deleteDialogText ? (
    config.deleteDialogText(actions.deleteTarget, clpFormat, formatDateEs)
  ) : (
    <>Confirme que desea borrar este documento.</>
  );

  return (
    <>
      <AlertDialog
        handleClose={actions.closeDelete}
        content={dialogContent}
        open={actions.deleteOpen}
        accept={actions.deleteItem}
      />

      {actions.edit ? (
        <EditCosto
          closeEdition={actions.closeEdit ?? (() => actions.setEdit(false))}
          {...actions.editProps}
        />
      ) : null}
    </>
  );
}
