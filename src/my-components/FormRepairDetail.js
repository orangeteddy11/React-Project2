// FormRepairDetail.js: repair section of the booking form (dates, warranty, IMEI, phone and fault).
// Field values are collected in state and sent up to the parent (Home.js).
import { useState, useEffect } from 'react';

// Converts a Date to "YYYY-MM-DD" using local time (toISOString would use UTC)
const toDateString = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

function FormRepairDetail({ warranty, setWarranty, sendRepairDetails }) {
  const [purchaseDate, setPurchaseDate] = useState('');
  const [repairDetails, setRepairDetails] = useState({ make: 'Apple', faultCategory: 'Battery' });

  // Store each field under its input name as the user types
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRepairDetails(prev => ({ ...prev, [name]: value }));
  };

  // Pass the collected details to the parent whenever they change
  useEffect(() => {
    sendRepairDetails(repairDetails);
  }, [repairDetails]);

  // Date rules
  const now = new Date();
  const today = toDateString(now);

  // Warranty is only available if the phone was bought within the last 24 months
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - 24);
  const warrantyCutoff = toDateString(cutoff);
  const warrantyExpired = purchaseDate !== '' && purchaseDate < warrantyCutoff;

  // Repair date must be today or later, and after the purchase date
  let minRepair = today;
  if (purchaseDate) {
    const next = new Date(`${purchaseDate}T00:00:00`);
    next.setDate(next.getDate() + 1);
    const nextDay = toDateString(next);
    if (nextDay > minRepair) minRepair = nextDay;
  }

  // Purchase date also needs its own state to drive the warranty checkbox
  const changePurchase = (e) => {
    const value = e.target.value;
    setPurchaseDate(value);
    setRepairDetails(prev => ({ ...prev, purchaseDate: value }));
    // Untick warranty if the purchase is older than 24 months
    if (value !== '' && value < warrantyCutoff) setWarranty(false);
  };

  return (<>
    <h2>Repair Details</h2>
    {/* Purchase date cannot be in the future */}
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Purchase Date *</label>
      <input className="col-12 col-md-12 col-lg-7" type="date" name="purchaseDate" max={today} value={purchaseDate} onChange={changePurchase} required />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Repair Date *</label>
      <input onChange={handleChange} className="col-12 col-md-12 col-lg-7" type="date" name="repairDate" min={minRepair} required />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Repair Time *</label>
      <input onChange={handleChange} className="col-12 col-md-12 col-lg-7" type="time" name="repairTime" required />
    </div>
    {/* Warranty checkbox is disabled when the purchase is over 24 months old */}
    <div className="row">
      <fieldset className="border border-primary col-12 col-lg-11 ms-1 me-4 mb-3">
        <legend className="col-11 float-none w-auto">Under Warranty</legend>
        <div>
          <label className="col-12 col-md-12 col-lg-4">Warranty</label>
          <input type="checkbox" checked={warranty} disabled={warrantyExpired} onChange={e => setWarranty(e.target.checked)} />
          {warrantyExpired && <small className="text-danger ms-2">Over 24 months</small>}
        </div>
      </fieldset>
    </div>
    {/* IMEI: exactly 15 digits */}
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">IMEI Number *</label>
      <input onChange={handleChange} className="col-12 col-md-12 col-lg-7" type="text" name="imei" inputMode="numeric" pattern="[0-9]{15}" maxLength={15} title="15 digit IMEI number" required />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Make *</label>
      <select onChange={handleChange} className="col-12 col-md-12 col-lg-7" name="make" defaultValue="Apple" required>
        <option value="Apple">Apple</option>
        <option value="LG">LG</option>
        <option value="Motorola">Motorola</option>
        <option value="Nokia">Nokia</option>
        <option value="Samsung">Samsung</option>
        <option value="Sony">Sony</option>
        <option value="Other">Other</option>
      </select>
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Model Number</label>
      <input onChange={handleChange} className="col-12 col-md-12 col-lg-7" type="text" name="modelNumber" />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Fault Category *</label>
      <select onChange={handleChange} className="col-12 col-md-12 col-lg-7" name="faultCategory" defaultValue="Battery" required>
        <option value="Battery">Battery</option>
        <option value="Charging">Charging</option>
        <option value="Screen">Screen</option>
        <option value="SD-storage">SD-storage</option>
        <option value="Software">Software</option>
        <option value="Other">Other</option>
      </select>
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Description *</label>
      <textarea onChange={handleChange} className="col-12 col-md-12 col-lg-7" name="description" rows={4} required />
    </div>
  </>);
}

export default FormRepairDetail;
