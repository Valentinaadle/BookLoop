import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="footer-section">

        <div className="footer-box">
          <div className="footer-title">
            <img src="/icons/libroa.png" className="iconf" alt="Bookshop icon" />
            <h4>BOOKSHOP</h4>
          </div>
          <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod incididunt ut laoreet dolore.</p>
          <Link to="#">Learn More About Us</Link>
        </div>

        <div className="footer-box">
          <div className="footer-title">
            <img src="/icons/brujula.png" className="iconf" alt="Compass icon" />
            <h4>OUR MAIN OFFICE</h4>
          </div>
          <p>San Francisco, California, US</p>
          <p>P.O. BOX: 55300</p>
          <p>Phone: (+1) 998 5364</p>
          <p>Mail: admin@bookshop.com</p>
        </div>

        <div className="footer-box">
          <div className="footer-title">
            <img src="/icons/lupa.png" className="iconf" alt="Social media icon" />
            <h4>KEEP IN TOUCH WITH US</h4>
          </div>
          <Link to="#">Facebook</Link>
          <Link to="#">Twitter</Link>
          <Link to="#">Google Plus</Link>
        </div>

        <div className="footer-box">
          <div className="footer-title">
            <img src="/icons/i.png" className="iconf" alt="Information icon" />
            <h4>INFORMATIONS</h4>
          </div>
          <div className="info-columns">
            <div className="links-column">
              <Link to="#">About Us</Link>
              <Link to="#">Contact Us</Link>
              <Link to="#">FAQ</Link>
            </div>
            <div className="links-column">
              <Link to="#">Terms & Conditions</Link>
              <Link to="/profile">My Account</Link>
              <Link to="#">Blog</Link>
            </div>
          </div>
        </div>

      </div>

      <p className="copyright">
        © 2025 Bookshop Pty Ltd. ALL RIGHTS RESERVED
      </p>
    </footer>
  );
}
