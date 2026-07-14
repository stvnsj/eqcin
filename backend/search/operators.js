function escapeLike(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
}

const OPERATOR_COMPILERS = {
  eq: ({ column, value }) => ({
    sql: "?? = ?",
    params: [column, value],
  }),

  neq: ({ column, value }) => ({
    sql: "?? <> ?",
    params: [column, value],
  }),

  gt: ({ column, value }) => ({
    sql: "?? > ?",
    params: [column, value],
  }),

  gte: ({ column, value }) => ({
    sql: "?? >= ?",
    params: [column, value],
  }),

  lt: ({ column, value }) => ({
    sql: "?? < ?",
    params: [column, value],
  }),

  lte: ({ column, value }) => ({
    sql: "?? <= ?",
    params: [column, value],
  }),

  contains: ({ column, value }) => ({
    sql: "?? LIKE ? ESCAPE '\\\\'",
    params: [column, `%${escapeLike(value)}%`],
  }),
};

module.exports = OPERATOR_COMPILERS;
