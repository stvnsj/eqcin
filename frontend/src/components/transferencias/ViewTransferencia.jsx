import React from "react";
import { transferenciaConfig } from "../documents/config";
import ViewDocumentByMonth from "../documents/shared/ViewDocumentByMonth";
import transferenciaDefinition from "./documentDefinition";

export default function ViewTransferencia() {
  return (
    <ViewDocumentByMonth
      config={transferenciaConfig}
      definition={transferenciaDefinition}
    />
  );
}
