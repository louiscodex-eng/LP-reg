import React, { useState } from "react";
import html2pdf from "html2pdf.js";
import IDCard from "./IDCard";
import { FaDownload } from "react-icons/fa";

const BulkIDDownload = ({ users }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBulkDownload = async () => {
    // We use a Set to ensure unique users based on RegID before generating
    const uniqueUsers = Array.from(new Map(users.map(u => [u.regId || u.RegID, u])).values());

    if (uniqueUsers.length === 0) return;
    setIsGenerating(true);

    const element = document.getElementById("bulk-print-container");
    
    const options = {
      margin: 10,
      filename: `Bulk_ID_Cards_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error("PDF Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-outline-success w-100 btn-sm fw-bold py-2 shadow-sm d-flex align-items-center justify-content-center gap-2"
        onClick={handleBulkDownload}
        disabled={isGenerating || users.length === 0}
      >
        {isGenerating ? (
          <span className="spinner-border spinner-border-sm" role="status" />
        ) : (
          <FaDownload />
        )}
        {isGenerating ? "Processing..." : `Download ${users.length} ID Cards`}
      </button>

      {/* HIDDEN BUFFER */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <style>
          {`
            /* Force hiding of buttons, footers, and crontocode during PDF generation */
            #bulk-print-container .no-print, 
            #bulk-print-container button, 
            #bulk-print-container .cronto-section,
            #bulk-print-container .download-trigger {
              display: none !important;
            }
            #bulk-print-container .id-card-wrapper {
              margin-bottom: 50px;
              page-break-inside: avoid;
            }
          `}
        </style>
        <div id="bulk-print-container" style={{ width: "210mm", padding: "10mm" }}>
          {/* Ensure we map over unique users and pass the specific 'u' object */}
          {users.map((u, index) => (
            <div key={u.regId || u.RegID || index} className="id-card-wrapper">
              <IDCard user={u} isPrinting={true} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BulkIDDownload;