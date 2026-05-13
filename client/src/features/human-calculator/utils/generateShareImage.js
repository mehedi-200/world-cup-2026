import html2canvas from 'html2canvas';

export async function generateShareImage(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return null;
  const canvas = await html2canvas(el, {
    backgroundColor: '#1a1a2e',
    scale: 2,
    useCORS: true,
  });
  return canvas.toDataURL('image/png');
}

export function downloadImage(dataUrl, filename = 'human-calculator-result.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
