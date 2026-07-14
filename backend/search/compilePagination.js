function compilePagination(search, resourceConfig) {
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

  const offset = (page - 1) * pageSize;

  return {
    sql: "LIMIT ? OFFSET ?",
    params: [pageSize, offset],
    page,
    pageSize,
    offset,
  };
}

module.exports = compilePagination;
