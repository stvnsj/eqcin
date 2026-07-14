import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

import DocumentSpreadsheet from "./DocumentSpreadsheet";
import DocumentActionOverlays from "./DocumentActionOverlays";
import useDocumentActions from "./useDocumentActions";

const SEARCH_URL = "http://localhost:8000/search";
const PROYECTO_DICTIONARY_URL = "http://localhost:8000/proyecto/dictionary";
const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const GROUP_OPTIONS = [
  { value: "AND", label: "Todas deben cumplirse" },
  { value: "OR", label: "Cualquiera puede cumplirse" },
];

const OP_LABELS = {
  contains: "contiene",
  eq: "es igual a",
  neq: "no es igual a",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
};

function toProjectMap(rows) {
  return Object.fromEntries(
    (rows ?? []).map((row) => [Number(row.id), row.nombre])
  );
}

function makeNodeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

function getFieldConfig(fields, fieldName) {
  return fields.find((field) => field.value === fieldName);
}

function getOperatorOptions(fields, fieldName) {
  const field = getFieldConfig(fields, fieldName);
  if (!field) return [];

  return field.operators.map((op) => ({
    value: op,
    label: OP_LABELS[op] ?? op,
  }));
}

function createRule(fields) {
  const firstField = fields[0];

  return {
    id: makeNodeId(),
    kind: "rule",
    field: firstField?.value ?? "",
    op: firstField?.operators?.[0] ?? "eq",
    value: firstField?.type === "boolean" ? true : "",
  };
}

function createGroup(op = "AND") {
  return {
    id: makeNodeId(),
    kind: "group",
    op,
    children: [],
  };
}

function createInitialRoot(fields) {
  return {
    ...createGroup("AND"),
    children: [createRule(fields)],
  };
}

function updateNode(node, nodeId, updater) {
  if (node.id === nodeId) return updater(node);
  if (node.kind !== "group") return node;

  return {
    ...node,
    children: node.children.map((child) => updateNode(child, nodeId, updater)),
  };
}

function removeNode(node, nodeId) {
  if (node.kind !== "group") return node;

  return {
    ...node,
    children: node.children
      .filter((child) => child.id !== nodeId)
      .map((child) => removeNode(child, nodeId)),
  };
}

function addChildToGroup(node, groupId, childToAdd) {
  return updateNode(node, groupId, (current) => {
    if (current.kind !== "group") return current;

    return {
      ...current,
      children: [...current.children, childToAdd],
    };
  });
}

function isEmptyValue(value) {
  if (typeof value === "boolean") return false;
  return String(value ?? "").trim() === "";
}

function coerceValue(value, fieldConfig) {
  if (fieldConfig?.type === "boolean") {
    return value === true || value === 1 || value === "1" || value === "true";
  }

  if (fieldConfig?.type === "int") {
    const n = Number(value);
    return Number.isFinite(n) ? n : value;
  }

  return value;
}

function collectBuilderIssues(node, fields, path = "where") {
  const issues = [];

  if (node.kind === "rule") {
    const fieldConfig = getFieldConfig(fields, node.field);

    if (!fieldConfig) {
      issues.push(`${path}: campo inválido`);
      return issues;
    }

    if (!fieldConfig.operators.includes(node.op)) {
      issues.push(`${path}: operador inválido`);
    }

    if (isEmptyValue(node.value)) {
      issues.push(`${path}: falta valor`);
    }

    return issues;
  }

  if (!Array.isArray(node.children) || node.children.length === 0) {
    issues.push(`${path}: grupo vacío`);
    return issues;
  }

  node.children.forEach((child, index) => {
    issues.push(...collectBuilderIssues(child, fields, `${path}.children[${index}]`));
  });

  return issues;
}

function serializeNode(node, fields) {
  if (node.kind === "rule") {
    const fieldConfig = getFieldConfig(fields, node.field);

    return {
      kind: "rule",
      field: node.field,
      op: node.op,
      value: coerceValue(node.value, fieldConfig),
    };
  }

  return {
    kind: "group",
    op: node.op,
    children: node.children.map((child) => serializeNode(child, fields)),
  };
}

