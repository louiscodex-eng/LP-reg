
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import logo from "./logo2.png";
// import "../App.css";
// import qrCode from './qrcode.png';
// import chairman from './senator.png'
// import secretary from './secretary.png'

// function IDCard({ user }) {
//   const downloadPdf = async () => {
//     const element = document.getElementById("id-card-wrapper");
    
//     // Temporarily remove truncation for PDF generation
//     const truncatedElements = element.querySelectorAll('.truncate-text');
//     truncatedElements.forEach(el => {
//       el.style.whiteSpace = 'normal';
//       el.style.overflow = 'visible';
//       el.style.textOverflow = 'clip';
//     });

//     const canvas = await html2canvas(element, {
//       scale: 3,
//       useCORS: true,
//       backgroundColor: "#ffffff", // Prevents black backgrounds on some PDF readers
//     });

//     // Restore truncation after PDF generation
//     truncatedElements.forEach(el => {
//       el.style.whiteSpace = 'nowrap';
//       el.style.overflow = 'hidden';
//       el.style.textOverflow = 'ellipsis';
//     });

//     const imgData = canvas.toDataURL("image/png");

//     /* CALCULATION FOR NO STRETCH:
//        Width: 450px -> 120mm
//        Height: (280 + 280 + 16 margin) = 576px -> ~155mm
//        PDF Format: [130, 170] provides a perfect "bucket" for this shape.
//     */
//     const pdf = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: [130, 170], 
//     });

//     // Parameters: imgData, type, x, y, width, height
//     // We set height to 0 to allow jsPDF to calculate it automatically based on the image ratio
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth() - 10; // 5mm margin on each side
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     pdf.addImage(imgData, "PNG", 5, 5, pdfWidth, pdfHeight);
//     pdf.save(`LP_ID_${user.regID || user.RegID}.pdf`);
//   };

//   // Common Header Component to maintain consistency
//   const CardHeader = () => (
//     <div
//       className="d-flex align-items-center mb-2 px-2 py-1 rounded"
//       style={{ backgroundColor: "#198754",marginTop:"-5px" }}
//     >
//       <img src={logo} alt="logo" style={{ 
//           width: "60px",
//           height: "60px",
//           borderRadius: "50%", // Makes it circular
//           border: "1px solid white", // White border
//           backgroundColor: "white", // Ensures no transparency gaps
//           padding: "2px", // Slight space between logo and border
//           objectFit: "contain"
//         }} />
//       <div className="flex-grow-1 text-center text-white">
//         <h2 className="mb-0 fw-bold" style={{ fontSize: "20px" }}>Labour Party(LP)</h2>
//         <i style={{ fontSize: "10px" }}>Motto: EQUAL OPPORTUNITY AND SOCIAL JUSTICE</i>
//         <div className="fw-bold" style={{ fontSize: "14px", marginTop: "1px" }}>
//           {` REG-ID: LP/${user.regID || user.RegID}`}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="text-center mt-5">
//       {/* WRAPPER FOR BOTH CARDS */}
//       <div id="id-card-wrapper" style={{ width: "450px", margin: "0 auto" }}>
        
//         {/* 🔹 FRONT CARD */}
//         <div
//           className="border border-success rounded mb-3"
//           style={{
//             width: "450px",
//             height: "280px",
//             position: "relative",
//             overflow: "hidden",
//             backgroundColor: "#f4fff6",
//           }}
//         >
//           <div style={{ position: "absolute", inset: 0, backgroundImage: `url('/logo2.png')`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", opacity: 0.15, zIndex: 1 }} />
//           <div style={{ position: "relative", zIndex: 2, padding: "10px", height: "100%" }}>
//             <CardHeader />
//             <div className="row mt-3">
//               <div className="col-8 fw-medium text-start px-4 mt-3">
//                 <div style={{ display: "flex", flexDirection: "column", gap: "4px", color: "#404040", textTransform:'uppercase' }}>
//                   <span className="truncate-text" style={{ fontSize: "12px" }}>{`Full Name: ${user.firstName} ${user.lastName} ${user.middleName}`}</span>
//                   <span className="truncate-text" style={{ fontSize: "12px" }}>{`State: ${user.state}`}</span>
//                   <span className="truncate-text" style={{ fontSize: "12px" }}>{`LGA: ${user.lga}`}</span>
//                   <span className="truncate-text" style={{ fontSize: "12px" }}>{`Ward: ${user.ward || user.Ward}`}</span>
                  
