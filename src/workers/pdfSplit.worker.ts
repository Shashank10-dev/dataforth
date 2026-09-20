import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

self.onmessage = async (e: MessageEvent) => {
  const { file, mode, selectedPages } = e.data as { 
    file: File, 
    mode: 'extract' | 'split_all', 
    selectedPages?: number[] 
  };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const originalPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const totalPages = originalPdf.getPageCount();

    if (mode === 'extract') {
      if (!selectedPages || selectedPages.length === 0) {
        throw new Error("No pages selected for extraction.");
      }
      const newPdf = await PDFDocument.create();
      // Ensure pages are valid and 0-indexed for pdf-lib (assuming selectedPages is 1-indexed)
      const validPages = selectedPages.filter(p => p >= 1 && p <= totalPages).map(p => p - 1);
      
      const copiedPages = await newPdf.copyPages(originalPdf, validPages);
      copiedPages.forEach(page => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      self.postMessage({ success: true, blob, filename: `extracted_${file.name.replace(/\.[^/.]+$/, "")}.pdf` });
    } 
    else if (mode === 'split_all') {
      const zip = new JSZip();
      
      for (let i = 0; i < totalPages; i++) {
        self.postMessage({ type: 'progress', data: `Splitting page ${i + 1} of ${totalPages}...` });
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
        newPdf.addPage(copiedPage);
        const pdfBytes = await newPdf.save();
        
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        zip.file(`${baseName}_page_${i + 1}.pdf`, pdfBytes);
      }
      
      self.postMessage({ type: 'progress', data: 'Zipping files...' });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      self.postMessage({ success: true, blob: zipBlob, filename: `split_${file.name.replace(/\.[^/.]+$/, "")}.zip` });
    }
  } catch (error: any) {
    self.postMessage({ success: false, error: error.message || 'An error occurred while splitting the PDF.' });
  }
};
