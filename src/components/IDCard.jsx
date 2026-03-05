
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "./logo2.png";
import "../App.css";
import qrCode from './qrcode.png';
import chairman from './senator.png'
import secretary from './secretary.png'

function IDCard({ user }) {
  const downloadPdf = async () => {
    const element = document.getElementById("id-card-wrapper");
    
    // Temporarily remove truncation for PDF generation
    const truncatedElements = element.querySelectorAll('.truncate-text');
    truncatedElements.forEach(el => {
      el.style.whiteSpace = 'normal';
      el.style.overflow = 'visible';
      el.style.textOverflow = 'clip';
    });

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
    });

    // Restore truncation after PDF generation
    truncatedElements.forEach(el => {
      el.style.whiteSpace = 'nowrap';
      el.style.overflow = 'hidden';
      el.style.textOverflow = 'ellipsis';
    });

    const imgData = canvas.toDataURL("image/png");

    // Adjusted PDF height to fit both cards (approx 135mm for two 65mm cards + gap)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [130, 140], 
    });

    pdf.addImage(imgData, "PNG", 2.5, 5, 125, 130);
    pdf.save("labour-party-id-card.pdf");
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
          borderRadius: "50%", // Makes it circular
          border: "1px solid white", // White border
          backgroundColor: "white", // Ensures no transparency gaps
          padding: "2px", // Slight space between logo and border
          objectFit: "contain"
        }} />
      <div className="flex-grow-1 text-center text-white">
        <h2 className="mb-0 fw-bold" style={{ fontSize: "20px" }}>Labour Party(LP)</h2>
        <i style={{ fontSize: "10px" }}>Motto: EQUAL OPPORTUNITY AND SOCIAL JUSTICE</i>
        <div className="fw-bold" style={{ fontSize: "14px", marginTop: "1px" }}>
          {` REG-ID: LP/${user.regID || user.RegID}`}
        </div>
      </div>
    </div>
  );

  return (
    <div className="text-center mt-5">
      {/* WRAPPER FOR BOTH CARDS */}
      <div id="id-card-wrapper" style={{ width: "450px", margin: "0 auto" }}>
        
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
              <div className="col-8 fw-medium text-start px-4 mt-2">
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", color: "#404040", textTransform:'uppercase' }}>
                  <span className="truncate-text" style={{ fontSize: "12px" }}>{`Full Name: ${user.firstName} ${user.lastName} ${user.middleName}`}</span>
                  <span className="truncate-text" style={{ fontSize: "12px" }}>{`State: ${user.state}`}</span>
                  <span className="truncate-text" style={{ fontSize: "12px" }}>{`LGA: ${user.lga}`}</span>
                  <span className="truncate-text" style={{ fontSize: "12px" }}>{`Ward: ${user.ward || user.Ward}`}</span>
                  
                  {/* TWO SIGNATURES AT BOTTOM */}
                  <div className="d-flex justify-content-between mt-4"style={{ 
    width: "calc(100% + 200px)", // Expands width to counteract the px-4 padding
    marginLeft: "-8px",        // Pulls the left signature to the edge
    paddingRight: "55px",        // Adjusts right alignment
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
                  className="img-thumbnail"
                  style={{ width: "120px", height: "120px", objectFit: "cover", borderColor: "#198754" }}
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
            <div className="px-4 py-3 text-center mt-3">
              <h5 className="fw-bold text-success mb-2">Important Notice</h5>
              <p style={{ fontSize: "12px", color: "#333", lineHeight: "1.6" }}>
                This card is an official property of the Labour Party (LP). 
                If found, please return to the nearest Labour Party Office or 
                to the National Secretariat at No. 2 IBM Haruna Street, Utako, Abuja.
              </p>
               <h5 style={{ fontSize: "12px",}}  className="fw-bold f-12 text-success mb-2">Signed:MGT.</h5>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <button className="btn btn-success mt-4" onClick={downloadPdf}>
        Download ID Card (PDF)
      </button>

      <div className="mt-4 text-center">
        <p className="text-muted mb-2" style={{ maxWidth: "450px", margin: "0 auto" }}>
          Download the Labour Party mobile app and scan the above Crontocode to download the ID card to your mobile phone
        </p>
        <img src={qrCode} alt="QR Code" width={120} height={120} />
      </div>
    </div>
  );
}

export default IDCard;