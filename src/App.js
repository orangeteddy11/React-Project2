// App.js: root component. Sets up the shared layout (Header/Footer) and the page routes.
// HashRouter is used so the routes also work on GitHub Pages.
import './App.css';
import Header from './my-components/Header';
import Footer from './my-components/Footer';
import Home from './my-components/Home';
import AdvancedJS from './my-components/AdvancedJS';
import FAQ from './my-components/FAQ';
import Invoice from './my-components/Invoice';
import Bookings from './my-components/Bookings';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Header />
      {/* Only the matching route is rendered between the header and footer */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/advancedJS" element={<AdvancedJS />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/invoice" element={<Invoice />} />
        {/* Old booking sheet URL now redirects to the homepage form */}
        <Route path="/repairbookingsheet" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}

export default App;