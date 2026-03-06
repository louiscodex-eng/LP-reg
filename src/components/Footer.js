import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import logo from './logo2.png'; // Adjust path based on your folder structure

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="row gy-4">
          
          {/* Section 1: Brand & Motto */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <img src={logo} alt="LP Logo" style={{ width: '50px', marginRight: '10px' }} />
              <h5 className="fw-bold mb-0">Labour Party (LP)</h5>
            </div>
            <p className="small text-muted" style={{ lineHeight: '1.6' }}>
              Motto: Equal Opportunity and Social Justice. <br />
              Building a new Nigeria where every citizen has a voice and a future.
            </p>
            {/* Replace the # with actual links or use "javascript:void(0)" */}
<div className="d-flex gap-3 mt-3">
  <a href="https://facebook.com/labourparty" target="_blank" rel="noreferrer" className="text-white-50">
    <FaFacebook size={20} />
  </a>
  <a href="https://twitter.com/labourparty" target="_blank" rel="noreferrer" className="text-white-50">
    <FaTwitter size={20} />
  </a>
  <a href="https://instagram.com/labourparty" target="_blank" rel="noreferrer" className="text-white-50">
    <FaInstagram size={20} />
  </a>
</div>
          </div>

          {/* Section 2: Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 border-bottom border-success pb-2 w-50">Quick Links</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/login" className="text-white-50 text-decoration-none">Login</Link></li>
              <li className="mb-2"><Link to="/register" className="text-white-50 text-decoration-none">Register</Link></li>
              <li className="mb-2"><Link to="/terms" className="text-white-50 text-decoration-none">Privacy Policy</Link></li>
              <li className="mb-2"><Link to="/reset-password" className="text-white-50 text-decoration-none">Reset Password</Link></li>
            </ul>
          </div>

          {/* Section 3: Contact Info */}
          <div className="col-lg-4 col-md-12">
            <h6 className="fw-bold mb-3 border-bottom border-success pb-2 w-25">Contact Us</h6>
            <div className="small">
              <p className="mb-2 d-flex align-items-center text-white-50">
                <FaMapMarkerAlt className="me-2 text-success" />
                No. 2 IBM Haruna Street, Utako District, Abuja.
              </p>
              <p className="mb-2 d-flex align-items-center text-white-50">
                <FaEnvelope className="me-2 text-success" />
                lpnationalsecretariat@gmail.com
              </p>
              <p className="mb-0 d-flex align-items-center text-white-50">
                <FaPhoneAlt className="me-2 text-success" />
                08111114742, 07041004783
              </p>
            </div>
          </div>
        </div>

        <hr className="my-4 opacity-25" />

        {/* Bottom Bar */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="small mb-0 text-white-50">
              © {currentYear} Labour Party Nigeria. All Rights Reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
            <p className="small mb-0 text-muted" style={{ fontSize: '11px' }}>
              Compliant with NDPA 2023 & Electoral Act 2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;