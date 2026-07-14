import clpFormat from "../../../utils/clpFormat";
import formatDateEs from "../../../utils/formatDateEs";

function resetCell(td) {
  td.innerHTML = "";
  td.style.fontWeight = "normal";
  td.style.cursor = "default";
  td.style.color = "";
  td.style.background = "";
  td.style.textAlign = "left";
}

export function makeActionRenderer({ color, background }) {
  return function actionRenderer(instance, td, row, col, prop, value) {
    resetCell(td);
    td.textContent = value ?? "";
    td.style.textAlign = "center";
    td.style.fontWeight = "700";
    td.style.cursor = "pointer";
    td.style.color = color;
    td.style.background = background;
  };
}

export const viewActionRenderer = makeActionRenderer({
  color: "#1565c0",
  background: "#eef6ff",
});

export const deleteActionRenderer = makeActionRenderer({
  color: "#c62828",
  background: "#ffebee",
});

export function moneyRenderer(instance, td, row, col, prop, value) {
  resetCell(td);
  td.textContent =
    value === null || value === undefined || value === ""
      ? ""
      : clpFormat(Number(value));
  td.style.textAlign = "right";
}

export function dateRenderer(instance, td, row, col, prop, value) {
  resetCell(td);
  td.textContent = value ? formatDateEs(value) : "";
  td.style.textAlign = "center";
}

export function dateTimeRenderer(instance, td, row, col, prop, value) {
  resetCell(td);

  if (!value) {
    td.textContent = "";
    return;
  }

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) {
    td.textContent = String(value);
    return;
  }

  td.textContent = d.toLocaleString("es-CL");
  td.style.textAlign = "center";
}

export function booleanRenderer(instance, td, row, col, prop, value) {
  resetCell(td);

  if (value === null || value === undefined || value === "") {
    td.textContent = "";
    td.style.textAlign = "center";
    return;
  }

  td.textContent = value ? "Sí" : "No";
  td.style.textAlign = "center";
}
