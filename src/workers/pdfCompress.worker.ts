import { PDFDocument, PDFName, PDFRawStream, PDFDict, PDFNumber, PDFString } from 'pdf-lib';
import imageCompression from 'browser-image-compression';

async function decompressFlate(contents: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream('deflate');
  const writer = ds.writable.getWriter();
  writer.write(contents as any);
  writer.close();
  const res = new Response(ds.readable);
  return new Uint8Array(await res.arrayBuffer());
}

function unfilterPNG(data: Uint8Array, width: number, height: number, bytesPerPixel: number): Uint8Array {
  const rowBytes = width * bytesPerPixel;
  const out = new Uint8Array(rowBytes * height);
  for (let y = 0; y < height; y++) {
    const filter = data[y * (rowBytes + 1)];
    const rowStart = y * (rowBytes + 1) + 1;
    const outRowStart = y * rowBytes;
    
    for (let x = 0; x < rowBytes; x++) {
      const a = x >= bytesPerPixel ? out[outRowStart + x - bytesPerPixel] : 0;
      const b = y > 0 ? out[outRowStart - rowBytes + x] : 0;
      const c = (x >= bytesPerPixel && y > 0) ? out[outRowStart - rowBytes + x - bytesPerPixel] : 0;
      
      let raw = data[rowStart + x];
      if (filter === 1) { // Sub
        raw = (raw + a) & 255;
      } else if (filter === 2) { // Up
        raw = (raw + b) & 255;
      } else if (filter === 3) { // Average
        raw = (raw + Math.floor((a + b) / 2)) & 255;
      } else if (filter === 4) { // Paeth
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        let pr = c;
        if (pa <= pb && pa <= pc) pr = a;
        else if (pb <= pc) pr = b;
        raw = (raw + pr) & 255;
      }
      out[outRowStart + x] = raw;
    }
  }
  return out;
}

self.onmessage = async (e: MessageEvent) => {
  const { file, quality } = e.data as { file: File, quality: 'low' | 'medium' | 'high' };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    // Determine max width/height based on quality (Resolution downsampling)
    const maxWidthOrHeight = quality === 'low' ? 800 : quality === 'medium' ? 1200 : 1920;
    const compressionQuality = quality === 'low' ? 0.5 : quality === 'medium' ? 0.7 : 0.8;

    const objects = pdf.context.enumerateIndirectObjects();
    let imagesProcessed = 0;
    
    for (const [ref, obj] of objects) {
      if (obj instanceof PDFRawStream) {
        const subtype = obj.dict.lookup(PDFName.of('Subtype'));
        if (subtype === PDFName.of('Image')) {
          const filter = obj.dict.lookup(PDFName.of('Filter'));
          
          if (filter === PDFName.of('DCTDecode') || filter === PDFName.of('FlateDecode')) {
            try {
              self.postMessage({ type: 'progress', data: `Compressing image ${imagesProcessed + 1}...` });
              
              let imageFile: File | null = null;
              const hasSMask = obj.dict.has(PDFName.of('SMask'));

              if (filter === PDFName.of('DCTDecode')) {
                const imageBytes = obj.contents;
                const blob = new Blob([imageBytes as any], { type: 'image/jpeg' });
                imageFile = new File([blob], "image.jpg", { type: "image/jpeg" });
              } else if (filter === PDFName.of('FlateDecode')) {
                // If it has a soft mask, skipping for now to preserve transparency, unless we want to flatten
                if (hasSMask) {
                   console.warn('FlateDecode has SMask, skipping to preserve transparency');
                   continue;
                }

                const widthNum = obj.dict.lookup(PDFName.of('Width'));
                const heightNum = obj.dict.lookup(PDFName.of('Height'));
                const bpcNum = obj.dict.lookup(PDFName.of('BitsPerComponent'));
                const colorSpace = obj.dict.lookup(PDFName.of('ColorSpace'));
                
                if (!(widthNum instanceof PDFNumber) || !(heightNum instanceof PDFNumber)) continue;
                if (bpcNum instanceof PDFNumber && bpcNum.asNumber() !== 8) continue;
                
                let isRGB = false;
                let isGray = false;
                if (colorSpace === PDFName.of('DeviceRGB')) isRGB = true;
                else if (colorSpace === PDFName.of('DeviceGray')) isGray = true;
                else continue; // Unsupported color space (e.g. CMYK, ICCBased)
                
                const width = widthNum.asNumber();
                const height = heightNum.asNumber();
                const bytesPerPixel = isRGB ? 3 : 1;
                
                let decompressed = await decompressFlate(obj.contents);
                
                const decodeParms = obj.dict.lookup(PDFName.of('DecodeParms'));
                if (decodeParms instanceof PDFDict) {
                  const predNum = decodeParms.lookup(PDFName.of('Predictor'));
                  if (predNum instanceof PDFNumber && predNum.asNumber() >= 10) {
                    decompressed = unfilterPNG(decompressed, width, height, bytesPerPixel);
                  }
                }
                
                // Convert to RGBA for ImageData
                const rgba = new Uint8ClampedArray(width * height * 4);
                if (isRGB) {
                  for (let i = 0, j = 0; i < decompressed.length; i += 3, j += 4) {
                    rgba[j] = decompressed[i];
                    rgba[j+1] = decompressed[i+1];
                    rgba[j+2] = decompressed[i+2];
                    rgba[j+3] = 255;
                  }
                } else if (isGray) {
                  for (let i = 0, j = 0; i < decompressed.length; i++, j += 4) {
                    const v = decompressed[i];
                    rgba[j] = v;
                    rgba[j+1] = v;
                    rgba[j+2] = v;
                    rgba[j+3] = 255;
                  }
                }
                
                const imgData = new ImageData(rgba, width, height);
                const canvas = new OffscreenCanvas(width, height);
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.putImageData(imgData, 0, 0);
                  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 1.0 });
                  imageFile = new File([blob], "image.jpg", { type: "image/jpeg" });
                }
              }

              if (imageFile) {
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
              }
            } catch (err) {
              console.warn('Failed to compress an embedded image, falling back to original.', err);
              // Fallback: silently fail for this image and keep the original
            }
          } else {
            // Unhandled encoding
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

    // Improvement 3: Font/object optimization (useObjectStreams: true)
    const compressedPdfBytes = await pdf.save({ useObjectStreams: true });
    const compressedBlob = new Blob([compressedPdfBytes as any], { type: 'application/pdf' });
    
    self.postMessage({ success: true, blob: compressedBlob, imagesProcessed });
  } catch (error: any) {
    self.postMessage({ success: false, error: error.message || 'An error occurred while compressing the PDF' });
  }
};
