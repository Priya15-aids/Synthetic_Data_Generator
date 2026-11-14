import { FiDatabase } from 'react-icons/fi';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <FiDatabase />
          <span>SynthData</span>
        </div>
        <p className="footer-text">
          &copy; {new Date().getFullYear()} SynthData. Built for data-driven innovation.
        </p>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;