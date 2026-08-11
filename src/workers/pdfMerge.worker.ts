import { PDFDocument } from 'pdf-lib';

self.onmessage = async (e: MessageEvent) => {
  const { files } = e.data as { files: File[] };

  try {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      
      for (const page of copiedPages) {
        mergedPdf.addPage(page);
      }
    }

    const mergedPdfBytes = await mergedPdf.save();
    
    // Create a blob from the bytes
    const blob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
    
    self.postMessage({ success: true, blob });
  } catch (error: any) {
    self.postMessage({ success: false, error: error.message || 'An error occurred while merging PDFs' });
  }
};
