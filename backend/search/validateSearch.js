const RESOURCES = require("./resources");

function validateSearch(search) {
  if (!search || typeof search !== "object" || Array.isArray(search)) {
    throw new Error("El search object es inválido");
  }

  const resourceName = search.resource;
  const resourceConfig = RESOURCES[resourceName];

  if (!resourceConfig) {
    throw new Error(`Recurso no permitido: ${resourceName}`);
  }

  validateWhere(search.where, resourceConfig);
  validateSort(search.sort, resourceConfig);
  validatePagination(search, resourceConfig);

  return resourceConfig;
}

function validateWhere(where, resourceConfig) {
  if (where == null) {
    return;
  }

  if (typeof where !== "object" || Array.isArray(where)) {
    throw new Error("La cláusula where es inválida");
  }

  if (where.kind !== "group") {
    throw new Error("La raíz de where debe ser un grupo");
  }

  validateGroup(where, resourceConfig, true);
}

function validateGroup(group, resourceConfig, isRoot = false) {
  if (group.kind !== "group") {
    throw new Error("Se esperaba un nodo de tipo group");
  }

  if (!["AND", "OR"].includes(group.op)) {
    throw new Error(`Operador lógico no permitido: ${group.op}`);
  }

  if (!Array.isArray(group.children)) {
    throw new Error("group.children debe ser un arreglo");
  }

  if (group.children.length === 0) {
    throw new Error(
      isRoot
        ? "El grupo raíz no puede estar vacío"
        : "Un grupo no puede estar vacío"
    );
  }

  for (const child of group.children) {
    validateNode(child, resourceConfig);
  }
}

function validateRule(rule, resourceConfig) {
  if (rule.kind !== "rule") {
    throw new Error("Se esperaba un nodo de tipo rule");
  }

  if (!rule.field || typeof rule.field !== "string") {
    throw new Error("El field de la regla es inválido");
  }

  const fieldConfig = resourceConfig.fields[rule.field];

  if (!fieldConfig) {
    throw new Error(`Campo no permitido: ${rule.field}`);
  }

  if (!rule.op || typeof rule.op !== "string") {
    throw new Error(`El operador de la regla ${rule.field} es inválido`);
  }

  if (!fieldConfig.operators.includes(rule.op)) {
    throw new Error(`Operador no permitido para ${rule.field}: ${rule.op}`);
  }

  if (rule.value === undefined) {
    throw new Error(`La regla ${rule.field} requiere un value`);
  }
}

function validateNode(node, resourceConfig) {
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    throw new Error("Nodo de búsqueda inválido");
  }

  if (node.kind === "rule") {
    return validateRule(node, resourceConfig);
  }

  if (node.kind === "group") {
    return validateGroup(node, resourceConfig, false);
  }

  throw new Error(`Tipo de nodo desconocido: ${node.kind}`);
}

function validateSort(sort, resourceConfig) {
  if (sort == null) {
    return;
  }

  if (!Array.isArray(sort)) {
    throw new Error("sort debe ser un arreglo");
  }

  for (const item of sort) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error("Elemento de sort inválido");
    }

    if (!item.field || typeof item.field !== "string") {
      throw new Error("Cada elemento de sort debe tener un field válido");
    }

    if (!resourceConfig.fields[item.field]) {
      throw new Error(`Campo no permitido en sort: ${item.field}`);
    }

    if (item.direction != null) {
      const dir = String(item.direction).toLowerCase();
      if (!["asc", "desc"].includes(dir)) {
        throw new Error(`Dirección de sort inválida: ${item.direction}`);
      }
    }
  }
}

function validatePagination(search, resourceConfig) {
  const defaultPageSize = resourceConfig.defaultPageSize ?? 25;
  const maxPageSize = resourceConfig.maxPageSize ?? 100;

  const page = search.page == null ? 1 : Number(search.page);
  const pageSize = search.pageSize == null ? defaultPageSize : Number(search.pageSize);

  if (!Number.isInteger(page) || page < 1) {
    throw new Error("page debe ser un entero mayor o igual a 1");
  }

  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new Error("pageSize debe ser un entero mayor o igual a 1");
  }

  if (pageSize > maxPageSize) {
    throw new Error(`pageSize no puede ser mayor que ${maxPageSize}`);
  }
}

module.exports = validateSearch;
