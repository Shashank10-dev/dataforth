import { PDFDocument, PDFName, PDFRawStream, PDFDict, PDFNumber, PDFString } from 'pdf-lib';
import imageCompression from 'browser-image-compression';

self.onmessage = async (e: MessageEvent) => {
  const { file, quality } = e.data as { file: File, quality: 'low' | 'medium' | 'high' };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    // Determine max width/height based on quality
    const maxWidthOrHeight = quality === 'low' ? 800 : quality === 'medium' ? 1200 : 1920;
    const compressionQuality = quality === 'low' ? 0.5 : quality === 'medium' ? 0.7 : 0.8;

    const objects = pdf.context.enumerateIndirectObjects();
    let imagesProcessed = 0;
    
    for (const [ref, obj] of objects) {
      if (obj instanceof PDFRawStream) {
        const subtype = obj.dict.lookup(PDFName.of('Subtype'));
        if (subtype === PDFName.of('Image')) {
          const filter = obj.dict.lookup(PDFName.of('Filter'));
          
          // We primarily handle JPEGs safely. Other formats might be more complex to decode manually.
          if (filter === PDFName.of('DCTDecode')) {
            try {
              self.postMessage({ type: 'progress', data: `Compressing image ${imagesProcessed + 1}...` });
              const imageBytes = obj.contents;
              const blob = new Blob([imageBytes as any], { type: 'image/jpeg' });
              const imageFile = new File([blob], "image.jpg", { type: "image/jpeg" });

              const compressedFile = await imageCompression(imageFile, {
                maxSizeMB: 1, 
                maxWidthOrHeight,
                useWebWorker: false, 
                initialQuality: compressionQuality,
                alwaysKeepResolution: false
              });

              const compressedBytes = await compressedFile.arrayBuffer();
              const bitmap = await createImageBitmap(compressedFile);
              
              const newDict = pdf.context.obj({
                Type: 'XObject',
                Subtype: 'Image',
                Width: bitmap.width,
                Height: bitmap.height,
                ColorSpace: 'DeviceRGB',
                BitsPerComponent: 8,
                Filter: 'DCTDecode'
              });

              const newStream = PDFRawStream.of(newDict, new Uint8Array(compressedBytes));
              pdf.context.assign(ref, newStream);
              imagesProcessed++;
              
            } catch (err) {
              console.warn('Failed to compress an embedded image, falling back to original.', err);
              // Fallback: silently fail for this image and keep the original
            }
          } else {
            // Unhandled encoding (e.g. FlateDecode)
            console.warn(`Unsupported image encoding ${filter?.toString()}, falling back to original.`);
          }
        }
      }
    }

    // Strip metadata
    pdf.setTitle('');
    pdf.setAuthor('');
    pdf.setSubject('');
    pdf.setKeywords([]);
    pdf.setProducer('');
    pdf.setCreator('');

    const compressedPdfBytes = await pdf.save({ useObjectStreams: false });
    const compressedBlob = new Blob([compressedPdfBytes as any], { type: 'application/pdf' });
    
    self.postMessage({ success: true, blob: compressedBlob });
  } catch (error: any) {
    self.postMessage({ success: false, error: error.message || 'An error occurred while compressing the PDF' });
  }
};
