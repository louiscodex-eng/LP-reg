import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt, FaUserLock, FaFileContract, FaCheckCircle } from 'react-icons/fa';

const TermsAndConditions = () => {
  const navigate = useNavigate();

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

      <div className="container mt-4" style={{ maxWidth: '850px' }}>
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          {/* Hero Section */}
          <div className="bg-success p-4 text-white text-center">
            <FaShieldAlt size={40} className="mb-3" />
            <h2 className="fw-bold">Privacy Notice & Consent Terms</h2>
            <p className="mb-0 opacity-75">Labour Party (LP) E-Registration Membership Portal</p>
          </div>

          <div className="card-body p-4 p-md-5 bg-white text-secondary" style={{ lineHeight: '1.7' }}>
            
            {/* 1. Privacy Notice Section */}
            <section className="mb-5">
              <h4 className="text-dark fw-bold border-start border-4 border-success ps-3 mb-4">
                PRIVACY NOTICE - Your Privacy Matters
              </h4>
              <p>
                <strong>LABOUR PARTY (LP)</strong> collects and processes your personal information through this Electronic Membership Registration Portal for lawful Party purposes and in compliance with the <strong>Nigeria Data Protection Act (NDPA) 2023</strong>.
              </p>
              
              <div className="mt-4">
                <h6 className="fw-bold text-dark">What We Collect:</h6>
                <p className="small">We collect data on your full name, date of birth, gender, address, state, LGA, Ward, marital status, NIN, voters’ card number, phone number, email, occupation, passport photograph, name of polling unit and any other information required for lawful political party membership registration.</p>
              </div>

              <div className="mt-4">
                <h6 className="fw-bold text-dark">Why We Collect Your Data:</h6>
                <p className="small">We collect members' data in strict compliance with the extant provisions of <strong>section 77(2) of the Electoral Act, 2026</strong>. It is used to:</p>
                <ul className="small list-unstyled ps-2">
                  <li>• Process and verify your membership of the Labour Party.</li>
                  <li>• Maintain an accurate membership database and digital register for the Party and INEC records.</li>
                  <li>• Communicate official Party information and activities.</li>
                  <li>• Internal statistical and strategic planning purposes.</li>
                  <li>• Comply with extant regulatory requirements.</li>
                </ul>
              </div>
            </section>

            {/* 2. Data Protection Guarantees */}
            <div className="alert alert-info border-0 rounded-3 mb-5">
              <div className="d-flex align-items-start">
                <FaUserLock className="me-3 mt-1" size={24} />
                <div>
                  <h6 className="fw-bold mb-1">Data Protection Guarantees</h6>
                  <p className="small mb-0">
                    We implement appropriate security safeguards. Your data will not be sold or shared for commercial purposes. Access is restricted to authorized Party officials at Ward, LGA, State, and National levels as necessary.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Rights Section */}
            <section className="mb-5">
              <h4 className="text-dark fw-bold border-start border-4 border-success ps-3 mb-4">
                Your Rights as a Member
              </h4>
              <p className="small">Under the E-Registration Membership Portal, you may:</p>
              <div className="row g-2 mb-3">
                {['Access Data', 'Update/Correct Data', 'Withdraw Consent'].map((right, i) => (
                  <div className="col-12 col-md-4" key={i}>
                    <div className="p-2 border rounded-3 small bg-light text-center">{right}</div>
                  </div>
                ))}
              </div>
              <p className="small italic text-muted">
                *Note: Withdrawal of consent is subject to membership status implications. Data is retained as long as membership remains valid or as required by law.
              </p>
            </section>

            <hr className="my-5" />

            {/* 4. Consent Terms */}
            <section className="mb-5 p-4 rounded-4 bg-light border-start border-4 border-warning">
              <div className="d-flex align-items-center mb-3">
                <FaFileContract className="text-warning me-2" size={24} />
                <h4 className="text-dark fw-bold mb-0">CONSENT TERMS</h4>
              </div>
              <p className="small mb-3">By registering on this Portal, you confirm that:</p>
              <div className="d-flex flex-column gap-2">
                {[
                  "I am applying voluntarily for membership.",
                  "The information I provided is true and accurate.",
                  "I consent to the collection and processing of my personal data for legitimate Party purposes.",
                  "I agree to receive official Party communications (SMS, email, phone, physical visit).",
                  "I agree to abide by the Party’s Constitution, rules, and regulations.",
                  "I have read and understood the Privacy Notice."
                ].map((term, index) => (
                  <div key={index} className="d-flex align-items-start small">
                    <FaCheckCircle className="text-success me-2 mt-1" size={14} />
                    <span>{term}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-white border rounded-3 text-center">
                <p className="small fw-bold mb-0 text-success">
                  Submitting the registration form constitutes your electronic consent.
                </p>
              </div>
            </section>

            {/* 5. Contact Info */}
            <section className="bg-dark text-white p-4 rounded-4">
              <h5 className="fw-bold mb-3">Contact Information</h5>
              <div className="row small">
                <div className="col-md-6 mb-3 mb-md-0">
                  <p className="mb-1 opacity-75"><strong>Email:</strong></p>
                  <p>lpnationalsecretariat@gmail.com</p>
                  <p className="mb-1 opacity-75 mt-2"><strong>Official Lines:</strong></p>
                  <p>08111114742, 07041004783</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1 opacity-75"><strong>National Secretariat:</strong></p>
                  <p>No. 2 IBM Haruna Street, Utako District, Abuja, Nigeria.</p>
                </div>
              </div>
            </section>

            <div className="text-center mt-5">
              <p className="small text-muted mb-0">
                By using this Portal, you acknowledge that you have read and understood this Privacy Notice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;