// Invoice.js: printable booking sheet for a single booking.
// The booking data arrives through the router's navigation state.
import { useLocation, Link } from 'react-router-dom';

const formatDate = (d) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-NZ') : '-');
const money = (n) => `$${n.toFixed(2)}`;

// One label/value row of an invoice table
function Row({ label, value }) {
  return (
    <tr>
      <th style={{ width: '40%' }}>{label}</th>
      <td>{value || '-'}</td>
    </tr>
  );
}

function Invoice() {
  // Booking data passed in from the form (b is undefined if the page is opened directly)
  const { state: b } = useLocation();

  // No booking data: show a message and a link back to the form
  if (!b) {
    return (
      <div className="p-4 text-center" style={{ minHeight: '60vh' }}>
        <h1>Booking Sheet</h1>
        <p>No booking yet.</p>
        <Link to="/" className="btn btn-dark">MAKE A BOOKING</Link>
      </div>
    );
  }

  const address = [b.street, b.suburb, b.city, b.postCode].filter(Boolean).join(', ');

  return (<>
    <div className="container my-4" style={{ minHeight: '60vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="m-0">Booking Sheet</h1>
        <span>Booked: {new Date().toLocaleDateString('en-NZ')}</span>
      </div>
      <div className="row g-3">
        {/* Customer details */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header fw-bold">Customer Details</div>
            <table className="table m-0">
              <tbody>
                <Row label="Customer Type" value={b.customerType === 'business' ? 'Business' : 'Customer'} />
                <Row label="Name" value={`${b.title} ${b.firstName} ${b.lastName}`} />
                <Row label="Address" value={address} />
                <Row label="Phone" value={b.phone} />
                <Row label="Email" value={b.email} />
              </tbody>
            </table>
          </div>
        </div>
        {/* Repair details */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header fw-bold">Repair Details</div>
            <table className="table m-0">
              <tbody>
                <Row label="Purchase Date" value={formatDate(b.purchaseDate)} />
                <Row label="Repair Date" value={formatDate(b.repairDate)} />
                <Row label="Under Warranty" value={b.warranty ? 'Yes' : 'No'} />
                <Row label="IMEI" value={b.imei} />
                <Row label="Make" value={b.make} />
                <Row label="Model" value={b.modelNumber} />
                <Row label="Fault Category" value={b.faultCategory} />
                <Row label="Description" value={b.description} />
              </tbody>
            </table>
          </div>
        </div>
        {/* Borrowed courtesy items */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header fw-bold">Courtesy Items</div>
            <table className="table m-0">
              <tbody>
                {b.items.length === 0 ? (
                  <tr>
                    <td className="text-muted">No items borrowed</td>
                  </tr>
                ) : b.items.map(item => (
                  <Row key={item.id} label={item.name} value={money(item.bond)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Cost summary */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header fw-bold">Cost</div>
            <table className="table m-0">
              <tbody>
                <Row label="Bond" value={money(b.bond)} />
                <Row label="Service Fee" value={money(b.serviceFee)} />
                <Row label="Total" value={money(b.total)} />
                <Row label="GST (15%)" value={money(b.gst)} />
                <Row label="Total (+GST)" value={money(b.totalGst)} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <button type="button" className="btn btn-outline-dark me-2" onClick={() => window.print()}>PRINT</button>
        <Link to="/" className="btn btn-dark">NEW BOOKING</Link>
      </div>
    </div>
  </>);
}

export default Invoice;
