import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";

import MonthSelector from "../../reusable/MonthSelector";
import DocumentSpreadsheet from "./DocumentSpreadsheet";
import DocumentActionOverlays from "./DocumentActionOverlays";
import useDocumentActions from "./useDocumentActions";

const PROYECTO_DICTIONARY_URL = "http://localhost:8000/proyecto/dictionary";

function toProjectMap(rows) {
  return Object.fromEntries(
    (rows ?? []).map((row) => [Number(row.id), row.nombre])
  );
}

export default function ViewDocumentByMonth({ config, definition }) {
  const [fecha, setFecha] = useState(new Date());
  const [rawRows, setRawRows] = useState([]);
  const [projectMap, setProjectMap] = useState({});
  const [loading, setLoading] = useState(false);
  const requestSeq = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProjectDictionary() {
      try {
        const response = await axios.get(PROYECTO_DICTIONARY_URL);
        if (!cancelled) {
          setProjectMap(toProjectMap(response.data?.data ?? []));
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadProjectDictionary();

    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    const normalizeRow = definition.normalizeRow ?? ((row) => row);

    return rawRows.map((row) =>
      normalizeRow(row, {
        projectMap,
        categoryMap: definition.categoryMap ?? {},
      })
    );
  }, [rawRows, projectMap, definition]);

  const loadData = useCallback(async () => {
    const requestId = requestSeq.current + 1;
    requestSeq.current = requestId;
    setLoading(true);

    try {
      const url = config.listEndpoint({
        year: fecha.getFullYear(),
        month: fecha.getMonth() + 1,
      });

      const response = await axios.get(url);

      if (requestSeq.current === requestId) {
        setRawRows(response.data?.data ?? []);
      }
    } catch (error) {
      console.error(error);

      if (requestSeq.current === requestId) {
        setRawRows([]);
      }
    } finally {
      if (requestSeq.current === requestId) {
        setLoading(false);
      }
    }
  }, [config, fecha]);

  const actions = useDocumentActions({
    config,
    refresh: loadData,
  });

  const { closeEdit, syncSelectedItem } = actions;

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    syncSelectedItem(rows);
  }, [rows, syncSelectedItem]);

  useEffect(() => {
    closeEdit();
  }, [fecha, closeEdit]);

  return (
    <>
      <MonthSelector
        fecha={fecha}
        setFecha={setFecha}
        label={definition.monthLabel ?? "Mes"}
      />

      <DocumentActionOverlays config={config} actions={actions} />

      <Box sx={{ minHeight: 28, mt: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ visibility: loading ? "visible" : "hidden" }}
        >
          Cargando...
        </Typography>
      </Box>

      <DocumentSpreadsheet
        rows={rows}
        columns={definition.columns}
        onView={actions.openItem}
        onDelete={actions.askDeleteItem}
        height={definition.height ?? 750}
        hotTableProps={definition.hotTableProps ?? {}}
      />
    </>
  );
}