//                   {/* TWO SIGNATURES AT BOTTOM */}
//                   <div className="d-flex justify-content-between mt-1"style={{ 
//     width: "calc(100% + 200px)", // Expands width to counteract the px-4 padding
//    marginLeft: "10px",        // Pulls the left signature to the edge
//     paddingRight: "250px",        // Adjusts right alignment
//     paddingTop:"12px"
//   }} >
//                     <div className="text-center">
//                       <img src={chairman} alt="sig1" style={{ width: "80px", height: "30px", objectFit: "contain" }} />
//                       <div style={{ fontSize: "9px", color: "#666", borderTop: "1px solid #ccc", paddingTop: "1px" }}>National Chairman</div>
//                     </div>
//                     <div className="text-center">
//                       <img src={secretary} alt="sig2" style={{ width: "80px", height: "30px", objectFit: "contain" }} />
//                       <div style={{ fontSize: "9px", color: "#666", borderTop: "1px solid #ccc", paddingTop: "1px" }}>National Secretary</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* PASSPORT MOVED UP */}
//               <div className="col-4 d-flex align-items-start justify-content-center pt-1">
//                 <img
//                   src={user.passportUrl || user.PassportUrl}
//                   alt="passport"
//                   className="img-thumbnail"
//                   style={{ width: "150px", height: "130px", objectFit: "cover", borderColor: "#198754", overflow:"hidden" }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 🔹 BACK CARD */}
//         <div
//           className="border border-success rounded"
//           style={{
//             width: "450px",
//             height: "280px",
//             position: "relative",
//             overflow: "hidden",
//             backgroundColor: "#ffffff",
//           }}
//         >
//           <div style={{ position: "relative", zIndex: 2, padding: "10px", height: "100%" }}>
//         <CardHeader/>
//             <div className="px-3 py-2 text-center mt-1">
//                <p style={{ fontSize: "12px", color: "#333", lineHeight: "1.6" }}>
//               Please present your digital card and passport photograph at your respective 
//               ward offices for validation and confirmation
//               </p>
//               <h6 className="fw-bold text-success mb-1">Important Notice</h6>
//               <p style={{ fontSize: "12px", color: "#333", lineHeight: "1.6" }}>
//                 This card is an official property of the Labour Party (LP). 
//                 If found, please return to the nearest Labour Party Office or 
//                 to the National Secretariat at No. 2 IBM Haruna Street, Utako, Abuja.
//               </p>
//                <h5 style={{ fontSize: "12px",}}  className="fw-bold f-12 text-success mb-2">Signed:National Secretary</h5>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CONTROLS */}
//       <button className="btn btn-success mt-4" onClick={downloadPdf}>
//         Download ID Card (PDF)
//       </button>

//       <div className="mt-4 text-center">
//         <p className="text-muted mb-2" style={{ maxWidth: "450px", margin: "0 auto" }}>
//           Download the Labour Party mobile app and scan the above Crontocode to download the ID card to your mobile phone
//         </p>
//         <img src={qrCode} alt="QR Code" width={120} height={120} />
//       </div>
//     </div>
//   );
// }

// export default IDCard;

// import React from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import logo from "./logo2.png";
// import "../App.css";
// import qrCode from './qrcode.png';
// import chairman from './senator.png';
// import secretary from './secretary.png';

// function IDCard({ user }) {
//   const downloadPdf = async () => {
//     const element = document.getElementById("id-card-wrapper");
    
//     // Temporarily remove truncation for PDF generation
//     const truncatedElements = element.querySelectorAll('.truncate-text');
//     truncatedElements.forEach(el => {
//       el.style.whiteSpace = 'normal';
//       el.style.overflow = 'visible';
//       el.style.textOverflow = 'clip';
//     });

//     const canvas = await html2canvas(element, {
//       scale: 3,
//       useCORS: true,
//       backgroundColor: "#ffffff",
//     });

//     // Restore truncation after PDF generation
//     truncatedElements.forEach(el => {
//       el.style.whiteSpace = 'nowrap';
//       el.style.overflow = 'hidden';
//       el.style.textOverflow = 'ellipsis';
//     });

//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: [130, 170], 
//     });

