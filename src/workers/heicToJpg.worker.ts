import heic2any from 'heic2any';

self.onmessage = async (e: MessageEvent) => {
  const { file, format } = e.data as { file: File, format: 'image/jpeg' | 'image/png' };

  try {
    const convertedBlob = await heic2any({
      blob: file,
      toType: format,
      quality: 0.8
    });
    
    // heic2any can return an array of blobs for animation/bursts, but usually it's one.
    const resultBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

    self.postMessage({ success: true, blob: resultBlob });
  } catch (error: any) {
    self.postMessage({ success: false, error: error.message || 'An error occurred while converting the image' });
  }
};
