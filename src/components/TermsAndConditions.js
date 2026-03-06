import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt, FaUserLock } from 'react-icons/fa';

const TermsAndConditions = () => {
  const navigate = useNavigate();
// const handleBack = () => {
//   // Check if there is a page to go back to
//   if (window.history.length > 1) {
//     navigate(-1);
//   } else {
//     // If opened in a new tab, redirect specifically to registration
//     navigate("/register"); 
//   }
// };
  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Sticky Header */}
      <div className="bg-white border-bottom sticky-top py-3 shadow-sm">
        <div className="container d-flex align-items-center">
          <button onClick={() => navigate(-1)} className="btn btn-link text-success p-0 me-3">
            <FaArrowLeft size={20} />
          </button>
          <h5 className="mb-0 fw-bold text-dark">Legal Agreements</h5>
        </div>
      </div>

      <div className="container mt-4" style={{ maxWidth: '800px' }}>
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="bg-success p-4 text-white text-center">
            <FaShieldAlt size={40} className="mb-3" />
            <h2 className="fw-bold">Consent Terms & Privacy Policy</h2>
            <p className="mb-0 opacity-75">Labour Party Nigeria Online Registration Portal</p>
          </div>

          <div className="card-body p-4 p-md-5 bg-white text-secondary" style={{ lineHeight: '1.7' }}>
            
            <section className="mb-5">
              <h4 className="text-dark fw-bold border-start border-4 border-success ps-3 mb-4">
                1. Acceptance of Terms
              </h4>
              <p>By completing your registration, you confirm that:</p>
              <ul className="list-group list-group-flush">
                <li className="list-group-item border-0 ps-0"><span className="text-success me-2">✓</span> You are at least 18 years old.</li>
                <li className="list-group-item border-0 ps-0"><span className="text-success me-2">✓</span> You have read and freely agree to these terms.</li>
                <li className="list-group-item border-0 ps-0"><span className="text-success me-2">✓</span> You consent to data processing under the NDPA 2023.</li>
              </ul>
            </section>

            <section className="mb-5">
              <h4 className="text-dark fw-bold border-start border-4 border-success ps-3 mb-4">
                2. Data Processing & Consent
              </h4>
              <p>We process your data for membership verification, secure account maintenance, and Party communications. Joining a political party reveals <strong>sensitive personal data</strong> (political opinions). By registering, you expressly consent to this processing solely for fulfilling membership rights.</p>
            </section>

            <div className="alert alert-info border-0 rounded-3 d-flex align-items-center">
              <FaUserLock className="me-3" size={30} />
              <div>
                <h6 className="fw-bold mb-1">Your Privacy is Protected</h6>
                <p className="small mb-0">Your data is stored on secure servers in Nigeria with industry-standard encryption.</p>
              </div>
            </div>

            <section className="mt-5 mb-5">
              <h4 className="text-dark fw-bold border-start border-4 border-success ps-3 mb-4">
                3. Your Rights
              </h4>
              <p>Under the NDPA 2023, you have the right to:</p>
              <div className="row g-3">
                {['Access Data', 'Correct Errors', 'Request Deletion', 'Withdraw Consent'].map((right, i) => (
                  <div className="col-6 col-md-3 text-center" key={i}>
                    <div className="p-2 border rounded-3 small bg-light">{right}</div>
                  </div>
                ))}
              </div>
            </section>

            <hr className="my-5" />

            <section className="mb-4">
              <h4 className="text-dark fw-bold mb-3">Contact Information</h4>
              <p className="mb-1"><strong>Address:</strong> No. 2 IBM Haruna Street, Utako, Abuja FCT, Nigeria.</p>
              <p className="mb-1"><strong>Email:</strong> dataprotection@labourparty.com.ng</p>
              <p><strong>Phone:</strong> +234 906 000 3171</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;