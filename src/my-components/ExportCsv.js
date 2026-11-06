// ExportCsv.js: download the repair bookings as a CSV file (opens in Excel).
// Builds the file in the browser with the Blob and URL.createObjectURL APIs.
import { useState } from 'react';
import { jobNumber } from './bookingHelpers';

// CSV columns: heading and how to get the value from a booking
const COLUMNS = [
  ['Job No', b => jobNumber(b.id)],
  ['Customer', b => `${b.title} ${b.first_name} ${b.last_name}`],
  ['Type', b => b.customertype],
  ['City', b => b.city],
  ['Phone', b => b.phone],
  ['Email', b => b.email],
  ['Make', b => b.make],
  ['Fault', b => b.fault_category],
  ['Repair Date', b => b.repair_date],
  ['Repair Time', b => b.repair_time],
  ['Borrowed', b => [b.phone_borrow, b.charger_borrow].filter(Boolean).join(' + ')],
  ['Bond', b => b.bond],
  ['Service Fee', b => b.service],
  ['Total (+GST)', b => b.total_gst]
];

// Wrap a value in quotes and double any quotes inside it, so commas do not break the CSV
const escapeCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

function ExportCsv({ bookings }) {
  const [city, setCity] = useState('all');

  const cities = [...new Set(bookings.map(b => b.city).filter(Boolean))].sort();
  const rows = bookings.filter(b => city === 'all' || b.city === city);

  const download = () => {
    const lines = [
      COLUMNS.map(([heading]) => escapeCsv(heading)).join(','),
      ...rows.map(b => COLUMNS.map(([, getValue]) => escapeCsv(getValue(b))).join(','))
    ];
    // The BOM at the start makes Excel read the file as UTF-8
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'phone-fix-bookings.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (<>
    <div className="d-flex flex-wrap align-items-center mb-3">
      <label className="me-2">City:</label>
      <select className="form-select w-auto me-3" value={city} onChange={e => setCity(e.target.value)}>
        <option value="all">All cities</option>
        {cities.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <button type="button" className="btn btn-warning" onClick={download} disabled={!rows.length}>
        Download CSV ({rows.length} bookings)
      </button>
    </div>

    {/* Preview of the first rows that will be exported */}
    <div className="bg-white text-dark rounded p-2" style={{ overflowX: 'auto' }}>
      <table className="table table-sm m-0">
        <thead>
          <tr>{COLUMNS.slice(0, 6).map(([heading]) => <th key={heading}>{heading}</th>)}</tr>
        </thead>
        <tbody>
          {rows.slice(0, 5).map(b => (
            <tr key={b.id}>{COLUMNS.slice(0, 6).map(([heading, getValue]) => <td key={heading}>{getValue(b)}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <div className="small text-muted">Preview: first 5 rows, first 6 columns.</div>
    </div>
  </>);
}

export default ExportCsv;