function expressionToText(node, fields) {
  if (node.kind === "rule") {
    const fieldLabel = getFieldConfig(fields, node.field)?.label ?? node.field;
    const opLabel = OP_LABELS[node.op] ?? node.op;
    const rawValue = String(node.value ?? "").trim();
    const renderedValue = rawValue ? `"${rawValue}"` : '"…"';

    return `${fieldLabel} ${opLabel} ${renderedValue}`;
  }

  if (node.children.length === 0) {
    return node.op === "AND" ? "(grupo AND vacío)" : "(grupo OR vacío)";
  }

  const joiner = node.op === "AND" ? " AND " : " OR ";
  return `(${node.children.map((child) => expressionToText(child, fields)).join(joiner)})`;
}

function extractSearchResult(payload) {
  const raw = payload?.data ?? payload ?? {};

  if (Array.isArray(raw)) {
    return {
      rows: raw,
      page: 1,
      pageSize: raw.length || DEFAULT_PAGE_SIZE,
      total: raw.length,
      totalPages: raw.length > 0 ? 1 : 0,
    };
  }

  const rows = Array.isArray(raw.rows) ? raw.rows : [];
  const page = Number(raw.page ?? 1);
  const pageSize = Number(raw.pageSize ?? DEFAULT_PAGE_SIZE);
  const total = Number(raw.total ?? rows.length);
  const totalPages = Number(
    raw.totalPages ?? (total > 0 ? Math.ceil(total / pageSize) : 0)
  );

  return { rows, page, pageSize, total, totalPages };
}

function ValueEditor({ fieldConfig, value, onChange }) {
  if (!fieldConfig) return null;

  if (fieldConfig.type === "boolean") {
    return (
      <TextField
        select
        label="Valor"
        size="small"
        value={value === true || value === 1 || value === "1" ? "1" : "0"}
        onChange={(event) => onChange(event.target.value === "1")}
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="1">Sí</MenuItem>
        <MenuItem value="0">No</MenuItem>
      </TextField>
    );
  }

  if (fieldConfig.type === "date" || fieldConfig.type === "datetime") {
    return (
      <TextField
        label="Valor"
        type="date"
        size="small"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 180 }}
      />
    );
  }

  if (fieldConfig.type === "int") {
    return (
      <TextField
        label="Valor"
        type="number"
        size="small"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        sx={{ minWidth: 160 }}
      />
    );
  }

  return (
    <TextField
      label="Valor"
      size="small"
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
      fullWidth
    />
  );
}

