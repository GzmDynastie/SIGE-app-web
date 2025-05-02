import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface ExportPDFOptions {
    title?: string;
    filename?: string;
    headers: string[];
    keys: string[];
}

// Exporta PDF
export const exportToPDF = (data: any[], options: ExportPDFOptions) => {
    const { title = "Reporte", filename = "reporte.pdf", headers, keys } = options;

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    doc.text(title, 14, 10);

    autoTable(doc, {
        startY: 20,
        head: [headers],
        body: data.map(item => keys.map(key => item[key] ?? "")),
    });

    doc.save(filename)
}

// Exporta Excel
export const exportToExcel = (object: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(object);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });

    saveAs(dataBlob, "reporte_tickets.xlsx");
};
