const compileRule = require("./compileRule");

function compileNode(node, resourceConfig) {
  if (!node) {
    return { sql: "", params: [] };
  }

  if (node.kind === "rule") {
    return compileRule(node, resourceConfig);
  }

  if (node.kind === "group") {
    return compileGroup(node, resourceConfig);
  }

  throw new Error(`Tipo de nodo desconocido: ${node.kind}`);
}

function compileGroup(group, resourceConfig) {
  if (!["AND", "OR"].includes(group.op)) {
    throw new Error(`Operador lógico no permitido: ${group.op}`);
  }

  const children = Array.isArray(group.children) ? group.children : [];

  const compiledChildren = children
    .map((child) => compileNode(child, resourceConfig))
    .filter((piece) => piece.sql);

  if (compiledChildren.length === 0) {
    return { sql: "", params: [] };
  }

  const joiner = ` ${group.op} `;
  const sql = `(${compiledChildren.map((piece) => piece.sql).join(joiner)})`;
  const params = compiledChildren.flatMap((piece) => piece.params);

  return { sql, params };
}

module.exports = compileNode;
