import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import { Document as DocxDocument, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, AlignmentType, BorderStyle } from 'docx';
import { toPng } from 'html-to-image';

// Register Font for PDF
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 600 },
  ]
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Inter' },
  title: { fontSize: 20, marginBottom: 20, fontWeight: 600, color: '#1A1A1A' },
  table: { width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E5E5', borderBottomWidth: 0, borderRightWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableColHeader: { width: '33.33%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E5E5', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#F9FAFB' },
  tableCol: { width: '33.33%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E5E5', borderLeftWidth: 0, borderTopWidth: 0 },
  tableColBold: { width: '33.33%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E5E5', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#F3F4F6' },
  tableCellHeader: { margin: 8, fontSize: 10, fontWeight: 600 },
  tableCell: { margin: 8, fontSize: 10 },
  tableCellRight: { margin: 8, fontSize: 10, textAlign: 'right' },
  tableCellRightBold: { margin: 8, fontSize: 10, textAlign: 'right', fontWeight: 600 },
});

export interface SalaryBreakdownData {
  basic: number;
  hra: number;
  ta: number;
  other: number;
  variable: number;
  totalCtc: number;
}

const formatINR = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

// 1. PDF Export
export const downloadPDF = async (data: SalaryBreakdownData) => {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Salary Structure Breakup</Text>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Particulars</Text></View>
            <View style={styles.tableColHeader}><Text style={[styles.tableCellHeader, { textAlign: 'right' }]}>Month (INR)</Text></View>
            <View style={styles.tableColHeader}><Text style={[styles.tableCellHeader, { textAlign: 'right' }]}>Year (INR)</Text></View>
          </View>
          
          {/* Rows */}
          {[
            ['Basic', data.basic],
            ['HRA', data.hra],
            ['Travelling Allowance', data.ta],
            ['Other Allowance', data.other],
            ['Variable Pay', data.variable],
          ].map(([label, amount], i) => (
            <View style={styles.tableRow} key={i}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{label}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCellRight}>{formatINR((amount as number) / 12)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCellRight}>{formatINR(amount as number)}</Text></View>
            </View>
          ))}
          
          {/* Total Row */}
          <View style={styles.tableRow}>
            <View style={styles.tableColBold}><Text style={[styles.tableCellHeader, { fontWeight: 600 }]}>Total CTC</Text></View>
            <View style={styles.tableColBold}><Text style={styles.tableCellRightBold}>{formatINR(data.totalCtc / 12)}</Text></View>
            <View style={styles.tableColBold}><Text style={styles.tableCellRightBold}>{formatINR(data.totalCtc)}</Text></View>
          </View>
        </View>
      </Page>
    </Document>
  );

  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Salary_Structure.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 2. DOCX Export
export const downloadDOCX = async (data: SalaryBreakdownData) => {
  const createCell = (text: string, bold = false, alignRight = false, header = false) => {
    return new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text, bold, font: 'Arial', size: 20 })], // size 20 = 10pt
        alignment: alignRight ? AlignmentType.RIGHT : AlignmentType.LEFT,
      })],
      shading: header ? { fill: "F3F4F6" } : undefined,
      margins: { top: 100, bottom: 100, left: 100, right: 100 }
    });
  };

  const createRow = (label: string, amount: number, isTotal = false) => {
    return new TableRow({
      children: [
        createCell(label, isTotal, false, isTotal),
        createCell(formatINR(amount / 12), isTotal, true, isTotal),
        createCell(formatINR(amount), isTotal, true, isTotal),
      ]
    });
  };

  const doc = new DocxDocument({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [new TextRun({ text: "Salary Structure Breakup", bold: true, size: 32, font: 'Arial' })],
          spacing: { after: 400 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                createCell("Particulars", true, false, true),
                createCell("Month (INR)", true, true, true),
                createCell("Year (INR)", true, true, true),
              ]
            }),
            createRow("Basic", data.basic),
            createRow("HRA", data.hra),
            createRow("Travelling Allowance", data.ta),
            createRow("Other Allowance", data.other),
            createRow("Variable Pay", data.variable),
            createRow("Total CTC", data.totalCtc, true),
          ]
        })
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Salary_Structure.docx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 3. PNG Export
export const downloadPNG = async (tableElementId: string) => {
  const el = document.getElementById(tableElementId);
  if (!el) return;
  const dataUrl = await toPng(el, { backgroundColor: '#ffffff', style: { padding: '20px' } });
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'Salary_Structure.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 4. Copy as Text
export const copyText = async (data: SalaryBreakdownData) => {
  const lines = [
    `| Particulars              | Month (INR) | Year (INR) |`,
    `|--------------------------|-------------|------------|`,
    `| Basic                    | ${formatINR(data.basic / 12).padStart(11)} | ${formatINR(data.basic).padStart(10)} |`,
    `| HRA                      | ${formatINR(data.hra / 12).padStart(11)} | ${formatINR(data.hra).padStart(10)} |`,
    `| Travelling Allowance     | ${formatINR(data.ta / 12).padStart(11)} | ${formatINR(data.ta).padStart(10)} |`,
    `| Other Allowance          | ${formatINR(data.other / 12).padStart(11)} | ${formatINR(data.other).padStart(10)} |`,
    `| Variable Pay             | ${formatINR(data.variable / 12).padStart(11)} | ${formatINR(data.variable).padStart(10)} |`,
    `| Total CTC                | ${formatINR(data.totalCtc / 12).padStart(11)} | ${formatINR(data.totalCtc).padStart(10)} |`,
  ];
  const text = lines.join('\n');
  await navigator.clipboard.writeText(text);
};
