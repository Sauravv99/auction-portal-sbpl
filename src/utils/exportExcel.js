// utils/exportToExcel.js
import * as XLSX from "xlsx";

export function exportPlayersToExcel(data, fileName = "Players_Data") {
  if (!Array.isArray(data) || data.length === 0) {
    alert("No data available to download");
    return;
  }

  // Convert JSON → Worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create Workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Players");

  // Download
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
