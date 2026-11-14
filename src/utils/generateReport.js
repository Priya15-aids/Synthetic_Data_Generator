import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generatePDFReport({
  originalFileName,
  columns,
  sourceData,
  generatedData,
  numRecords,
  generationTime,
  reportFileName,
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 16;

  const black = [0, 0, 0];
  const lightGrey = [217, 217, 217]; 
  const tableHeadBg = [229, 229, 229]; 
  const tableHeadText = [0, 0, 0];

  const reportName = reportFileName || 'Synthetic Dataset';

  doc.setTextColor(...black);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('SynthData', 14, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...black);
  doc.text('Synthetic Data Generation Report', 14, y);
  y += 4;

  doc.setDrawColor(...lightGrey);
  doc.setLineWidth(0.4);
  doc.line(14, y, pageWidth - 14, y);
  y += 8;

  const cardWidth = (pageWidth - 28 - 8) / 2; 
  const cardHeight = 18;

  doc.setDrawColor(...lightGrey);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, y, cardWidth, cardHeight, 2, 2, 'S');

  doc.setTextColor(...black);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Generation Date & Time', 18, y + 5);
  doc.setTextColor(...black);
  doc.setFontSize(8.5);+9
  doc.setFont('helvetica', 'bold');
  const now = new Date();
  const dateStr = `${now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  doc.text(dateStr, 18, y + 12);

  const card2X = 14 + cardWidth + 8;
  doc.roundedRect(card2X, y, cardWidth, cardHeight, 2, 2, 'S');

  doc.setTextColor(...black);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Original File Name', card2X + 4, y + 5);
  doc.setTextColor(...black);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(originalFileName || 'Custom Columns (No file uploaded)', card2X + 4, y + 12);

  y += cardHeight + 10;

  const missingValues = countMissingValues(sourceData, columns);
  const duplicateRows = countDuplicateRows(sourceData, columns);

  doc.setTextColor(...black);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Dataset Summary (Source)', 14, y);
  y += 2;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Total Rows', sourceData.length.toString()],
      ['Total Columns', columns.length.toString()],
      ['Missing Values', missingValues.toString()],
      ['Duplicate Rows', duplicateRows.toString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: tableHeadBg, textColor: tableHeadText, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: black },
    styles: { cellPadding: 2.5, lineColor: lightGrey, lineWidth: 0.3 },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 8;

  doc.setTextColor(...black);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Generation Settings', 14, y);
  y += 2;

  const colNamesStr = columns.length <= 8
    ? columns.join(', ')
    : columns.slice(0, 8).join(', ') + ` ... (+${columns.length - 8} more)`;

  autoTable(doc, {
    startY: y,
    head: [['Setting', 'Value']],
    body: [
      ['Requested Records', numRecords.toString()],
      ['Source Rows Used', sourceData.length.toString()],
      ['Columns', columns.length.toString()],
      ['Column Names', colNamesStr],
    ],
    theme: 'grid',
    headStyles: { fillColor: tableHeadBg, textColor: tableHeadText, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: black },
    styles: { cellPadding: 2.5, lineColor: lightGrey, lineWidth: 0.3 },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 8;

  const genMissing = countMissingValues(generatedData, columns);
  const genDuplicates = countDuplicateRows(generatedData, columns);

  doc.setTextColor(...black);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Generated Dataset Summary', 14, y);
  y += 2;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Generated Rows', generatedData.length.toString()],
      ['Total Columns', columns.length.toString()],
      ['Missing Values', genMissing.toString()],
      ['Duplicate Rows', genDuplicates.toString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: tableHeadBg, textColor: tableHeadText, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: black },
    styles: { cellPadding: 2.5, lineColor: lightGrey, lineWidth: 0.3 },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 8;

  const qualityMetrics = calculateQualityMetrics({ columns, sourceData, generatedData, generationTime });

  doc.setTextColor(...black);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Quality Metrics', 14, y);
  y += 2;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Column Match', qualityMetrics.columnMatch],
      ['Data Type Match', qualityMetrics.dataTypeMatch],
      ['Missing %', qualityMetrics.missingPercent],
      ['Duplicate %', qualityMetrics.duplicatePercent],
      ['Generation Time', qualityMetrics.generationTimeStr],
    ],
    theme: 'grid',
    headStyles: { fillColor: tableHeadBg, textColor: tableHeadText, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: black },
    styles: { cellPadding: 2.5, lineColor: lightGrey, lineWidth: 0.3 },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 12;

  doc.setDrawColor(...lightGrey);
  doc.setLineWidth(0.3);
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  doc.setTextColor(...black);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Generated using SynthData', 14, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...black);
  doc.setFontSize(7.5);
  doc.text('All processing was performed securely.', 14, y);

  const dotsX = pageWidth - 30;
  const dotsY = y - 6;
  doc.setFillColor(...lightGrey);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      doc.circle(dotsX + col * 3, dotsY + row * 3, 0.5, 'F');
    }
  }

  const pdfName = reportFileName ? `${reportFileName}_Report.pdf` : 'SynthData_Report.pdf';
  doc.save(pdfName);
}

function countMissingValues(data, columns) {
  let missing = 0;
  data.forEach((row) => {
    columns.forEach((col) => {
      const val = row[col];
      if (val === undefined || val === null || val === '') {
        missing++;
      }
    });
  });
  return missing;
}

function countDuplicateRows(data, columns) {
  if (data.length === 0) return 0;
  const seen = new Set();
  let duplicates = 0;
  data.forEach((row) => {
    const key = columns.map((col) => String(row[col] ?? '')).join('|');
    if (seen.has(key)) {
      duplicates++;
    } else {
      seen.add(key);
    }
  });
  return duplicates;
}

export function calculateQualityMetrics({ columns, sourceData, generatedData, generationTime }) {
  const genColumns = generatedData.length > 0 ? Object.keys(generatedData[0]) : [];
  const matchingCols = columns.filter((col) => genColumns.includes(col));
  const columnMatch = columns.length > 0 ? `${Math.round((matchingCols.length / columns.length) * 100)}%` : '100%';

  let typeMatches = 0;
  let typeChecks = 0;
  if (sourceData.length > 0 && generatedData.length > 0) {
    columns.forEach((col) => {
      const sourceVal = sourceData[0][col];
      const genVal = generatedData[0][col];
      typeChecks++;
      if (typeof sourceVal === typeof genVal) {
        typeMatches++;
      } else if (!isNaN(sourceVal) && !isNaN(genVal)) {
        typeMatches++;
      }
    });
  } else {
    typeMatches = columns.length;
    typeChecks = columns.length;
  }
  const dataTypeMatch = typeChecks > 0 ? `${Math.round((typeMatches / typeChecks) * 100)}%` : '100%';

  const totalCells = generatedData.length * columns.length;
  let missingCells = 0;
  generatedData.forEach((row) => {
    columns.forEach((col) => {
      if (row[col] === undefined || row[col] === null || row[col] === '') {
        missingCells++;
      }
    });
  });
  const missingPercent = totalCells > 0 ? `${((missingCells / totalCells) * 100).toFixed(2)}%` : '0%';

  const duplicates = countDuplicateRows(generatedData, columns);
  const duplicatePercent = generatedData.length > 0
    ? `${((duplicates / generatedData.length) * 100).toFixed(2)}%`
    : '0%';

  const generationTimeStr = generationTime < 1000
    ? `${generationTime}ms`
    : `${(generationTime / 1000).toFixed(2)}s`;

  return {
    columnMatch,
    dataTypeMatch,
    missingPercent,
    duplicatePercent,
    generationTimeStr,
    columnMatchRaw: columns.length > 0 ? Math.round((matchingCols.length / columns.length) * 100) : 100,
    dataTypeMatchRaw: typeChecks > 0 ? Math.round((typeMatches / typeChecks) * 100) : 100,
    missingPercentRaw: totalCells > 0 ? parseFloat(((missingCells / totalCells) * 100).toFixed(2)) : 0,
    duplicatePercentRaw: generatedData.length > 0 ? parseFloat(((duplicates / generatedData.length) * 100).toFixed(2)) : 0,
  };
}