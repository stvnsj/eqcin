import React from "react";
import { facturaConfig } from "../documents/config";
import SearchDocumentPage from "../documents/shared/SearchDocumentPage";
import facturaDefinition from "./documentDefinition";

export default function SearchBuilderDemo() {
  return (
    <SearchDocumentPage
      config={facturaConfig}
      definition={facturaDefinition}
    />
  );
}
