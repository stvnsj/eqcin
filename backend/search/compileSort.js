const resolveField = require("./resolveField");

function compileSort(sortArray, resourceConfig) {
  const items = Array.isArray(sortArray) ? sortArray : [];

  if (items.length === 0) {
    return { sql: "", params: [] };
  }

  const parts = [];
  const params = [];

  for (const item of items) {
    const fieldConfig = resolveField(resourceConfig, item.field);

    const direction =
      String(item.direction || "asc").toLowerCase() === "desc"
        ? "DESC"
        : "ASC";

    parts.push(`?? ${direction}`);
    params.push(fieldConfig.column);
  }

  return {
    sql: parts.join(", "),
    params,
  };
}

module.exports = compileSort;
