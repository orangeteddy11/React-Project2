// bookingHelpers.js: small helpers shared by the Advanced JS demos.

// Job number built from the unique booking id, e.g. PF-00001
export const jobNumber = (id) => `PF-${String(id).padStart(5, '0')}`;

// "2026-11-05" -> "5/11/2026"
export const formatDate = (d) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-NZ') : '-');

// "14:30:00" -> "2:30 PM" (12-hour format with AM/PM)
export const formatTime12 = (time) => {
  if (!time) return '';
  return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};
