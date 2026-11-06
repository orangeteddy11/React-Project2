// RepairStatus.js: repair status tracking with notifications.
// The status of each booking is worked out from its repair date. The Notification API
// (browser notifications) is used to alert staff about repairs due today or soon.
import { useState } from 'react';
import { jobNumber, formatDate, formatTime12 } from './bookingHelpers';

// Whole days from today until the repair date (negative = date has passed)
const daysUntil = (date) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((new Date(`${date}T00:00:00`) - todayStart) / 86400000);
};

// Status label and badge colour for a booking
const statusOf = (booking) => {
  if (!booking.repair_date) return { label: 'No date', css: 'bg-secondary' };
  const days = daysUntil(booking.repair_date);
  if (days < 0) return { label: 'Date passed', css: 'bg-dark' };
  if (days === 0) return { label: 'Due today', css: 'bg-danger' };
  if (days <= 3) return { label: 'Due soon', css: 'bg-warning text-dark' };
  return { label: 'Scheduled', css: 'bg-success' };
};

function RepairStatus({ bookings }) {
  // "default", "granted", "denied", or "unsupported" if the browser has no Notification API
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  // Sort by repair date, earliest first
  const sorted = [...bookings].sort((a, b) => (a.repair_date || '9999').localeCompare(b.repair_date || '9999'));
  const due = sorted.filter(b => ['Due today', 'Due soon'].includes(statusOf(b).label));

  // Show one browser notification per due repair
  const sendNotifications = () => {
    due.forEach(b => {
      new Notification(`Repair ${statusOf(b).label.toLowerCase()}: ${jobNumber(b.id)}`, {
        body: `${b.first_name} ${b.last_name} - ${b.make} (${b.fault_category}) on ${formatDate(b.repair_date)} ${formatTime12(b.repair_time)}`
      });
    });
  };

  // Ask the user for permission first, then send the notifications
  const enable = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') sendNotifications();
  };

  return (<>
    {/* In-page alert, always shown even if browser notifications are blocked */}
    <div className={`rounded p-3 mb-3 ${due.length ? 'bg-warning text-dark' : 'bg-light text-dark'}`}>
      <strong>{due.length}</strong> repair(s) due today or within 3 days.
      <div className="mt-2">
        {permission === 'unsupported' && <span className="small">This browser does not support notifications.</span>}
        {permission === 'default' && (
          <button type="button" className="btn btn-dark btn-sm" onClick={enable}>Enable notifications</button>
        )}
        {permission === 'granted' && (
          <button type="button" className="btn btn-dark btn-sm" onClick={sendNotifications} disabled={!due.length}>Send notifications now</button>
        )}
        {permission === 'denied' && <span className="small">Notifications are blocked in your browser settings.</span>}
      </div>
    </div>

    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
      {sorted.map(b => {
        const status = statusOf(b);
        return (
          <div key={b.id} className="d-flex flex-wrap justify-content-between align-items-center bg-white text-dark rounded p-2 mb-2">
            <div>
              <strong>{jobNumber(b.id)}</strong> {b.first_name} {b.last_name}
              <div className="small text-muted">
                {b.make} ({b.fault_category}) - {formatDate(b.repair_date)} {formatTime12(b.repair_time)}
              </div>
            </div>
            <span className={`badge ${status.css}`}>{status.label}</span>
          </div>
        );
      })}
    </div>
  </>);
}

export default RepairStatus;
