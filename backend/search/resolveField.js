function resolveField(resourceConfig, fieldName) {
  const fieldConfig = resourceConfig.fields[fieldName];

  if (!fieldConfig) {
    throw new Error(`Campo no permitido: ${fieldName}`);
  }

  return fieldConfig;
}

module.exports = resolveField;
