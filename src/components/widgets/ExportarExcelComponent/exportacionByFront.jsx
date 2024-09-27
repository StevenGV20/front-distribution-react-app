import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const ExcelExport = ({ data, fileName }) => {
  const exportToExcel = () => {
    //console.log(data);
    // Convertir los datos a formato worksheet de XLSX
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Establecer estilos para las columnas (ejemplo: alinear texto al centro)
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
      if (cell) {
        cell.s = { alignment: { horizontal: "center" } }; // Estilo de alineación centrada
      }
    }

    // Agregar un borde alrededor de todas las celdas
    const border = { style: "solid", color: { rgb: "green" } };
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = { r: R, c: C };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        if (!worksheet[cellRef]) continue;
        worksheet[cellRef].s = { border };
      }
    }

    // Crear un nuevo libro de trabajo y agregar la hoja de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "reporte");

    // Generar el archivo Excel y descargarlo
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return <button onClick={exportToExcel}>Export to Excel</button>;
};

export default ExcelExport;
