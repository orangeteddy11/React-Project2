// FormCourtesyPhone.js: lets the user borrow one phone and/or one charger.
// The chosen items are kept in the parent (Home.js) so the bond can be calculated there.
import { useEffect } from 'react';

// Courtesy items and their bond amounts (from the assignment brief)
const courtesyList = [
  { id: 1, type: 'phone', name: 'iPhone 10', bond: 275 },
  { id: 2, type: 'phone', name: 'iPhone 14', bond: 300 },
  { id: 3, type: 'phone', name: 'iPhone 16', bond: 500 },
  { id: 4, type: 'phone', name: 'Samsung Galaxy', bond: 200 },
  { id: 5, type: 'phone', name: 'Nokia', bond: 150 },
  { id: 6, type: 'phone', name: 'Xiaomi', bond: 100 },
  { id: 7, type: 'charger', name: 'iPhone Charger', bond: 45 },
  { id: 8, type: 'charger', name: 'Samsung Charger', bond: 30 },
  { id: 9, type: 'charger', name: 'Nokia Charger', bond: 25 },
  { id: 10, type: 'charger', name: 'Xiaomi Charger', bond: 25 }
];

function FormCourtesyPhone({ items, setItems, customerType, sendCourtesyDetails }) {
  // Business customers are not charged a bond, so their price is $0
  const priceOf = (item) => (customerType === 'business' ? 0 : item.bond);

  // Send the borrowed phone/charger details up to the parent whenever they change
  useEffect(() => {
    const phone = items.find(item => item.type === 'phone');
    const charger = items.find(item => item.type === 'charger');
    sendCourtesyDetails({
      phoneBorrow: phone ? phone.name : '',
      phoneCost: phone ? priceOf(phone) : 0,
      chargerBorrow: charger ? charger.name : '',
      chargeCost: charger ? priceOf(charger) : 0
    });
  }, [items, customerType]);

  // Which option a dropdown should show: the borrowed item of that type, or "none"
  const selectedId = (type) => {
    const found = items.find(item => item.type === type);
    return found ? String(found.id) : 'none';
  };

  // Replace the item of this type (only one phone and one charger allowed).
  // Choosing "none" removes it from the borrow list.
  const addItem = (type, value) => {
    setItems(prev => {
      const others = prev.filter(item => item.type !== type);
      if (value === 'none') return others;
      const picked = courtesyList.find(item => item.id === Number(value));
      return [...others, picked].sort((a, b) => a.id - b.id);
    });
  };

  // Builds one dropdown (phone or charger) from the courtesy list
  const dropdown = (type, label) => (
    <>
      <h4 className="ms-4 mt-2">{label}</h4>
      <div className="row mt-2 ms-3">
        <label className="col-12 col-md-12 col-lg-4">Item Type</label>
        <select className="col-12 col-md-12 col-lg-7" value={selectedId(type)} onChange={e => addItem(type, e.target.value)}>
          <option value="none">None</option>
          {courtesyList.filter(item => item.type === type).map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>
    </>
  );

  return (<>
    <h2>Courtesy Phone</h2>
    {dropdown('phone', 'Choose a phone:')}
    {dropdown('charger', 'Choose a charger:')}

    {/* Table of the items currently borrowed */}
    <h4 className="ms-4 mt-2">Borrow items</h4>
    <div className="row mt-2 ms-3 me-3 bg-white">
      <table className="table table-bordered m-0">
        <thead>
          <tr>
            <th>Item</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={2} className="text-muted">No items borrowed</td>
            </tr>
          ) : items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${priceOf(item).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>);
}

export default FormCourtesyPhone;
