// Header.js: site title and navigation buttons shown on every page.
import { Link, useLocation } from 'react-router-dom';

// Navigation buttons: path and label
const links = [
  { to: '/', label: 'HOME' },
  { to: '/advancedJS', label: 'EXTENSION' },
  { to: '/faq', label: 'FAQ' },
  { to: '/bookings', label: 'BOOKINGS' }
];

const headerStyle = {
  minHeight: '15vh',
  backgroundColor: '#2C3E50'
};

function Header() {
  // Current URL path, used to highlight the active page button
  const { pathname } = useLocation();

  return (
    <header className="row m-0" style={headerStyle}>
      <div className="col-12 col-lg-8 d-flex align-items-center justify-content-center text-center text-white display-5 py-3">
        Phone Fix Booking System
      </div>
      <div className="col-12 col-lg-4 p-0 d-flex align-items-start">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex-fill text-center text-decoration-none border border-dark py-1 ${pathname === link.to ? 'bg-warning text-dark' : 'bg-info text-white'}`}
            style={{ fontSize: '0.8em' }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

export default Header;
