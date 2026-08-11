import { removeBackground } from '@imgly/background-removal';

self.onmessage = async (e: MessageEvent) => {
  const { file } = e.data as { file: File };

  try {
    // The library automatically uses Cache API to cache the model on first download
    const blob = await removeBackground(file, {
      progress: (key, current, total) => {
        // Send progress updates back to UI if we are downloading the model
        if (key.includes('fetch')) {
          self.postMessage({ type: 'progress', data: { current, total } });
        }
      }
    });

    self.postMessage({ type: 'success', blob });
  } catch (error: any) {
    self.postMessage({ type: 'error', error: error.message || 'An error occurred while removing the background' });
  }
};
