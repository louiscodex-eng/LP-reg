
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "./logo2.jpeg";
import "../App.css";
//import qrCode from './qrcode.png';
import chairman from './senator.png'
import secretary from './secretary.png'
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaFilePdf, FaSpinner } from 'react-icons/fa';


function IDCard({ user }) {

  const cardRef = useRef(null);
const [isGenerating, setIsGenerating] = useState(false);
  if (!user) return <div className="p-5 text-center">Loading ID Card...</div>;

  
 const downloadPdf = async () => {
  // 1. Get the element from the ref
  const element = cardRef.current;

  // 2. CRITICAL NULL CHECK: If it's null, we stop the crash
  if (!element) {
    console.error("Capture element is null. Check if ref={cardRef} is attached.");
    toast.error("Could not find the ID card layout. Please try again.");
    return;
  }

  setIsGenerating(true);

  try {
    // 3. Instead of searching for children, apply logic to the element itself
    // This prevents the querySelectorAll crash if the IDs are missing
    const textElements = element.querySelectorAll('p, span, .truncate-text');
    
    textElements.forEach(el => {
      el.style.whiteSpace = 'normal';
      el.style.overflow = 'visible';
    });

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false, // Turn off logs to keep console clean
      width: 450,
      windowWidth: 1200
    });

    // Restore styles
    textElements.forEach(el => {
      el.style.whiteSpace = 'nowrap';
      el.style.overflow = 'hidden';
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [130, 170], 
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - 10;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 5, 5, pdfWidth, pdfHeight);
    pdf.save(`LP_ID_${user.regID || user.RegID || 'Member'}.pdf`);
    
    toast.success("Download Complete!");
  } catch (error) {
    console.error("PDF Error:", error);
    toast.error("Failed to generate PDF");
  } finally {
    setIsGenerating(false);
  }
};

  // Common Header Component to maintain consistency
  const CardHeader = () => (
    <div
      className="d-flex align-items-center mb-2 px-2 py-1 rounded"
      style={{ backgroundColor: "#198754",marginTop:"-5px" }}
    >
      <img src={logo} alt="logo" style={{ 
          width: "60px",
          height: "60px",
          padding: "2px", // Slight space between logo and border
          objectFit: "contain"
        }} />
      <div className="flex-grow-1 text-center text-white">
        <h2 className="mb-0 fw-bold" style={{ fontSize: "20px" }}>Labour Party(LP)</h2>
        <i style={{ fontSize: "10px" }}>Motto: EQUAL OPPORTUNITY AND SOCIAL JUSTICE</i>
        <div className="fw-bold" style={{ fontSize: "14px", marginTop: "1px" }}>
          {` REG-ID:${user.regID || user.RegID}`}
        </div>
      </div>
    </div>
  );

  return (
    <div className="text-center mt-5">
      {/* WRAPPER FOR BOTH CARDS */}
      {/* <div id="id-card-wrapper" style={{ width: "450px", margin: "0 auto" }}> */}
      <div ref={cardRef} style={{ width: "450px", margin: "0 auto" }}>
        
        {/* 🔹 FRONT CARD */}
        <div
          className="border border-success rounded mb-3"
          style={{
            width: "450px",
            height: "280px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#f4fff6",
          }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url('/logo2.png')`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", opacity: 0.15, zIndex: 1 }} />
          <div style={{ position: "relative", zIndex: 2, padding: "10px", height: "100%" }}>
            <CardHeader />
            <div className="row mt-3">
              <div className="col-8 fw-medium text-start px-4 mt-3">
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", color: "#404040", textTransform:'uppercase' }}>
                  <span className="truncate-text" style={{ fontSize: "12px" }}>{`Full Name: ${user.firstName} ${user.middleName && user.middleName !== "null" ? user.middleName : ""} ${user.lastName}`}</span>
                  <span className="truncate-text" style={{ fontSize: "12px" }}>{`State: ${user.state}`}</span>
                  <span className="truncate-text" style={{ fontSize: "12px" }}>{`LGA: ${user.lga}`}</span>
                  <span className="truncate-text" style={{ fontSize: "12px" }}>{`Ward: ${user.ward || user.Ward}`}</span>
                  
                  {/* TWO SIGNATURES AT BOTTOM */}
                  <div className="d-flex justify-content-between mt-1"style={{ 
    width: "calc(100% + 200px)", // Expands width to counteract the px-4 padding
   marginLeft: "10px",        // Pulls the left signature to the edge
    paddingRight: "250px",        // Adjusts right alignment
    paddingTop:"12px"
  }} >
                    <div className="text-center">
                      <img src={chairman} alt="sig1" style={{ width: "80px", height: "30px", objectFit: "contain" }} />
                      <div style={{ fontSize: "9px", color: "#666", borderTop: "1px solid #ccc", paddingTop: "1px" }}>National Chairman</div>
                    </div>
                    <div className="text-center">
                      <img src={secretary} alt="sig2" style={{ width: "80px", height: "30px", objectFit: "contain" }} />
                      <div style={{ fontSize: "9px", color: "#666", borderTop: "1px solid #ccc", paddingTop: "1px" }}>National Secretary</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PASSPORT MOVED UP */}
              <div className="col-4 d-flex align-items-start justify-content-center pt-1">
                <img
                  src={user.passportUrl || user.PassportUrl}
                  alt="passport"
                  crossOrigin="anonymous"
                  className="img-thumbnail"
                  style={{ width: "150px", height: "130px", objectFit: "cover", borderColor: "#198754", overflow:"hidden" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 BACK CARD */}
        <div
          className="border border-success rounded"
          style={{
            width: "450px",
            height: "280px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <div style={{ position: "relative", zIndex: 2, padding: "10px", height: "100%" }}>
        <CardHeader/>
            <div className="px-3 py-2 text-center mt-1">
              <h6 className="fw-bold text-success mb-1">Important Notice</h6>
               <p style={{ fontSize: "12px", color: "#333", lineHeight: "1.6" }}>
              Please present your digital card and passport photograph at your respective 
              ward offices for validation and confirmation
              </p>
              
              <p style={{ fontSize: "12px", color: "#333", lineHeight: "1.6" }}>
                This card is an official property of the Labour Party (LP). 
                If found, please return to the nearest Labour Party Office or 
                to the National Secretariat at No. 2 IBM Haruna Street, Utako, Abuja.
              </p>
               <h5 style={{ fontSize: "12px",}}  className="fw-bold f-12 text-success mb-2">Signed: National Secretary</h5>
            </div>
          </div>
        </div>
      </div>

     {/* Update your PDF button to look like this */}
<button 
  className="btn btn-lg btn-outline-success px-4 mt-3" 
  onClick={downloadPdf} 
  disabled={isGenerating} // <--- USE IT HERE
>
  {/* AND USE IT HERE TO SHOW THE SPINNER */}
  {isGenerating ? <FaSpinner className="spin" /> : <FaFilePdf />} Download your Membership ID Card in PDF
</button>

      {/* <div className="mt-4 text-center">
        <p className="text-muted mb-2" style={{ maxWidth: "450px", margin: "0 auto" }}>
          Download the Labour Party mobile app and scan the above Crontocode to download the ID card to your mobile phone
        </p>
        <img src={qrCode} alt="QR Code" width={120} height={120} />
      </div> */}
    </div>
  );
}

export default IDCard;

