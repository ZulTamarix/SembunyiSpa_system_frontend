import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// #region 1) -> table
  export const generateExcel = async (fileName: string, file_data: any[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('AllTables');

    let currentRow = 1;

    const tableData = file_data;
    if (!tableData || tableData.length === 0) return;

    const headerKeys = Object.keys(tableData[0]);

    // Merge title row
    const endCol = headerKeys.length;
    worksheet.mergeCells(currentRow, 1, currentRow, endCol);

    currentRow++;

    // Header row
    worksheet.insertRow(currentRow, headerKeys.map(key => key.toUpperCase()));

    // Column width
    headerKeys.forEach((_, index) => {
      worksheet.getColumn(index + 1).width = 25;
    });

    const startRow = currentRow;
    currentRow++;

    // Data rows
    tableData.forEach(rowData => {
      const row = worksheet.insertRow(currentRow, []);

      headerKeys.forEach((key, colIdx) => {
        const rawValue = rowData[key];
        const col = colIdx + 1;

        if (typeof rawValue === 'string' && /^https?:\/\//.test(rawValue)) {
          const cell = row.getCell(col);
          cell.value = { text: 'Shop Link', hyperlink: rawValue };
          cell.font = { color: { argb: 'FF0000FF' }, underline: true };
        } else {
          const value =
            rawValue !== undefined && rawValue !== null && rawValue !== ''
              ? rawValue
              : '-';

          row.getCell(col).value = value;
        }
      });

      currentRow++;
    });

    // styleExcelTable(worksheet, startRow, headerKeys.length, tableData.length); KIV
    styleExcelTable(worksheet, startRow, tableData.length);

    const buffer = await workbook.xlsx.writeBuffer();
    saveAsExcelFile(buffer, fileName);
  };
//#endregion


// #region 2) -> styling
  const styleExcelTable = (
    worksheet: ExcelJS.Worksheet,
    headerRowNum: number,
    // columnCount: number,
    dataRowCount: number
  ) => {
    const headerRow = worksheet.getRow(headerRowNum);
    headerRow.height = 20;

    headerRow.eachCell(cell => {
      cell.font = { 
          bold: true,
          color: { argb: 'FFFFFFFF' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF172554' }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true, };
      cell.border = {
        top: { style: 'dotted' },
        left: { style: 'dotted' },
        bottom: { style: 'dotted' },
        right: { style: 'dotted' }
      };
    });

    for (let i = 1; i <= dataRowCount; i++) {
      const row = worksheet.getRow(headerRowNum + i);
      row.height = 30;

      row.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: i % 2 === 0 ? 'FFF2F2F2' : 'FFFFFFFF'
          }
        };

        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true, };

        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }
  };
//#endregion


// #region 3) -> SAVE FILE
  const saveAsExcelFile = (buffer: any, fileName: string) => {
    const blob = new Blob([buffer], {
      type: 'application/octet-stream'
    });
    saveAs(blob, fileName);
  };
//#endregion
