// FormCost.js: displays the calculated costs. All values come from the parent (Home.js),
// and the inputs are disabled so the user cannot change them.
function FormCost({ bond, serviceFee, total, gst, totalGst }) {
  // Label and value for each cost row
  const rows = [
    ['Bond', bond],
    ['Service Fee', serviceFee],
    ['Total', total],
    ['GST', gst],
    ['Total (+GST)', totalGst]
  ];

  return (<>
    <h2>Cost</h2>
    {/* Build one row per entry, amounts formatted as $200.00 */}
    {rows.map(([label, value], i) => (
      <div key={label} className={`row ms-3 ${i === 0 ? 'mt-2' : 'mt-1'}`}>
        <label className="col-12 col-md-12 col-lg-4">{label}</label>
        <input className="col-12 col-md-12 col-lg-7" type="text" value={`$${value.toFixed(2)}`} disabled />
      </div>
    ))}
  </>);
}

export default FormCost;
