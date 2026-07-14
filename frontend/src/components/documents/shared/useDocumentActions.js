import { useCallback, useState } from "react";
import axios from "axios";

function buildDeleteTarget(row) {
  return {
    id: row?.id,
    nombre:
      row?.razon_social ??
      row?.nombre ??
      row?.proyecto_nombre ??
      (row?.id != null ? `#${row.id}` : ""),
    valor: row?.valor,
    fecha: row?.fecha,
  };
}

export default function useDocumentActions({ config, refresh }) {
  const [edit, setEdit] = useState(false);
  const [editProps, setEditProps] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({});

  const closeEdit = useCallback(() => {
    setEdit(false);
    setEditProps({});
    setSelectedId(null);
  }, []);

  const openItem = useCallback(
    (row) => {
      if (!row) return;

      setSelectedId(row.id);
      setEditProps(config.buildEditProps(row, refresh));
      setEdit(true);
    },
    [config, refresh]
  );

  const syncSelectedItem = useCallback(
    (rows) => {
      if (selectedId == null) return;

      const selected = (rows ?? []).find(
        (row) => Number(row.id) === Number(selectedId)
      );

      if (!selected) return;

      setEditProps(config.buildEditProps(selected, refresh));
    },
    [selectedId, config, refresh]
  );

  const askDeleteItem = useCallback((row) => {
    if (!row) return;

    setDeleteTarget(buildDeleteTarget(row));
    setDeleteOpen(true);
  }, []);

  const closeDelete = useCallback(() => {
    setDeleteOpen(false);
  }, []);

  const deleteItem = useCallback(async () => {
    if (!deleteTarget?.id) return;

    try {
      await axios.delete(config.deleteEndpoint(deleteTarget.id));
      setDeleteOpen(false);
      await refresh();
    } catch (error) {
      console.error(error);
    }
  }, [config, deleteTarget, refresh]);

  return {
    edit,
    setEdit,
    closeEdit,
    editProps,
    openItem,
    syncSelectedItem,

    deleteOpen,
    deleteTarget,
    askDeleteItem,
    closeDelete,
    deleteItem,
  };
}
