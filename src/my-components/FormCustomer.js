function FormCustomerDetail() {
  return (<>
    <h2>Customer Details</h2>
    <div className="row">
      <fieldset className="border border-primary col-12 col-lg-11 ms-2 me-4">
        <legend className="col-11 float-none w-auto">Customer type *</legend>
        <div>
          <label className="col-12 col-md-12 col-lg-4">Customer</label>
          <input type="radio" name="customer-type" value="customer" defaultChecked />
        </div>
        <div>
          <label className="col-12 col-md-12 col-lg-4">Business</label>
          <input type="radio" name="customer-type" value="business" />
        </div>
      </fieldset>
    </div>
    <div className="row mt-2">
      <label className="col-12 col-md-12 col-lg-4">Title *</label>
      <select className="col-12 col-md-12 col-lg-7" defaultValue="Mr" required>
        <option value="Mr">Mr</option>
        <option value="Mrs">Mrs</option>
        <option value="Ms">Ms</option>
        <option value="Miss">Miss</option>
        <option value="Dr">Dr</option>
      </select>
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">First Name *</label>
      <input className="col-12 col-md-12 col-lg-7" type="text" pattern="[A-Za-z \-]+" title="Letters, spaces and - only" required />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Last Name *</label>
      <input className="col-12 col-md-12 col-lg-7" type="text" pattern="[A-Za-z \-]+" title="Letters, spaces and - only" required />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Street *</label>
      <input className="col-12 col-md-12 col-lg-7" type="text" required />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Suburb</label>
      <input className="col-12 col-md-12 col-lg-7" type="text" />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">City *</label>
      <input className="col-12 col-md-12 col-lg-7" type="text" required />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Post Code</label>
      <input className="col-12 col-md-12 col-lg-7" type="text" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} title="4 digit post code" />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Phone Number *</label>
      <input className="col-12 col-md-12 col-lg-7" type="tel" pattern="[0-9 \(\)\+\-]+" title="Numbers, spaces and ( ) - + only" required />
    </div>
    <div className="row mt-1">
      <label className="col-12 col-md-12 col-lg-4">Email *</label>
      <input className="col-12 col-md-12 col-lg-7" type="email" required />
    </div>
  </>);
}

export default FormCustomerDetail;