//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth() - 10;
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     pdf.addImage(imgData, "PNG", 5, 5, pdfWidth, pdfHeight);
//     pdf.save(`LP_ID_${user.regID || user.RegID}.pdf`);
//   };

//   const CardHeader = () => (
//     <div
//       className="d-flex align-items-center mb-2 px-2 py-1 rounded"
//       style={{ backgroundColor: "#198754", marginTop:"-8px" }}
//     >
//       <img src={logo} alt="logo" style={{ 
//           width: "50px",
//           height: "50px",
//           borderRadius: "50%",
//           border: "1px solid white",
//           backgroundColor: "white",
//           padding: "1px",
//           objectFit: "contain"
//         }} />
//       <div className="flex-grow-1 text-center text-white">
//         <h3 className="mb-0 fw-bold" style={{ fontSize: "20px" }}>Labour Party(LP)</h3>
//         <i style={{ fontSize: "10px" }}>Motto: EQUAL OPPORTUNITY AND SOCIAL JUSTICE</i>
//         <div className="fw-bold" style={{ fontSize: "14px", marginTop: "1px" }}>
//           {` REG-ID: LP/${user.regID || user.RegID}`}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="text-center mt-5">
//       {/* WRAPPER FOR BOTH CARDS */}
//       <div id="id-card-wrapper" style={{ width: "450px", margin: "0 auto" }}>
        
//         {/* 🔹 FRONT CARD */}
//         <div
//           className="border border-success rounded mb-3"
//           style={{
//             width: "450px",
//             height: "280px",
//             position: "relative",
//             overflow: "hidden",
//             backgroundColor: "#f4fff6",
//           }}
//         >
//           <div style={{ position: "absolute", inset: 0, backgroundImage: `url('/logo2.png')`, backgroundSize: "55%", backgroundRepeat: "no-repeat", backgroundPosition: "center", opacity: 0.15, zIndex: 1 }} />
//           <div style={{ position: "relative", zIndex: 2, padding: "10px", height: "100%" }}>
//             <CardHeader />
//             <div className="row mt-2">
//               <div className="col-8 fw-medium text-start px-4  mt-1">
//                 <div style={{ display: "flex", flexDirection: "column", gap: "7px", color: "#404040", textTransform:'uppercase' }}>
//                   <span className="truncate-text" style={{ fontSize: "12px" }}>{`Full Name: ${user.firstName} ${user.lastName} ${user.middleName}`}</span>
//                   <span className="truncate-text" style={{ fontSize: "12px" }}>{`State: ${user.state}`}</span>
//                   <span className="truncate-text" style={{ fontSize: "12px" }}>{`LGA: ${user.lga}`}</span>
//                   <span className="truncate-text" style={{ fontSize: "12px" }}>{`Ward: ${user.ward || user.Ward}`}</span>
                  
//                   {/* TWO SIGNATURES AT BOTTOM */}
//                   <div className="d-flex justify-content-between mt-4" style={{ 
//                     width: "calc(100% + 200px)",
//                     marginLeft: "10px",
//                     paddingRight: "250px",
//                     paddingTop:"15px"
//                   }} >
//                     <div className="text-center">
//                       <img src={chairman} alt="sig1" style={{ width: "80px", height: "30px", objectFit: "contain" }} />
//                       <div style={{ fontSize: "9px", color: "#666", borderTop: "1px solid #ccc", paddingTop: "1px" }}>National Chairman</div>
//                     </div>
//                     <div className="text-center">
//                       <img src={secretary} alt="sig2" style={{ width: "80px", height: "30px", objectFit: "contain" }} />
//                       <div style={{ fontSize: "9px", color: "#666", borderTop: "1px solid #ccc", paddingTop: "1px" }}>National Secretary</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* 🛠️ VERTICAL STACKED PASSPORT + QR CODE */}
//               <div className="col-4 d-flex align-items-start justify-content-center pt-1 px-0">
//                 <div 
//                   style={{ 
//                     border: "4px solid #198754", 
//                     borderRadius: "10px", 
//                     overflow: "hidden", 
//                     backgroundColor: "white",
//                     display: "flex",
//                     flexDirection: "column",
//                     marginTop: "5px" 
//                   }}
//                 >
//                   {/* Passport (Top) */}
//                   <img
//                     src={user.passportUrl || user.PassportUrl}
//                     alt="passport"
//                     style={{ 
//                       width: "110px", 
//                       height: "100px", 
//                       objectFit: "cover",
//                       display: "block",
//                       borderBottom: "1px solid #198754" 
//                     }}
//                   />

