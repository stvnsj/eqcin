import React from "react";
import { transferenciaConfig } from "../documents/config";
import SearchDocumentPage from "../documents/shared/SearchDocumentPage";
import transferenciaDefinition from "./documentDefinition";

export default function SearchTransferencia() {
  return (
    <SearchDocumentPage
      config={transferenciaConfig}
      definition={transferenciaDefinition}
    />
  );
}
