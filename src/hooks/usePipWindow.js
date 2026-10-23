import { useCallback, useState } from 'react';

// Document Picture-in-Picture chỉ có trên Chrome/Edge 116+.
export const pipSupported = 'documentPictureInPicture' in window;

// Chiều cao cửa sổ widget: đầy đủ và thu gọn 1 dòng.
export const WIDGET_HEIGHT = 400;
export const WIDGET_COMPACT_HEIGHT = 90;

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

  const open = useCallback(async (height = WIDGET_HEIGHT) => {
    if (!pipSupported) return;
    let win;
    try {
      win = await window.documentPictureInPicture.requestWindow({ width: 300, height });
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

  // Đổi chiều cao, giữ chiều rộng người dùng đã kéo. Trình duyệt chỉ cho làm khi người dùng vừa bấm.
  const resize = useCallback((height) => {
    try {
      pipWindow?.resizeTo(pipWindow.outerWidth, height);
    } catch {}
  }, [pipWindow]);

  return { pipWindow, open, close, resize };
}
