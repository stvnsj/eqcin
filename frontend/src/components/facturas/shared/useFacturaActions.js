import { useCallback, useState } from "react";
import axios from "axios";

function makeEditProps(factura, refresh) {
  return {
    getData: refresh,
    documento: "facturas",
    id: factura.id,
    nombre: factura.razon_social,
    rut: factura.rut,
    serie: factura.folio,
    fecha: factura.fecha,
    valor: factura.valor,
    proyecto_id: factura.proyecto_id,
    categoria_id: factura.categoria_id,
    proyecto_nombre: factura.proyecto_nombre,
    categoria: factura.categoria,
    comentario: factura.comentario,
  };
}

export default function useFacturaActions(refresh) {
  const [edit, setEdit] = useState(false);
  const [editProps, setEditProps] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({});

  const openFactura = useCallback(
    (factura) => {
      if (!factura) return;
      setSelectedId(factura.id);
      setEditProps(makeEditProps(factura, refresh));
      setEdit(true);
    },
    [refresh]
  );

  const syncSelectedFactura = useCallback(
    (rows) => {
      if (selectedId == null) return;
      const selected = rows.find((row) => Number(row.id) === Number(selectedId));
      if (!selected) return;
      setEditProps(makeEditProps(selected, refresh));
    },
    [selectedId, refresh]
  );

  const askDeleteFactura = useCallback((factura) => {
    if (!factura) return;

    setDeleteTarget({
      id: factura.id,
      nombre: factura.razon_social,
      valor: factura.valor,
      fecha: factura.fecha,
    });

    setDeleteOpen(true);
  }, []);

  const closeDelete = useCallback(() => {
    setDeleteOpen(false);
  }, []);

  const deleteFactura = useCallback(async () => {
    if (!deleteTarget?.id) return;

    await axios.delete(
      `http://localhost:8000/costo/delete/facturas/${deleteTarget.id}`
    );

    setDeleteOpen(false);
    refresh?.();
  }, [deleteTarget, refresh]);

  return {
    edit,
    setEdit,
    editProps,
    deleteOpen,
    deleteTarget,
    openFactura,
    askDeleteFactura,
    closeDelete,
    deleteFactura,
    syncSelectedFactura,
  };
}
