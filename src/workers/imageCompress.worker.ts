import imageCompression from 'browser-image-compression';

self.onmessage = async (e: MessageEvent) => {
  const { file, quality } = e.data as { file: File, quality: number };

  try {
    const options = {
      maxSizeMB: quality > 0.8 ? 5 : quality > 0.5 ? 2 : 1,
      maxWidthOrHeight: 4096,
      useWebWorker: false, // We are already in a worker
      initialQuality: quality
    };

    const compressedFile = await imageCompression(file, options);
    
    self.postMessage({ success: true, blob: compressedFile });
  } catch (error: any) {
    self.postMessage({ success: false, error: error.message || 'An error occurred while compressing the image' });
  }
};
