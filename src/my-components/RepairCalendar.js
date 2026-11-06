// RepairCalendar.js: month calendar showing each repair booking on its repair date.
import { useState } from 'react';
import { jobNumber, formatTime12 } from './bookingHelpers';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// "YYYY-MM-DD" key used to match calendar days with booking repair dates
const dateKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

function RepairCalendar({ bookings }) {
  // The month being shown (always the 1st of that month)
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const today = new Date();
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  // Group bookings by repair date: { "2026-11-05": [booking, booking], ... }
  const byDate = {};
  bookings.forEach(b => {
    if (!b.repair_date) return;
    if (!byDate[b.repair_date]) byDate[b.repair_date] = [];
    byDate[b.repair_date].push(b);
  });

  // Empty cells before the 1st so the first day lands on the right weekday, then the days
  const cells = [
    ...Array(month.getDay()).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const jobsThisMonth = Object.keys(byDate).filter(k => k.startsWith(dateKey(year, monthIndex, 1).slice(0, 7)))
    .reduce((sum, k) => sum + byDate[k].length, 0);

  const goMonth = (step) => setMonth(new Date(year, monthIndex + step, 1));
  const goToday = () => setMonth(new Date(today.getFullYear(), today.getMonth(), 1));

  return (<>
    <div className="d-flex flex-wrap align-items-center mb-2">
      <button type="button" className="btn btn-light btn-sm me-2" onClick={() => goMonth(-1)}>&lt; Prev</button>
      <button type="button" className="btn btn-light btn-sm me-2" onClick={goToday}>Today</button>
      <button type="button" className="btn btn-light btn-sm me-3" onClick={() => goMonth(1)}>Next &gt;</button>
      <h5 className="m-0">{month.toLocaleString('en-NZ', { month: 'long', year: 'numeric' })}</h5>
      <span className="ms-auto small">{jobsThisMonth} repair job(s) this month</span>
    </div>

    {/* Scrolls sideways on small screens so the 7 columns stay readable */}
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: '700px' }}>
        <div className="d-grid text-center fw-bold mb-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {WEEKDAYS.map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="d-grid gap-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {cells.map((day, i) => {
            if (day === null) return <div key={`blank${i}`} />;
            const key = dateKey(year, monthIndex, day);
            const jobs = byDate[key] || [];
            return (
              <div key={key} className={`rounded p-1 text-dark ${key === todayKey ? 'bg-warning' : 'bg-white'}`} style={{ minHeight: '90px' }}>
                <div className="small fw-bold">{day}</div>
                {jobs.map(b => (
                  <div key={b.id} className="bg-primary text-white rounded px-1 mb-1" style={{ fontSize: '0.7em' }}>
                    {jobNumber(b.id)} {b.first_name}
                    {b.repair_time && <div>{formatTime12(b.repair_time)}</div>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </>);
}

export default RepairCalendar;
