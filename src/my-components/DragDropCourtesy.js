// DragDropCourtesy.js: choose a courtesy phone and charger by dragging them into the borrow box.
// Uses the HTML5 Drag and Drop API. Clicking an item also adds it (for touch screens).
import { useState } from 'react';

// Courtesy items and bond amounts (same list as the booking form)
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

function DragDropCourtesy() {
  const [borrowed, setBorrowed] = useState([]);
  const [customerType, setCustomerType] = useState('customer');
  const [dragOver, setDragOver] = useState(false);

  // Business customers pay no bond
  const priceOf = (item) => (customerType === 'business' ? 0 : item.bond);
  const totalBond = borrowed.reduce((sum, item) => sum + priceOf(item), 0);

  // Only one phone and one charger: a new item replaces the old one of the same type
  const borrow = (item) => {
    setBorrowed(prev => [...prev.filter(i => i.type !== item.type), item].sort((a, b) => a.id - b.id));
  };

  const remove = (id) => setBorrowed(prev => prev.filter(i => i.id !== id));

  // Remember which item is being dragged
  const onDragStart = (event, item) => {
    event.dataTransfer.setData('text/plain', String(item.id));
  };

  // Dropping on the borrow box adds the dragged item
  const onDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const item = courtesyList.find(i => i.id === Number(event.dataTransfer.getData('text/plain')));
    if (item) borrow(item);
  };

  // Item cards for one type (phone or charger)
  const itemList = (type, title) => (
    <div className="mb-3">
      <h6>{title}</h6>
      <div className="d-flex flex-wrap">
        {courtesyList.filter(item => item.type === type).map(item => (
          <div
            key={item.id}
            draggable
            onDragStart={e => onDragStart(e, item)}
            onClick={() => borrow(item)}
            className="bg-white text-dark border rounded px-2 py-1 me-2 mb-2"
            style={{ cursor: 'grab' }}
          >
            {item.name} <span className="text-muted small">${priceOf(item)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (<>
    <div className="mb-3">
      <label className="me-2">Customer type:</label>
      <select className="form-select d-inline-block w-auto" value={customerType} onChange={e => setCustomerType(e.target.value)}>
        <option value="customer">Customer</option>
        <option value="business">Business</option>
      </select>
    </div>
    <div className="row g-3">
      <div className="col-12 col-lg-6">
        {itemList('phone', 'Phones (drag one into the box)')}
        {itemList('charger', 'Chargers (drag one into the box)')}
      </div>
      <div className="col-12 col-lg-6">
        <h6>Borrow box</h6>
        {/* Drop zone: preventDefault on dragOver is required to allow dropping */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded p-3 border border-2 ${dragOver ? 'border-warning bg-warning-subtle' : 'border-light'}`}
          style={{ minHeight: '150px', borderStyle: 'dashed' }}
        >
          {borrowed.length === 0 ? (
            <span className="text-light">Drop items here</span>
          ) : borrowed.map(item => (
            <div key={item.id} className="d-flex justify-content-between bg-white text-dark rounded px-2 py-1 mb-1">
              <span>{item.name}</span>
              <span>
                ${priceOf(item).toFixed(2)}
                <button type="button" className="btn btn-sm btn-outline-danger ms-2 py-0" onClick={() => remove(item.id)}>X</button>
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 fw-bold">Bond total: ${totalBond.toFixed(2)}</p>
      </div>
    </div>
  </>);
}

export default DragDropCourtesy;
