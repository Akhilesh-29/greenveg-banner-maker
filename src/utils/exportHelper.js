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

  const targetW = Number(width) || 1080;
  const targetH = Number(height) || 1080;

  const options = {
    quality: format === 'jpg' ? 0.98 : 1,
    pixelRatio: Number(scale) || 2,
    width: targetW,
    height: targetH,
    canvasWidth: targetW * (Number(scale) || 2),
    canvasHeight: targetH * (Number(scale) || 2),
    skipFonts: true,
    fontEmbedCSS: '',
    style: {
      transform: 'none',
      transformOrigin: 'top left',
      position: 'static',
      margin: '0',
      boxShadow: 'none',
      borderRadius: '0px'
    },
    cacheBust: true,
    filter: (node) => {
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
    const isLandscape = targetW > targetH;
    
    // Create PDF matching aspect ratio
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'px',
      format: [targetW, targetH]
    });

    pdf.addImage(dataUrl, 'JPEG', 0, 0, targetW, targetH);
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

export const shareBanner = async ({ element, title, text, filename = 'shop-banner', width = 1080, height = 1080 }) => {
  if (!element) return false;

  const targetW = Number(width) || 1080;
  const targetH = Number(height) || 1080;

  try {
    const blob = await toBlob(element, {
      pixelRatio: 2,
      quality: 0.95,
      width: targetW,
      height: targetH,
      canvasWidth: targetW * 2,
      canvasHeight: targetH * 2,
      style: {
        transform: 'none',
        transformOrigin: 'top left',
        position: 'static',
        margin: '0',
        boxShadow: 'none',
        borderRadius: '0px'
      }
    });
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
  
  const url = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;
    
  window.open(url, '_blank');
};
