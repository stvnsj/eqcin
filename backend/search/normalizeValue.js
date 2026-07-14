function normalizeValue(fieldConfig, value) {
    switch (fieldConfig.type) {
    case "int": {
        const n = Number(value);
        if (!Number.isInteger(n)) {
            throw new Error(`Valor inválido para entero: ${value}`);
        }
        return n;
    }

    case "boolean": {
        if (value === true || value === 1 || value === "1") return 1;
        if (value === false || value === 0 || value === "0") return 0;
        throw new Error(`Valor booleano inválido: ${value}`);
    }
        
    case "date": {
        if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            throw new Error(`Fecha inválida: ${value}`);
        }
        return value;
    }
        
    case "datetime": {
        if (typeof value !== "string") {
            throw new Error(`Datetime inválido: ${value}`);
        }
        return value;
    }

    case "string":
        return String(value);

    default:
        return value;
    }
}

module.exports = normalizeValue;
