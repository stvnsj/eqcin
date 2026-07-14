import React, { useState } from "react";
import axios from "axios";

function getFilenameFromDisposition(contentDisposition) {
  if (!contentDisposition) return null;

  // filename*=UTF-8''reporte_facturas.xlsx
  let match = contentDisposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (match?.[1]) {
    return decodeURIComponent(match[1]).replace(/["']/g, "");
  }

  // filename="reporte_facturas.xlsx"
  match = contentDisposition.match(/filename\s*=\s*"([^"]+)"/i);
  if (match?.[1]) {
    return match[1];
  }

  // filename=reporte_facturas.xlsx
  match = contentDisposition.match(/filename\s*=\s*([^;]+)/i);
  if (match?.[1]) {
    return match[1].trim().replace(/["']/g, "");
  }

  return null;
}

export default function UploadSII() {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fileA || !fileB) {
      alert("Debes seleccionar ambos archivos.");
      return;
    }

    const formData = new FormData();
    formData.append("facturas_eqc", fileA);
    formData.append("facturas_sii", fileB);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8000/factura/upload-sii",
        formData,
        {
          responseType: "blob",
        }
      );

      const contentType =
        response.headers["content-type"] ||
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      const contentDisposition = response.headers["content-disposition"];
      const filename =
        getFilenameFromDisposition(contentDisposition) ||
        "reporte_facturas.xlsx";

      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      alert("Reporte generado correctamente.");
    } catch (err) {
      try {
        if (err.response?.data instanceof Blob) {
          const text = await err.response.data.text();
          const json = JSON.parse(text);

          console.error(json);
          alert(json.message || "Error al subir archivos.");
          return;
        }
      } catch (parseError) {
        console.error(parseError);
      }

      console.error(err.response?.data || err.message);
      alert("Error al subir archivos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Facturas EQC: </label>
        <input
          type="file"
          onChange={(e) => setFileA(e.target.files[0] || null)}
          disabled={loading}
        />
      </div>

      <div>
        <label>Facturas SII: </label>
        <input
          type="file"
          onChange={(e) => setFileB(e.target.files[0] || null)}
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Procesando..." : "Subir ambos"}
      </button>
    </form>
  );
}