//                   {/* QR Code (Bottom) */}
//                   <img 
//                     src={qrCode} 
//                     alt="Internal QR Code" 
//                     style={{
//                       width: "110px", 
//                       height: "70px", 
//                       objectFit: "contain",
//                       padding: "2px",
//                      //backgroundColor:"#198754",
//                       display: "block"
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 🔹 BACK CARD */}
//         <div
//           className="border border-success rounded"
//           style={{
//             width: "450px",
//             height: "280px",
//             position: "relative",
//             overflow: "hidden",
//             backgroundColor: "#ffffff",
//           }}
//         >
//           <div style={{ position: "relative", zHook: 2, padding: "10px", height: "100%" }}>
//             <CardHeader/>
//             <div className="px-3 py-2 text-center mt-1">
//                <p style={{ fontSize: "12px", color: "#333", lineHeight: "1.6" }}>
//                 Please present your digital card and passport photograph at your respective 
//                 ward offices for validation and confirmation
//               </p>
//               <h6 className="fw-bold text-success mb-1">Important Notice</h6>
//               <p style={{ fontSize: "12px", color: "#333", lineHeight: "1.6" }}>
//                 This card is an official property of the Labour Party (LP). 
//                 If found, please return to the nearest Labour Party Office or 
//                 to the National Secretariat at No. 2 IBM Haruna Street, Utako, Abuja.
//               </p>
//                <h5 style={{ fontSize: "12px" }} className="fw-bold f-12 text-success mb-2">Signed: National Secretary</h5>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CONTROLS */}
//       <button className="btn btn-success mt-4" onClick={downloadPdf}>
//         Download ID Card (PDF)
//       </button>

//       <div className="mt-4 text-center">
//         <p className="text-muted mb-2" style={{ maxWidth: "450px", margin: "0 auto" }}>
//           Download the Labour Party mobile app and scan the above QR code to download the ID card to your mobile phone
//         </p>
//         <img src={qrCode} alt="External QR Code" width={120} height={120} />
//       </div>
//     </div>
//   );
// }

// export default IDCard;

import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react"; // Import the QR component
import logo from "./logo2.png";
import "../App.css";
import chairman from './senator.png';
import secretary from './secretary.png';

