// Home.js: the booking form page.
// Holds the shared form state, calculates the costs, and saves the booking to Supabase.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './include/supabaseClient';
import FormCustomerDetail from './FormCustomerDetail';
import FormRepairDetail from './FormRepairDetail';
import FormCourtesyPhone from './FormCourtesyPhone';
import FormCost from './FormCost';
import FormButtons from './FormButtons';

const SERVICE_FEE = 85;
const GST_RATE = 0.15;
// Rounds a number to 2 decimal places (for the numeric database columns)
const round = (n) => Number(n.toFixed(2));

function Home() {
  const navigate = useNavigate();

  // Changing formKey remounts the form, which clears all inputs on RESET
  const [formKey, setFormKey] = useState(0);

  // State shared between child components
  const [customerType, setCustomerType] = useState('customer');
  const [warranty, setWarranty] = useState(false);
  const [items, setItems] = useState([]);

  // Data passed up from the child components through callback props
  const [customerDetails, setCustomerDetails] = useState({ title: 'Mr' });
  const [repairDetails, setRepairDetails] = useState({ make: 'Apple', faultCategory: 'Battery' });
  const [courtesyDetails, setCourtesyDetails] = useState({});

  // Cost calculations
  // Bond: total of borrowed items (business customers pay no bond)
  const bond = customerType === 'customer' ? items.reduce((sum, item) => sum + item.bond, 0) : 0;
  // Service fee: $85, unless under warranty or a business customer
  const serviceFee = warranty || customerType === 'business' ? 0 : SERVICE_FEE;
  const total = bond + serviceFee;
  const gst = total * GST_RATE;
  const totalGst = total + gst;

  // SUBMIT: runs only after the browser's HTML5 validation passes
  const onSubmit = async (event) => {
    event.preventDefault();

    // Booking record, with keys matching the columns of the "bookings" table
    const booking = {
      customertype: customerType,
      title: customerDetails.title,
      first_name: customerDetails.firstName,
      last_name: customerDetails.lastName,
      street: customerDetails.street,
      suburb: customerDetails.suburb || null,
      city: customerDetails.city,
      post_code: customerDetails.postCode || null,
      phone: customerDetails.phone,
      email: customerDetails.email,
      purchase_date: repairDetails.purchaseDate || null,
      repair_date: repairDetails.repairDate || null,
      repair_time: repairDetails.repairTime || null,
      warranty,
      imei: repairDetails.imei,
      make: repairDetails.make,
      model_number: repairDetails.modelNumber || null,
      fault_category: repairDetails.faultCategory,
      description: repairDetails.description,
      phone_borrow: courtesyDetails.phoneBorrow || null,
      phone_cost: courtesyDetails.phoneCost || 0,
      charger_borrow: courtesyDetails.chargerBorrow || null,
      charger_cost: courtesyDetails.chargeCost || 0,
      bond: round(bond),
      service: round(serviceFee),
      total: round(total),
      gst: round(gst),
      total_gst: round(totalGst)
    };

    // Store the booking in Supabase
    const { error } = await supabase.from('bookings').insert([booking]);

    if (error) {
      console.error('Error adding booking:', error);
      alert('Could not save booking: ' + error.message);
      return;
    }

    // Saved: confirm, then show all bookings
    alert('Thanks for your submission!');
    navigate('/bookings');
  };

  // RESET: clear the inputs and set all shared state back to its defaults
  const onReset = () => {
    setFormKey(k => k + 1);
    setCustomerType('customer');
    setWarranty(false);
    setItems([]);
    setCustomerDetails({ title: 'Mr' });
    setRepairDetails({ make: 'Apple', faultCategory: 'Battery' });
    setCourtesyDetails({});
  };

  return (<>
    <form key={formKey} className="row m-0" style={{ minHeight: '60vh' }} onSubmit={onSubmit} onReset={onReset}>
      <div className="col-12 col-lg-4 p-4 m-0" style={{ minHeight: '30vh', backgroundColor: '#FCF3CF' }}>
        <FormCustomerDetail customerType={customerType} setCustomerType={setCustomerType} sendCustomerDetails={setCustomerDetails} />
      </div>
      <div className="col-12 col-lg-4 p-4 m-0" style={{ minHeight: '30vh', backgroundColor: '#D5F5E3' }}>
        <FormRepairDetail warranty={warranty} setWarranty={setWarranty} sendRepairDetails={setRepairDetails} />
      </div>
      <div className="col-12 col-lg-4 p-0 m-0">
        <div className="p-4 text-white" style={{ minHeight: '30vh', backgroundColor: '#2874A6' }}>
          <FormCourtesyPhone items={items} setItems={setItems} customerType={customerType} sendCourtesyDetails={setCourtesyDetails} />
        </div>
        <div className="p-4" style={{ minHeight: '20vh', backgroundColor: '#EDBB99' }}>
          <FormCost bond={bond} serviceFee={serviceFee} total={total} gst={gst} totalGst={totalGst} />
        </div>
      </div>
      <div className="p-4 text-center" style={{ minHeight: '10vh', backgroundColor: '#EDBB99' }}>
        <FormButtons />
      </div>
    </form>
  </>);
}

export default Home;
