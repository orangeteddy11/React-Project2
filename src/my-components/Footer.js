// Footer.js: simple footer shown on every page.
const footerStyle = {
  minHeight: '10vh',
  fontSize: '1.2em',
  color: 'white',
  backgroundColor: '#2C3E50',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

function Footer() {
  return (
    <footer style={footerStyle}>
      <p className="text-center m-0">Advanced Web App Development. @2026.</p>
    </footer>
  );
}

export default Footer;