function IDCard({ user }) {
  // The data you want encoded in the QR code (usually the RegID or a verification URL)
  const qrValue = `https://labourparty.ng/verify/${user.regID || user.RegID}`;

  const downloadPdf = async () => {
    const element = document.getElementById("id-card-wrapper");
    
    const truncatedElements = element.querySelectorAll('.truncate-text');
    truncatedElements.forEach(el => {
      el.style.whiteSpace = 'normal';
      el.style.overflow = 'visible';
      el.style.textOverflow = 'clip';
    });

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    truncatedElements.forEach(el => {
      el.style.whiteSpace = 'nowrap';
      el.style.overflow = 'hidden';
      el.style.textOverflow = 'ellipsis';
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
    pdf.save(`LP_ID_${user.regID || user.RegID}.pdf`);
  };

  const CardHeader = () => (
    <div
      className="d-flex align-items-center mb-2 px-2 py-1 rounded"
      style={{ backgroundColor: "#198754", marginTop:"-8px" }}
    >
      <img src={logo} alt="logo" style={{ 
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          border: "1px solid white",
          backgroundColor: "white",
          padding: "1px",
          objectFit: "contain"
        }} />
      <div className="flex-grow-1 text-center text-white">
        <h3 className="mb-0 fw-bold" style={{ fontSize: "18px" }}>Labour Party (LP)</h3>
        <i style={{ fontSize: "9px" }}>Motto: EQUAL OPPORTUNITY AND SOCIAL JUSTICE</i>
        <div className="fw-bold" style={{ fontSize: "13px", marginTop: "1px" }}>
          {` REG-ID: LP/${user.regID || user.RegID}`}
        </div>
      </div>
    </div>
  );

  return (
    <div className="text-center mt-5">
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
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url('/logo2.png')`, backgroundSize: "55%", backgroundRepeat: "no-repeat", backgroundPosition: "center", opacity: 0.15, zIndex: 1 }} />
          <div style={{ position: "relative", zIndex: 2, padding: "10px", height: "100%" }}>
            <CardHeader />
            <div className="row mt-2">
              <div className="col-8 fw-medium text-start px-4 mt-1">
                <div style={{ display: "flex", flexDirection: "column", gap: "7px", color: "#404040", textTransform:'uppercase' }}>
                  <span className="truncate-text" style={{ fontSize: "11px" }}>{`Name: ${user.firstName} ${user.lastName}`}</span>
                  <span className="truncate-text" style={{ fontSize: "11px" }}>{`State: ${user.state}`}</span>
                  <span className="truncate-text" style={{ fontSize: "11px" }}>{`LGA: ${user.lga}`}</span>
                  <span className="truncate-text" style={{ fontSize: "11px" }}>{`Ward: ${user.ward || user.Ward}`}</span>
                  
                  <div className="d-flex justify-content-between mt-4" style={{ 
                    width: "calc(100% + 200px)",
                    marginLeft: "0px",
                    paddingRight: "250px",
                    paddingTop:"20px"
                  }} >
                    <div className="text-center">
                      <img src={chairman} alt="sig1" style={{ width: "70px", height: "25px", objectFit: "contain" }} />
                      <div style={{ fontSize: "8px", color: "#666", borderTop: "1px solid #ccc" }}>National Chairman</div>
                    </div>
                    <div className="text-center">
                      <img src={secretary} alt="sig2" style={{ width: "70px", height: "25px", objectFit: "contain" }} />
                      <div style={{ fontSize: "8px", color: "#666", borderTop: "1px solid #ccc" }}>National Secretary</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🛠️ PASSPORT + GENERATED QR CODE */}
              <div className="col-4 d-flex align-items-start justify-content-center pt-1 px-0">
                <div 
                  style={{ 
                    border: "3px solid #198754", 
                    borderRadius: "8px", 
                    overflow: "hidden", 
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "0px" 
                  }}
                >
                  <img
                    src={user.passportUrl || user.PassportUrl}
                    alt="passport"
                    style={{ 
                      width: "110px", 
                      height: "105px", 
                      objectFit: "cover",
                      display: "block",
                      borderBottom: "2px solid #198754" 
                    }}
                  />
                  {/* Internal QR Code */}
                  <div style={{ padding: "5px", backgroundColor: "white", display: "flex", justifyContent: "center" }}>
                    <QRCodeSVG 
                        value={qrValue} 
                        size={90} // Matches width of passport roughly
                        height={60}
                        level={"H"} // High error correction for better scanning
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 BACK CARD (Kept same for consistency) */}
        <div
          className="border border-success rounded"
          style={{ width: "450px", height: "280px", position: "relative", overflow: "hidden", backgroundColor: "#ffffff" }}
        >
          <div style={{ position: "relative", zIndex: 2, padding: "10px", height: "100%" }}>
            <CardHeader/>
            <div className="px-3 py-2 text-center mt-1">
               <p style={{ fontSize: "11px", color: "#333", lineHeight: "1.4" }}>
                Please present this card at your respective ward offices for validation and confirmation.
              </p>
              <h6 className="fw-bold text-success mb-1" style={{ fontSize: "13px" }}>Important Notice</h6>
              <p style={{ fontSize: "11px", color: "#333", lineHeight: "1.4" }}>
                This card is official property of the Labour Party (LP). 
                If found, return to the National Secretariat at No. 2 IBM Haruna Street, Utako, Abuja.
              </p>
               <h5 style={{ fontSize: "11px" }} className="fw-bold text-success mt-3">Signed: National Secretary</h5>
            </div>
          </div>
        </div>
      </div>

      <button className="btn btn-success mt-4 shadow-sm" onClick={downloadPdf}>
        Download ID Card (PDF)
      </button>

      {/* 🔹 EXTERNAL QR CODE BELOW BUTTON */}
      <div className="mt-5 pb-5 text-center">
        <p className="text-muted mb-3" style={{ maxWidth: "450px", margin: "0 auto", fontSize: "14px" }}>
          Scan this QR code to verify membership or download the mobile app.
        </p>
        <div className="d-inline-block p-3 bg-white border rounded shadow-sm">
            <QRCodeSVG value={qrValue} size={150} />
        </div>
      </div>
    </div>
  );
}

export default IDCard;