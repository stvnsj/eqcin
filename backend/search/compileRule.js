const OPERATOR_COMPILERS = require("./operators");
const resolveField = require("./resolveField");
const normalizeValue = require("./normalizeValue");

function compileRule(rule, resourceConfig) {
  if (rule.kind !== "rule") {
    throw new Error("Se esperaba un nodo de tipo rule");
  }

  const fieldConfig = resolveField(resourceConfig, rule.field);

  if (!fieldConfig.operators.includes(rule.op)) {
    throw new Error(`Operador no permitido para ${rule.field}: ${rule.op}`);
  }

  const compiler = OPERATOR_COMPILERS[rule.op];

  if (!compiler) {
    throw new Error(`Operador desconocido: ${rule.op}`);
  }

  const normalizedValue = normalizeValue(fieldConfig, rule.value);

  return compiler({
    column: fieldConfig.column,
    value: normalizedValue,
    fieldConfig,
    rule,
  });
}

module.exports = compileRule;
