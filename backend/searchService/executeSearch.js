const compileSearch = require("../search/compileSearch");
const { queryAsync } = require("../services/dbv2");

async function executeSearch(search) {
  const dataQuery = compileSearch(search);
  const countQuery = compileSearch(search, { countOnly: true });

  console.log("DATA SQL:", dataQuery.sql);
  console.log("DATA PARAMS:", dataQuery.params);
  console.log("COUNT SQL:", countQuery.sql);
  console.log("COUNT PARAMS:", countQuery.params);

  const [rows, countRows] = await Promise.all([
    queryAsync(dataQuery.sql, dataQuery.params),
    queryAsync(countQuery.sql, countQuery.params),
  ]);

  const total = Number(countRows?.[0]?.total ?? 0);
  const totalPages = total === 0 ? 0 : Math.ceil(total / dataQuery.pageSize);

  return {
    rows,
    page: dataQuery.page,
    pageSize: dataQuery.pageSize,
    total,
    totalPages,
  };
}

module.exports = executeSearch;
