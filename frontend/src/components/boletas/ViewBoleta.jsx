import React from "react";
import { boletaConfig } from "../documents/config";
import ViewDocumentByMonth from "../documents/shared/ViewDocumentByMonth";
import boletaDefinition from "./documentDefinition";

export default function ViewBoleta() {
  return (
    <ViewDocumentByMonth
      config={boletaConfig}
      definition={boletaDefinition}
    />
  );
}
