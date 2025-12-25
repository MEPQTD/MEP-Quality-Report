
declare const html2canvas: any;
declare const jspdf: any;

export const exportToPdf = async (containerId: string, filename: string) => {
  const element = document.getElementById(containerId);
  if (!element) return;

  const { jsPDF } = jspdf;
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [1120, 630]
  });

  const slides = element.querySelectorAll('.pdf-slide');
  
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i] as HTMLElement;
    const canvas = await html2canvas(slide, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, 1120, 630);
  }

  pdf.save(`${filename}.pdf`);
};
