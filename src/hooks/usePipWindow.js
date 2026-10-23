import { useCallback, useState } from 'react';

// Document Picture-in-Picture chỉ có trên Chrome/Edge 116+.
export const pipSupported = 'documentPictureInPicture' in window;

// Vite nạp CSS bằng thẻ <style>, font thì bằng <link>, nên chép cả hai sang cửa sổ nổi.
function copyStyles(doc) {
  for (const node of document.head.querySelectorAll('link[rel="stylesheet"], style')) {
    if (node.tagName === 'LINK') {
      const link = doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = node.href;
      doc.head.append(link);
    } else {
      doc.head.append(node.cloneNode(true));
    }
  }
}

export function usePipWindow() {
  const [pipWindow, setPipWindow] = useState(null);

  const open = useCallback(async () => {
    if (!pipSupported) return;
    let win;
    try {
      win = await window.documentPictureInPicture.requestWindow({ width: 300, height: 400 });
    } catch {
      return;
    }
    win.document.title = 'Deadline Radar';
    win.document.body.className = 'widget';
    copyStyles(win.document);
    win.addEventListener('pagehide', () => setPipWindow(null), { once: true });
    setPipWindow(win);
  }, []);

  const close = useCallback(() => pipWindow?.close(), [pipWindow]);

  return { pipWindow, open, close };
}
