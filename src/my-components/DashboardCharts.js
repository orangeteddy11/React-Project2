// DashboardCharts.js: statistics of the repair bookings shown as bar, pie and line charts.
// The charts are drawn with plain HTML/CSS and SVG (no chart library).

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

// Counts repair jobs per repair date, in date order. Labels are shown as day/month.
const countByRepairDate = (list) => {
  const counts = {};
  list.forEach(b => {
    if (b.repair_date) counts[b.repair_date] = (counts[b.repair_date] || 0) + 1;
  });
  return Object.keys(counts).sort().map(date => {
    const [, month, day] = date.split('-');
    return [`${Number(day)}/${Number(month)}`, counts[date]];
  });
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

// Line chart: an SVG polyline with one point per date
function LineChart({ title, data }) {
  const WIDTH = 600;
  const HEIGHT = 160;
  const PAD = 24;
  const max = Math.max(...data.map(([, count]) => count), 1);

  // Convert a point's position and count into SVG coordinates
  const x = (i) => (data.length === 1 ? WIDTH / 2 : PAD + (i * (WIDTH - 2 * PAD)) / (data.length - 1));
  const y = (count) => HEIGHT - PAD - (count / max) * (HEIGHT - 2 * PAD - 10);
  const points = data.map(([, count], i) => `${x(i)},${y(count)}`).join(' ');

  return (
    <div className="bg-white text-dark rounded p-3 h-100">
      <h6 className="fw-bold">{title}</h6>
      {data.length === 0 ? (
        <p className="text-muted m-0">No data</p>
      ) : (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-100" role="img" aria-label={title}>
          <line x1={PAD} y1={HEIGHT - PAD} x2={WIDTH - PAD} y2={HEIGHT - PAD} stroke="#adb5bd" />
          <polyline points={points} fill="none" stroke={COLORS[0]} strokeWidth="2" />
          {data.map(([label, count], i) => (
            <g key={label}>
              <circle cx={x(i)} cy={y(count)} r="4" fill={COLORS[0]} />
              <text x={x(i)} y={y(count) - 8} fontSize="11" textAnchor="middle">{count}</text>
              <text x={x(i)} y={HEIGHT - 8} fontSize="10" textAnchor="middle" fill="#6c757d">{label}</text>
            </g>
          ))}
        </svg>
      )}
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
      <div className="col-12">
        <LineChart title="Repair jobs per repair date" data={countByRepairDate(bookings)} />
      </div>
    </div>
  </>);
}

export default DashboardCharts;
