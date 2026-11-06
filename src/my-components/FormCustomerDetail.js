// FormCustomerDetail.js: customer section of the booking form.
// Field values are collected in state and sent up to the parent (Home.js).
// Validation uses HTML5 attributes (required, pattern, type).
import { useState, useEffect } from 'react';

function FormCustomerDetail({ customerType, setCustomerType, sendCustomerDetails }) {
  const [customerDetails, setCustomerDetails] = useState({ title: 'Mr' });

  // Store each field under its input name as the user types
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
  };

  // Pass the collected details to the parent whenever they change
  useEffect(() => {
    sendCustomerDetails(customerDetails);
  }, [customerDetails]);

  return (<>
    <h2>Customer Details</h2>
    {/* Customer type is kept in the parent because it affects the bond and service fee */}
    <div className="row">
      <fieldset className="border border-primary col-12 col-lg-11 ms-2 me-4">
        <legend className="col-11 float-none w-auto">Customer type *</legend>
        <div>
          <label className="col-12 col-md-12 col-lg-4">Customer</label>
          <input type="radio" name="customerType" value="customer" checked={customerType === 'customer'} onChange={e => setCustomerType(e.target.value)} />
        </div>
        <div>
          <label className="col-12 col-md-12 col-lg-4">Business</label>
          <input type="radio" name="customerType" value="business" checked={customerType === 'business'} onChange={e => setCustomerType(e.target.value)} />
        </div>
      </fieldset>
    </div>
    <div className="row mt-2">
      <label className="col-12 col-md-12 col-lg-4">Title *</label>
      <select onChange={handleChange} className="col-12 col-md-12 col-lg-7" name="title" defaultValue="Mr" required>
        <option value="Mr">Mr</option>
        <option value="Mrs">Mrs</option>
        <option value="Ms">Ms</option>
        <option value="Miss">Miss</option>
        <option value="Dr">Dr</option>
      </select>
    </div>
    {/* Names: letters, spaces and - only */}
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">First Name *</label>
      <input onChange={handleChange} className="col-12 col-md-12 col-lg-7" type="text" name="firstName" pattern="[A-Za-z \-]+" title="Letters, spaces and - only" required />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Last Name *</label>
      <input onChange={handleChange} className="col-12 col-md-12 col-lg-7" type="text" name="lastName" pattern="[A-Za-z \-]+" title="Letters, spaces and - only" required />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Street *</label>
      <input onChange={handleChange} className="col-12 col-md-12 col-lg-7" type="text" name="street" required />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Suburb</label>
      <input onChange={handleChange} className="col-12 col-md-12 col-lg-7" type="text" name="suburb" />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">City *</label>
      <input onChange={handleChange} className="col-12 col-md-12 col-lg-7" type="text" name="city" required />
    </div>
    {/* Post code: exactly 4 digits */}
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Post Code</label>
      <input onChange={handleChange} className="col-12 col-md-12 col-lg-7" type="text" name="postCode" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} title="4 digit post code" />
    </div>
    {/* Phone: digits, spaces and ( ) + - only */}
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Phone Number *</label>
      <input onChange={handleChange} className="col-12 col-md-12 col-lg-7" type="tel" name="phone" pattern="[0-9 \(\)\+\-]+" title="Numbers, spaces and ( ) - + only" required />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Email *</label>
      <input onChange={handleChange} className="col-12 col-md-12 col-lg-7" type="email" name="email" required />
    </div>
  </>);
}

export default FormCustomerDetail;
