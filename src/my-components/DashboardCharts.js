// DashboardCharts.js: statistics of the repair bookings shown as bar and pie charts.
// The charts are drawn with plain HTML/CSS (no chart library).

const COLORS = ['#0d6efd', '#fd7e14', '#198754', '#dc3545', '#6f42c1', '#20c997', '#ffc107'];

// Counts bookings per value of a column, e.g. per fault category. Largest count first.
const countBy = (list, key) => {
  const counts = {};
  list.forEach(b => {
    const value = b[key] || 'Unknown';
    counts[value] = (counts[value] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
};

// Horizontal bar chart: each bar is as wide as its share of the largest count
function BarChart({ title, data }) {
  const max = Math.max(...data.map(([, count]) => count), 1);

  return (
    <div className="bg-white text-dark rounded p-3 h-100">
      <h6 className="fw-bold">{title}</h6>
      {data.length === 0 ? (
        <p className="text-muted m-0">No data</p>
      ) : data.map(([label, count], i) => (
        <div key={label} className="d-flex align-items-center mb-1">
          <span className="small" style={{ width: '7em' }}>{label}</span>
          <div className="flex-grow-1">
            <div className="rounded" style={{ width: `${(count / max) * 100}%`, minWidth: '4px', height: '1.4em', backgroundColor: COLORS[i % COLORS.length] }} />
          </div>
          <span className="ms-2 small">{count}</span>
        </div>
      ))}
    </div>
  );
}

// Pie chart: a CSS conic-gradient with one coloured slice per value
function PieChart({ title, data }) {
  const total = data.reduce((sum, [, count]) => sum + count, 0);

  // Each slice runs from the end of the previous one (in percent)
  let start = 0;
  const stops = data.map(([, count], i) => {
    const from = start;
    start += (count / total) * 100;
    return `${COLORS[i % COLORS.length]} ${from}% ${start}%`;
  });
  const background = total ? `conic-gradient(${stops.join(', ')})` : '#dee2e6';

  return (
    <div className="bg-white text-dark rounded p-3 h-100">
      <h6 className="fw-bold">{title}</h6>
      <div className="d-flex align-items-center flex-wrap">
        <div className="rounded-circle me-3" style={{ width: '120px', height: '120px', background }} />
        <ul className="list-unstyled m-0 small">
          {data.map(([label, count], i) => (
            <li key={label}>
              <span className="d-inline-block rounded me-2" style={{ width: '0.8em', height: '0.8em', backgroundColor: COLORS[i % COLORS.length] }} />
              {label}: {count} ({Math.round((count / total) * 100)}%)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DashboardCharts({ bookings }) {
  // Summary numbers
  const totalBond = bookings.reduce((sum, b) => sum + Number(b.bond || 0), 0);
  const totalIncome = bookings.reduce((sum, b) => sum + Number(b.total_gst || 0), 0);

  return (<>
    <div className="row g-3 mb-3">
      <div className="col-12 col-md-4">
        <div className="bg-white text-dark rounded p-3">
          <div className="small text-muted">Total bookings</div>
          <div className="fs-4 fw-bold">{bookings.length}</div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="bg-white text-dark rounded p-3">
          <div className="small text-muted">Bond held</div>
          <div className="fs-4 fw-bold">${totalBond.toFixed(2)}</div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="bg-white text-dark rounded p-3">
          <div className="small text-muted">Income (+GST)</div>
          <div className="fs-4 fw-bold">${totalIncome.toFixed(2)}</div>
        </div>
      </div>
    </div>
    <div className="row g-3">
      <div className="col-12 col-xl-4">
        <BarChart title="Bookings by fault category" data={countBy(bookings, 'fault_category')} />
      </div>
      <div className="col-12 col-xl-4">
        <BarChart title="Bookings by phone make" data={countBy(bookings, 'make')} />
      </div>
      <div className="col-12 col-xl-4">
        <PieChart title="Customer types" data={countBy(bookings, 'customertype')} />
      </div>
    </div>
  </>);
}

export default DashboardCharts;
