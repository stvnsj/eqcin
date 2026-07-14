const validateSearch = require("./validateSearch");
const compileNode = require("./compileNode");
const compileSort = require("./compileSort");
const compilePagination = require("./compilePagination");

function compileSearch(search, options = {}) {
  const { countOnly = false } = options;
  const resourceConfig = validateSearch(search);

  const selectClause =
    Array.isArray(resourceConfig.select) && resourceConfig.select.length > 0
      ? resourceConfig.select.join(", ")
      : "*";

  let sql = countOnly
    ? `SELECT COUNT(*) AS total FROM ${resourceConfig.from}`
    : `SELECT ${selectClause} FROM ${resourceConfig.from}`;

  const params = [];

  const whereClause = compileNode(search.where, resourceConfig);

  if (whereClause.sql) {
    sql += ` WHERE ${whereClause.sql}`;
    params.push(...whereClause.params);
  }

  if (!countOnly) {
    const sortInput =
      Array.isArray(search.sort) && search.sort.length > 0
        ? search.sort
        : resourceConfig.defaultSort || [];

    const sortClause = compileSort(sortInput, resourceConfig);

    if (sortClause.sql) {
      sql += ` ORDER BY ${sortClause.sql}`;
      params.push(...sortClause.params);
    }

    const paginationClause = compilePagination(search, resourceConfig);
    sql += ` ${paginationClause.sql}`;
    params.push(...paginationClause.params);

    return {
      sql,
      params,
      page: paginationClause.page,
      pageSize: paginationClause.pageSize,
      offset: paginationClause.offset,
    };
  }

  return { sql, params };
}

module.exports = compileSearch;
