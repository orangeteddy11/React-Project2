// Bookings.js: loads all repair bookings from Supabase and displays them
// with search, filter (by city) and sort options.
import { useState, useEffect } from 'react';
import { supabase } from './include/supabaseClient';

// Business contact details shown on every booking
const BUSINESS = {
  name: 'Phone Fix Ltd',
  phone: '06 123 4567',
  email: 'bookings@phonefix.example',
  address: '1 Example Street, Your City 4000',
  card: 'Phone Fix Ltd | Repairs & Courtesy Phones | www.phonefix.example'
};

// Formatting helpers
const money = (n) => `$${Number(n || 0).toFixed(2)}`;
// Job number built from the unique booking id, e.g. PF-00001
const jobNumber = (id) => `PF-${String(id).padStart(5, '0')}`;

const formatDate = (d) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-NZ') : '-');

// Invoice date and time, time in 24-hour format
const formatInvoice = (timestamp) => {
  const d = new Date(timestamp);
  const date = d.toLocaleDateString('en-NZ');
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  return `${date} ${time}`;
};

// Repair date and time, time in 12-hour format with AM/PM
const formatRepair = (date, time) => {
  if (!date) return '-';
  if (!time) return formatDate(date);
  const t = new Date(`${date}T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${formatDate(date)} ${t}`;
};

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('first_name');

  // Fetch all bookings from Supabase once, when the page loads
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('bookings').select('*');
        if (error) throw error;
        setBookings(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Unique list of cities for the filter dropdown
  const cities = [...new Set(bookings.map(b => b.city).filter(Boolean))].sort();
  const keyword = search.trim().toLowerCase();

  // Apply the city filter, then the keyword search, then the sort order
  const visible = bookings
    .filter(b => cityFilter === 'all' || b.city === cityFilter)
    .filter(b =>
      !keyword ||
      [jobNumber(b.id), b.first_name, b.last_name, b.city, b.email, b.make, b.fault_category, b.description]
        .some(v => (v || '').toLowerCase().includes(keyword))
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      return (a[sortBy] || '').localeCompare(b[sortBy] || '');
    });

  return (<>
    <div className="container-fluid p-4" style={{ minHeight: '60vh', backgroundColor: '#FFF3CD' }}>
      <h1>BOOKINGS</h1>

      {/* Search, filter and sort controls */}
      <div className="row g-3 align-items-center mb-3">
        <div className="col-12 col-md-4">
          <div className="input-group">
            <span className="input-group-text fw-bold">Search</span>
            <input className="form-control" type="text" placeholder="keyword or job number" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="input-group">
            <span className="input-group-text fw-bold">Filter by</span>
            <select className="form-select" value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
              <option value="all">All cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="input-group">
            <span className="input-group-text fw-bold">Sort by</span>
            <select className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="first_name">First name</option>
              <option value="last_name">Last name</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading, error, or the list of booking job sheets */}
      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (<>
        <p className="text-muted">{visible.length} of {bookings.length} bookings</p>
        {visible.map(b => (
          <div key={b.id} className="border border-dark rounded mb-4 bg-white">
            <div className="d-flex flex-wrap justify-content-between bg-dark text-white p-3 rounded-top">
              <h5 className="m-0">Job No: {jobNumber(b.id)}</h5>
              <span>Invoice date: {formatInvoice(b.created_at)}</span>
            </div>
            <div className="row g-0 p-3">
              <div className="col-12 col-lg-4 pe-lg-3">
                <h6 className="fw-bold">Customer Details</h6>
                <p className="m-0">{b.title} {b.first_name} {b.last_name} ({b.customertype})</p>
                <p className="m-0">{[b.street, b.suburb, b.city, b.post_code].filter(Boolean).join(', ')}</p>
                <p className="m-0">Phone: {b.phone || '-'}</p>
                <p className="m-0">Email: {b.email || '-'}</p>
              </div>
              <div className="col-12 col-lg-4 pe-lg-3 mt-3 mt-lg-0">
                <h6 className="fw-bold">Repair Details</h6>
                <p className="m-0">Purchase date: {formatDate(b.purchase_date)}</p>
                <p className="m-0">Repair date/time: {formatRepair(b.repair_date, b.repair_time)}</p>
                <p className="m-0">Under warranty: {b.warranty ? 'Yes' : 'No'}</p>
                <p className="m-0">IMEI: {b.imei || '-'}</p>
                <p className="m-0">Phone: {b.make || '-'} {b.model_number || ''}</p>
                <p className="m-0">Fault: {b.fault_category || '-'}</p>
                <p className="m-0">Description: {b.description || '-'}</p>
              </div>
              <div className="col-12 col-lg-4 mt-3 mt-lg-0">
                <h6 className="fw-bold">Courtesy Items & Cost</h6>
                <p className="m-0">Borrowed: {[b.phone_borrow, b.charger_borrow].filter(Boolean).join(', ') || 'None'}</p>
                <p className="m-0">Bond: {money(b.bond)}</p>
                <p className="m-0">Service fee: {money(b.service)}</p>
                <p className="m-0">Total: {money(b.total)}</p>
                <p className="m-0">GST: {money(b.gst)}</p>
                <p className="m-0 fw-bold">Total (+GST): {money(b.total_gst)}</p>
              </div>
            </div>
            {/* Business contact details */}
            <div className="border-top bg-light p-3 rounded-bottom small">
              <strong>{BUSINESS.name}</strong> | Phone: {BUSINESS.phone} | Email: {BUSINESS.email} | {BUSINESS.address}
              <div className="text-muted">{BUSINESS.card}</div>
            </div>
          </div>
        ))}
      </>)}
    </div>
  </>);
}

export default Bookings;
