import React, { useRef, useState } from 'react';
import { FaFilePdf, FaPrint, FaSpinner } from 'react-icons/fa';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import IDCard from './IDCard'; 

const IDCardActions = ({ user }) => {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- IMPROVED PRINT LOGIC ---
  const handlePrint = () => {
    if (!cardRef.current) return;

    const printContent = cardRef.current.innerHTML;
    
    // 1. Create the hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    // 2. DEFINE THE 'doc' VARIABLE (This fixes your ESLint error)
    const doc = iframe.contentWindow.document;

    // 3. Write the content into the iframe
    doc.write(`
      <html>
        <head>
          <title>Print ID - ${user.regID || user.RegID}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
<style>
  @page { size: auto; margin: 10mm; }
  body { 
    background: white; 
    padding: 20px; 
    display: flex; 
    justify-content: center; 
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  #id-card-wrapper { 
    width: 450px !important; 
    margin: 0 auto !important;
  }

  /* 1. Force the Green Header and strip grey overlays */
  div[style*="background-color: rgb(25, 135, 84)"], 
  div[style*="background-color: #198754"],
  .bg-success {
    background-color: #198754 !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    border: none !important;
    box-shadow: none !important;
  }

  /* 2. Ensure text on top of the green is pure white */
  .text-white, h2, div {
    -webkit-print-color-adjust: exact !important;
  }

  /* 3. Fix for the "Grey Tint" on images/divs */
  * {
    -webkit-filter: none !important;
    filter: none !important;
  }
</style>
        </head>
        <body>
          <div id="id-card-wrapper">${printContent}</div>
        </body>
      </html>
    `);

    doc.close(); // Signals that writing is finished

    // 4. Wait for CSS/Images to load and then print
    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
      // 5. Cleanup the iframe from the DOM
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }, 1000);
  };

  // --- PDF LOGIC (From your working IDCard component) ---
 const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    
    const element = cardRef.current.querySelector("#id-card-wrapper");
    
    // 1. Target all text elements that might be truncating
    const truncatedElements = element.querySelectorAll('.truncate-text, p, span');
    
    // Store original styles to restore them later
    const originalStyles = [];

    truncatedElements.forEach((el, index) => {
      originalStyles[index] = {
        whiteSpace: el.style.whiteSpace,
        overflow: el.style.overflow,
        textOverflow: el.style.textOverflow,
        display: el.style.display
      };

      // FORCE MULTI-LINE
      el.style.setProperty('white-space', 'normal', 'important');
      el.style.setProperty('overflow', 'visible', 'important');
      el.style.setProperty('text-overflow', 'clip', 'important');
      el.style.setProperty('display', 'block', 'important'); // Block ensures it takes full width
    });

    try {
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 450,
        height: 600,
        // Crucial: This ensures the "invisible" window is wide enough to calculate wrapping
        windowWidth: 1200, 
      });

      // 2. Restore original styles immediately after capture
      truncatedElements.forEach((el, index) => {
        el.style.whiteSpace = originalStyles[index].whiteSpace;
        el.style.overflow = originalStyles[index].overflow;
        el.style.textOverflow = originalStyles[index].textOverflow;
        el.style.display = originalStyles[index].display;
      });

      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [130, 175], 
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 10;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 5, 5, pdfWidth, pdfHeight);
      pdf.save(`LP_ID_${user.regID || user.RegID}.pdf`);
    } catch (error) {
      console.error("PDF generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="d-inline-flex gap-2">
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px',width: '450px', }}>
        <div ref={cardRef}>
          <IDCard user={user} hideControls={true} /> 
        </div>
      </div>

      <button className="btn btn-sm btn-outline-danger px-2" onClick={handleDownloadPDF} disabled={isGenerating}>
        {isGenerating ? <FaSpinner className="spin" /> : <FaFilePdf />} PDF
      </button>
      
      <button className="btn btn-sm btn-outline-secondary px-2" onClick={handlePrint}>
        <FaPrint /> Print
      </button>
    </div>
  );
};

export default IDCardActions;