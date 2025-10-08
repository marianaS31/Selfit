import React from 'react';
import '../../styles/footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-creators">
          <span className="footer-creators-text">Selfit</span>
          <span className="footer-copyright">
            © {currentYear} All rights reserved
          </span>
        </div>

        <div className="footer-links">
          <a href="" className="footer-link">
            About
          </a>
          <a href="" className="footer-link">
            Privacy Policy
          </a>
          <a href="" className="footer-link">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
