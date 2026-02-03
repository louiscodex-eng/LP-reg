import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import logo from "./logo2.png";
//import app.css
import "../App.css";

function IDCard({ user }) {
  const downloadPdf = async () => {
    const element = document.getElementById("id-card");

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [125, 65],
    });

    pdf.addImage(imgData, "PNG", 0, 0, 125, 65);
    pdf.save("labour-party-id-card.pdf");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  return (
  <div className="text-center mt-5">
    {/* ID CARD WRAPPER */}
    <div
      className="border border-success rounded mx-auto"
      style={{
        width: "515px",
        height: "280px",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#f4fff6",
      }}
    >
      {/* 🔹 BACKGROUND IMAGE LAYER */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('/logo2.png')`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.15, // 👈 ONLY background is faded
          zIndex: 1,
        }}
      />

      {/* 🔹 CARD CONTENT (FULL OPACITY) */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "12px",
          height: "100%",
        }}
      >
        {/* HEADER */}
        <div
          className="d-flex align-items-center mb-3 px-2 py-1 rounded"
          style={{ backgroundColor: "#198754" }}
        >
          {/* LOGO */}
          <img src={logo} alt="logo" style={{ width: "65px" }} />

          {/* TITLE */}
          <div className="flex-grow-1 text-center text-white">
            <h2 className="mb-0 fw-bold">LABOUR PARTY</h2>
            <small>Forward Ever!!</small>
          </div>
        </div>

        {/* BODY */}
        <div className="row">
          {/* DETAILS */}
          <div className="col-8">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "14px",
              }}
            >
              {/* ROW 1 */}
              <div style={{ display: "flex" }}>
                <span style={{ flex: "0 1 45%" }}>
                  <span className="fw-bold text-success">Name: </span>
                  <span>
                    {user.firstName || user.FirstName}{" "}
                    {user.lastName || user.LastName}
                  </span>
                </span>
                <span>
                  <span style={{ flex: "0 0 75%" }}>
                    <span
                      style={{ marginLeft: "30px" }}
                      className="fw-bold text-success"
                    >
                      NIN:{" "}
                    </span>
                    <span>{user.niN || user.NiN}</span>
                  </span>
                </span>
              </div>

              {/* ROW 2 */}
              <div style={{ display: "flex" }}>
                <span style={{ flex: "0 0 50%" }}>
                  <span className="fw-bold text-success">RegID: </span>
                  <span>{user.regID || user.RegID}</span>
                </span>
                <span>
                  <span
                    style={{ marginLeft: "15px" }}
                    className="fw-bold text-success"
                  >
                    State:{" "}
                  </span>
                  <span>{user.state || user.State}</span>
                </span>
              </div>

              {/* ROW 3 */}
              <div style={{ display: "flex" }}>
                <span style={{ flex: "0 0 50%",marginLeft: "-24px" }}>
                  <span className="fw-bold text-success">LGA: </span>
                  <span>{user.lga || user.LGA}</span>
                </span>
                <span>
                  <span
                    style={{ paddingLeft: "39px" }}
                    className="fw-bold text-success"
                  >
                    Ward:{" "}
                  </span>
                  <span>{user.ward || user.Ward}</span>
                </span>
              </div>

              {/* ROW 4 */}
              <div style={{ display: "flex" }}>
                <span style={{ flex: "0 0 48%",marginLeft: "-12px" }}>
                  <span className="fw-bold text-success">DOB: </span>
                  <span>{formatDate(user.dob || user.DOB)}</span>
                </span>
                <span>
                  <span
                    style={{ marginLeft: "34px" }}
                    className="fw-bold text-success"
                  >
                    Gender:{" "}
                  </span>
                  <span>{user.gender || user.Gender}</span>
                </span>
              </div>
            </div>
          </div>

          {/* PASSPORT */}
          <div className="col-4 d-flex align-items-end justify-content-center">
            <img
              src={user.passportUrl || user.PassportUrl}
              alt="passport"
              className="img-thumbnail"
              style={{
                width: "130px",
                height: "120px",
                objectFit: "cover",
                borderColor: "#198754",
              }}
            />
          </div>
        </div>
      </div>
    </div>

      {/* DOWNLOAD */}
      <button className="btn btn-success mt-3" onClick={downloadPdf}>
        Download ID Card (PDF)
      </button>

      {/* QR CODE - Moved below download button */}
      <div className="mt-3">
        <p className="text-muted mb-2">Scan QR Code:</p>
        <QRCodeCanvas
          value={user.regID || user.RegID}
          size={120}
          bgColor="#ffffff"
          fgColor="#198754"
        />
      </div>
    </div>
  );
}

export default IDCard;