function RuleEditor({ fields, rule, onChange, onDelete }) {
  const fieldConfig = getFieldConfig(fields, rule.field);
  const operatorOptions = getOperatorOptions(fields, rule.field);

  const handleFieldChange = (newField) => {
    const nextFieldConfig = getFieldConfig(fields, newField);
    const nextOperatorOptions = getOperatorOptions(fields, newField);
    const nextOp = nextOperatorOptions.some((option) => option.value === rule.op)
      ? rule.op
      : nextOperatorOptions[0]?.value ?? "eq";

    onChange({
      field: newField,
      op: nextOp,
      value: nextFieldConfig?.type === "boolean" ? true : "",
    });
  };

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: "background.paper" }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
        <TextField
          select
          label="Campo"
          size="small"
          value={rule.field}
          onChange={(event) => handleFieldChange(event.target.value)}
          sx={{ minWidth: 180 }}
        >
          {fields.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Operador"
          size="small"
          value={rule.op}
          onChange={(event) => onChange({ op: event.target.value })}
          sx={{ minWidth: 170 }}
        >
          {operatorOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <ValueEditor
          fieldConfig={fieldConfig}
          value={rule.value}
          onChange={(value) => onChange({ value })}
        />

        <IconButton color="error" onClick={onDelete} aria-label="Borrar filtro">
          <DeleteOutlineIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
}

function GroupEditor({
  fields,
  group,
  depth,
  isRoot,
  onChangeGroupOp,
  onAddRule,
  onAddGroup,
  onDeleteGroup,
  onChangeRule,
  onDeleteRule,
}) {
  const title = group.op === "AND" ? "Todas deben cumplirse" : "Cualquiera puede cumplirse";

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        mt: depth === 0 ? 0 : 1.5,
        borderRadius: 3,
        borderColor: group.op === "AND" ? "divider" : "primary.main",
        bgcolor: depth % 2 === 0 ? "grey.50" : "background.paper",
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ sm: "center" }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <AccountTreeIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={700}>
              {isRoot ? "Búsqueda" : "Grupo"}
            </Typography>
            <Chip size="small" label={title} color={group.op === "AND" ? "default" : "primary"} />
          </Stack>

          <Stack direction="row" spacing={1}>
            <TextField
              select
              label="Lógica"
              size="small"
              value={group.op}
              onChange={(event) => onChangeGroupOp(group.id, event.target.value)}
              sx={{ minWidth: 210 }}
            >
              {GROUP_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {!isRoot ? (
              <IconButton color="error" onClick={() => onDeleteGroup(group.id)} aria-label="Borrar grupo">
                <DeleteOutlineIcon />
              </IconButton>
            ) : null}
          </Stack>
        </Stack>

        <Divider />

        <Stack
          spacing={1.25}
          sx={{
            pl: isRoot ? 0 : 1.5,
            borderLeft: isRoot ? "none" : "2px solid",
            borderColor: "divider",
          }}
        >
          {group.children.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Grupo vacío. Agrega un filtro o un subgrupo.
            </Typography>
          ) : null}

          {group.children.map((child) => {
            if (child.kind === "rule") {
              return (
                <RuleEditor
                  key={child.id}
                  fields={fields}
                  rule={child}
                  onChange={(patch) => onChangeRule(child.id, patch)}
                  onDelete={() => onDeleteRule(child.id)}
                />
              );
            }

            return (
              <GroupEditor
                key={child.id}
                fields={fields}
                group={child}
                depth={depth + 1}
                isRoot={false}
                onChangeGroupOp={onChangeGroupOp}
                onAddRule={onAddRule}
                onAddGroup={onAddGroup}
                onDeleteGroup={onDeleteGroup}
                onChangeRule={onChangeRule}
                onDeleteRule={onDeleteRule}
              />
            );
          })}
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Button startIcon={<AddIcon />} variant="outlined" onClick={() => onAddRule(group.id)}>
            Agregar filtro
          </Button>
          <Button startIcon={<CallSplitIcon />} variant="outlined" onClick={() => onAddGroup(group.id, "AND")}>
            Agregar grupo AND
          </Button>
          <Button startIcon={<CallSplitIcon />} variant="outlined" onClick={() => onAddGroup(group.id, "OR")}>
            Agregar grupo OR
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function SearchDocumentPage({ config, definition }) {
  const fields = definition.searchFields ?? [];

  const [root, setRoot] = useState(() => createInitialRoot(fields));
  const [sortField, setSortField] = useState(
    definition.defaultSort?.field ?? definition.initialSortField ?? "fecha"
  );
  const [sortDirection, setSortDirection] = useState(
    definition.defaultSort?.direction ?? definition.initialSortOrder ?? "desc"
  );
  const [loading, setLoading] = useState(false);
  const [rawRows, setRawRows] = useState([]);
  const [projectMap, setProjectMap] = useState({});
  const [requestError, setRequestError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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

  const builderIssues = useMemo(
    () => collectBuilderIssues(root, fields),
    [root, fields]
  );

  const canBuildSearch = builderIssues.length === 0;

  const prettyExpression = useMemo(
    () => expressionToText(root, fields),
    [root, fields]
  );

  const buildSearchBody = useCallback(
    (targetPage, targetPageSize) => ({
      resource: config.searchResource,
      where: serializeNode(root, fields),
      sort: [
        {
          field: sortField,
          direction: sortDirection,
        },
      ],
      page: targetPage,
      pageSize: targetPageSize,
    }),
    [config.searchResource, root, fields, sortField, sortDirection]
  );

  const runSearch = useCallback(
    async ({ page: nextPage, pageSize: nextPageSize } = {}) => {
      const targetPage = nextPage ?? page;
      const targetPageSize = nextPageSize ?? pageSize;

      if (!canBuildSearch || loading) return;

      setLoading(true);
      setRequestError("");
      setHasSearched(true);

      try {
        const response = await axios.post(
          SEARCH_URL,
          buildSearchBody(targetPage, targetPageSize)
        );

        const result = extractSearchResult(response.data ?? {});

        setRawRows(result.rows);
        setPage(result.page);
        setPageSize(result.pageSize);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error(error);
        setRequestError(
          error?.response?.data?.message ?? "No se pudo realizar la búsqueda"
        );
        setRawRows([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    },
    [buildSearchBody, canBuildSearch, loading, page, pageSize]
  );

  const actions = useDocumentActions({
    config,
    refresh: runSearch,
  });

  const { syncSelectedItem } = actions;

  useEffect(() => {
    syncSelectedItem(rows);
  }, [rows, syncSelectedItem]);

  const handleChangeGroupOp = (groupId, newOp) => {
    setRoot((current) =>
      updateNode(current, groupId, (node) => {
        if (node.kind !== "group") return node;
        return { ...node, op: newOp };
      })
    );
  };

  const handleAddRule = (groupId) => {
    setRoot((current) => addChildToGroup(current, groupId, createRule(fields)));
  };

  const handleAddGroup = (groupId, op) => {
    setRoot((current) => addChildToGroup(current, groupId, createGroup(op)));
  };

  const handleDeleteGroup = (groupId) => {
    setRoot((current) => removeNode(current, groupId));
  };

  const handleChangeRule = (ruleId, patch) => {
    setRoot((current) =>
      updateNode(current, ruleId, (node) => {
        if (node.kind !== "rule") return node;
        return { ...node, ...patch };
      })
    );
  };

  const handleDeleteRule = (ruleId) => {
    setRoot((current) => removeNode(current, ruleId));
  };

  const resetBuilder = () => {
    setRoot(createInitialRoot(fields));
    setRawRows([]);
    setRequestError("");
    setHasSearched(false);
    setPage(1);
    setPageSize(DEFAULT_PAGE_SIZE);
    setTotal(0);
    setTotalPages(0);
  };

  const handlePageChange = (_event, nextPageZeroBased) => {
    const nextPage = nextPageZeroBased + 1;
    setPage(nextPage);
    runSearch({ page: nextPage });
  };

  const handlePageSizeChange = (event) => {
    const nextPageSize = Number(event.target.value);
    setPage(1);
    setPageSize(nextPageSize);
    runSearch({ page: 1, pageSize: nextPageSize });
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" gutterBottom>
        {definition.searchTitle ?? "Buscar documentos"}
      </Typography>

      <GroupEditor
        fields={fields}
        group={root}
        depth={0}
        isRoot={true}
        onChangeGroupOp={handleChangeGroupOp}
        onAddRule={handleAddRule}
        onAddGroup={handleAddGroup}
        onDeleteGroup={handleDeleteGroup}
        onChangeRule={handleChangeRule}
        onDeleteRule={handleDeleteRule}
      />

      <Paper variant="outlined" sx={{ mt: 2, p: 2, borderRadius: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle1" fontWeight={700}>
            Orden y resumen
          </Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
            <TextField
              select
              label="Ordenar por"
              size="small"
              value={sortField}
              onChange={(event) => setSortField(event.target.value)}
              sx={{ minWidth: 220 }}
            >
              {fields.map((field) => (
                <MenuItem key={field.value} value={field.value}>
                  {field.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Dirección"
              size="small"
              value={sortDirection}
              onChange={(event) => setSortDirection(event.target.value)}
              sx={{ minWidth: 170 }}
            >
              <MenuItem value="asc">Ascendente</MenuItem>
              <MenuItem value="desc">Descendente</MenuItem>
            </TextField>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
            {prettyExpression}
          </Typography>

          {!canBuildSearch ? (
            <Stack spacing={0.5}>
              {builderIssues.map((issue) => (
                <Typography key={issue} variant="body2" color="error">
                  {issue}
                </Typography>
              ))}
            </Stack>
          ) : null}
        </Stack>
      </Paper>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => runSearch({ page: 1 })}
          disabled={!canBuildSearch || loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </Button>

        <Button variant="outlined" onClick={resetBuilder} disabled={loading}>
          Limpiar
        </Button>
      </Stack>

      {requestError ? (
        <Paper variant="outlined" sx={{ mt: 2, p: 2, borderRadius: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Error de búsqueda
          </Typography>
          <Typography variant="body2" color="error">
            {requestError}
          </Typography>
        </Paper>
      ) : null}

      <DocumentActionOverlays config={config} actions={actions} />

      <Paper variant="outlined" sx={{ mt: 2, p: 2, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Resultados
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {hasSearched
            ? `Mostrando ${rows.length} de ${total} filas`
            : "Ejecuta una búsqueda para ver resultados."}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Página {total === 0 ? 0 : page} de {totalPages}
        </Typography>

        <DocumentSpreadsheet
          rows={rows}
          columns={definition.columns}
          onView={actions.openItem}
          onDelete={actions.askDeleteItem}
          height={definition.searchHeight ?? 650}
          hotTableProps={definition.hotTableProps ?? {}}
        />

        <TablePagination
          component="div"
          count={total}
          page={Math.max(0, page - 1)}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handlePageSizeChange}
          rowsPerPageOptions={PAGE_SIZE_OPTIONS}
          labelRowsPerPage="Filas por página"
        />
      </Paper>
    </Box>
  );
}
