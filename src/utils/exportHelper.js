import { toPng, toJpeg, toBlob } from 'html-to-image';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

export const triggerCelebration = () => {
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#16a34a', '#f59e0b', '#ef4444', '#3b82f6']
    });
  } catch {
    // ignore if canvas-confetti fails
  }
};

export const generateThumbnail = async (element) => {
  if (!element) return null;
  try {
    return await toJpeg(element, {
      quality: 0.6,
      pixelRatio: 0.5,
      cacheBust: true,
      skipFonts: false
    });
  } catch (err) {
    console.warn('Thumbnail generation failed', err);
    return null;
  }
};

export const exportBanner = async ({
  element,
  format = 'png',
  scale = 2,
  filename = 'shop-banner',
  width = 1080,
  height = 1080
}) => {
  if (!element) throw new Error('Preview element not found');

  const options = {
    quality: format === 'jpg' ? 0.95 : 1,
    pixelRatio: Number(scale) || 2,
    cacheBust: true,
    filter: (node) => {
      // Ignore controls or watermarks that shouldn't appear in export
      if (node.classList && node.classList.contains('no-export')) {
        return false;
      }
      return true;
    }
  };

  if (format === 'png') {
    const dataUrl = await toPng(element, options);
    downloadFile(dataUrl, `${filename}.png`);
    triggerCelebration();
    return dataUrl;
  } else if (format === 'jpg') {
    const dataUrl = await toJpeg(element, options);
    downloadFile(dataUrl, `${filename}.jpg`);
    triggerCelebration();
    return dataUrl;
  } else if (format === 'pdf') {
    const dataUrl = await toJpeg(element, { ...options, quality: 0.98 });
    const isLandscape = width > height;
    
    // Create PDF matching aspect ratio
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'px',
      format: [width, height]
    });

    pdf.addImage(dataUrl, 'JPEG', 0, 0, width, height);
    pdf.save(`${filename}.pdf`);
    triggerCelebration();
    return dataUrl;
  }
};

const downloadFile = (dataUrl, filename) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const shareBanner = async ({ element, title, text, filename = 'shop-banner' }) => {
  if (!element) return false;

  try {
    const blob = await toBlob(element, { pixelRatio: 2, quality: 0.92 });
    if (!blob) return false;

    const file = new File([blob], `${filename}.png`, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: title || 'Special Offer Banner',
        text: text || 'Check out our fresh deals today!'
      });
      return true;
    } else if (navigator.share) {
      await navigator.share({
        title: title || 'Special Offer Banner',
        text: text || 'Check out our fresh deals today!'
      });
      return true;
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.warn('Native share failed or canceled', err);
    }
  }
  return false;
};

export const openWhatsAppShare = ({ text, phone = '' }) => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  
  // If phone provided, can pre-target or general wa.me
  const url = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;
    
  window.open(url, '_blank');
};
