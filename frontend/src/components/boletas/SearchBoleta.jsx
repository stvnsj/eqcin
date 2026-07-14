import React from "react";
import { boletaConfig } from "../documents/config";
import SearchDocumentPage from "../documents/shared/SearchDocumentPage";
import boletaDefinition from "./documentDefinition";

export default function SearchBoleta() {
  return (
    <SearchDocumentPage
      config={boletaConfig}
      definition={boletaDefinition}
    />
  );
}
