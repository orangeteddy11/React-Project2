// DragDropCourtesy.js: choose a courtesy phone and charger by dragging them between
// two drop zones ("Available" and "Selected"). Uses the HTML5 Drag and Drop API.
// Clicking an item also moves it, so it works on touch screens too.
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

// One drop zone with its draggable items
function DropZone({ title, hint, items, zone, priceOf, onDrop, onDragStart, onItemClick }) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      // preventDefault on dragOver is required, browsers block dropping by default
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { setDragOver(false); onDrop(e, zone); }}
      className={`rounded p-3 h-100 text-dark ${dragOver ? 'bg-warning-subtle' : 'bg-light'}`}
      style={{ minHeight: '260px', border: '2px dashed #888' }}
    >
      <h6 className="fw-bold">{title}</h6>
      {items.length === 0 && <p className="text-muted small m-0">{hint}</p>}
      {items.map(item => (
        <div
          key={item.id}
          draggable
          onDragStart={e => onDragStart(e, item, zone)}
          onClick={() => onItemClick(item, zone)}
          className="d-flex justify-content-between bg-white border rounded px-2 py-1 mb-2"
          style={{ cursor: 'grab' }}
        >
          <span>{item.name}</span>
          <span>${priceOf(item).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

function DragDropCourtesy() {
  const [selected, setSelected] = useState([]);
  const [customerType, setCustomerType] = useState('customer');
  const [message, setMessage] = useState('');

  // Items not yet selected stay in the "Available" zone
  const available = courtesyList.filter(item => !selected.some(s => s.id === item.id));

  // Business customers pay no bond
  const priceOf = (item) => (customerType === 'business' ? 0 : item.bond);
  const totalBond = selected.reduce((sum, item) => sum + priceOf(item), 0);

  // Move an item to the other zone. Only one phone and one charger can be selected.
  const moveItem = (item, source, target) => {
    if (source === target) return;
    if (target === 'selected') {
      if (selected.some(s => s.type === item.type)) {
        setMessage(`You can only select one ${item.type}. Drag the current one back first.`);
        return;
      }
      setSelected(prev => [...prev, item].sort((a, b) => a.id - b.id));
    } else {
      setSelected(prev => prev.filter(s => s.id !== item.id));
    }
    setMessage('');
  };

  // Remember which item is being dragged and which zone it came from
  const handleDragStart = (event, item, source) => {
    event.dataTransfer.setData('application/json', JSON.stringify({ id: item.id, source }));
  };

  // Read the dragged item back and move it into the zone it was dropped on
  const handleDrop = (event, target) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData('application/json');
    if (!raw) return;
    const { id, source } = JSON.parse(raw);
    const item = courtesyList.find(i => i.id === id);
    if (item) moveItem(item, source, target);
  };

  // Click fallback: move the item to the opposite zone
  const handleClick = (item, zone) => moveItem(item, zone, zone === 'available' ? 'selected' : 'available');

  return (<>
    <div className="d-flex flex-wrap align-items-center mb-2">
      <label className="me-2">Customer type:</label>
      <select className="form-select w-auto me-3" value={customerType} onChange={e => setCustomerType(e.target.value)}>
        <option value="customer">Customer</option>
        <option value="business">Business</option>
      </select>
      <span className="fw-bold">Total bond: ${totalBond.toFixed(2)}</span>
    </div>
    <p className="small mb-2">Drag one phone and/or one charger into "Selected". Drag it back to remove it.</p>
    {message && <p className="bg-warning text-dark rounded px-2 py-1">{message}</p>}

    <div className="row g-3">
      <div className="col-12 col-md-6">
        <DropZone
          title="Available"
          hint="Everything is selected."
          items={available}
          zone="available"
          priceOf={priceOf}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onItemClick={handleClick}
        />
      </div>
      <div className="col-12 col-md-6">
        <DropZone
          title="Selected"
          hint="Drop items here."
          items={selected}
          zone="selected"
          priceOf={priceOf}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onItemClick={handleClick}
        />
      </div>
    </div>
  </>);
}

export default DragDropCourtesy;
