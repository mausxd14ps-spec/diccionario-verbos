import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { FormKey, Verb } from "../types";
import { FORM_SHORT_LABELS } from "../types";

export interface ExportOptions {
  includeForms: FormKey[];
  includeTranslation: boolean;
  includeDefinition: boolean;
  includeExample: boolean;
}

function buildRows(verbs: Verb[], options: ExportOptions) {
  const headers = ["Verbo", "Tipo"];
  if (options.includeTranslation) headers.push("Traducción");
  for (const f of options.includeForms) headers.push(FORM_SHORT_LABELS[f]);
  if (options.includeDefinition) headers.push("Definición");
  if (options.includeExample) headers.push("Ejemplo (EN)", "Ejemplo (ES)");

  const rows = verbs.map((v) => {
    const row: string[] = [v.base, v.type === "regular" ? "Regular" : "Irregular"];
    if (options.includeTranslation) row.push(v.es);
    for (const f of options.includeForms) row.push(v.forms[f]);
    if (options.includeDefinition) row.push(v.definition);
    if (options.includeExample) {
      const ex = v.examples.base;
      row.push(ex.en, ex.es);
    }
    return row;
  });

  return { headers, rows };
}

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function csvEscape(value: string) {
  if (/[",\n;]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportCsv(verbs: Verb[], options: ExportOptions, filename = "mi-lista-de-verbos.csv") {
  const { headers, rows } = buildRows(verbs, options);
  const lines = [headers, ...rows].map((r) => r.map(csvEscape).join(","));
  // BOM so Excel detects UTF-8 accents correctly
  const csvContent = "\uFEFF" + lines.join("\r\n");
  downloadBlob(filename, csvContent, "text/csv;charset=utf-8;");
}

export function exportPdf(verbs: Verb[], options: ExportOptions, filename = "mi-lista-de-verbos.pdf") {
  const { headers, rows } = buildRows(verbs, options);
  const doc = new jsPDF({ orientation: "landscape", unit: "pt" });

  doc.setFontSize(16);
  doc.setTextColor(79, 70, 229);
  doc.text("English Verbs Pro — Mi lista de verbos", 40, 40);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`${verbs.length} verbo(s) · Generado el ${new Date().toLocaleDateString("es-ES")}`, 40, 58);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 72,
    styles: { fontSize: 8, cellPadding: 5, overflow: "linebreak" },
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 255] },
    margin: { left: 40, right: 40 },
  });

  doc.save(filename);
}
