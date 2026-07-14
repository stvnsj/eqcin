import React from "react";
import { facturaConfig } from "../documents/config";
import ViewDocumentByMonth from "../documents/shared/ViewDocumentByMonth";
import facturaDefinition from "./documentDefinition";

export default function ViewFactura() {
  return (
    <ViewDocumentByMonth
      config={facturaConfig}
      definition={facturaDefinition}
    />
  );
}
