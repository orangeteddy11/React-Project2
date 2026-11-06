// AdvancedJS.js: the "Extension" page. Shows the statement of authenticity and five
// advanced JavaScript demos, each with a description and a working example.
// The bookings are loaded from Supabase once here and shared with the demos that need them.
import { useState, useEffect } from 'react';
import { supabase } from './include/supabaseClient';
import DashboardCharts from './DashboardCharts';
import RepairCalendar from './RepairCalendar';
import DragDropCourtesy from './DragDropCourtesy';
import RepairStatus from './RepairStatus';
import ExportCsv from './ExportCsv';

// The demos: title, description, JS techniques used, and the component to show
const demos = [
  {
    id: 1,
    title: 'Dashboard charts',
    needsData: true,
    Component: DashboardCharts,
    description: 'A dashboard for the repair shop owner. It reads all repair bookings from the Supabase database and shows summary numbers (bookings, bond held, income) plus bar charts of bookings by fault category and phone make, and a pie chart of customer types.',
    techniques: [
      'Async data fetching from Supabase with async/await',
      'Array reduce() to count bookings per category',
      'Reusable components (BarChart, PieChart) driven by data',
      'Pie chart drawn with a CSS conic-gradient built from the data'
    ]
  },
  {
    id: 2,
    title: 'Repair calendar',
    needsData: true,
    Component: RepairCalendar,
    description: 'A month calendar that places each repair booking on its repair date, with the job number, customer name and time (12-hour). Staff can see at a glance which days are busy, and move between months.',
    techniques: [
      'JavaScript Date object to work out the days in a month and the first weekday',
      'Grouping bookings by date with an object lookup',
      'CSS grid layout for the 7-column calendar',
      'React state to move between months'
    ]
  },
  {
    id: 3,
    title: 'Drag and drop courtesy phone',
    needsData: false,
    Component: DragDropCourtesy,
    description: 'A friendlier way to choose a courtesy phone and charger: drag an item into the borrow box. Only one phone and one charger are allowed, so dragging a new one replaces the old one. The bond total updates instantly and is $0 for business customers.',
    techniques: [
      'HTML5 Drag and Drop API (draggable, dragstart, dragover, drop, dataTransfer)',
      'Event handling with preventDefault to allow dropping',
      'Derived state: bond total calculated from the borrowed items',
      'Click fallback so it also works on touch screens'
    ]
  },
  {
    id: 4,
    title: 'Repair status and notifications',
    needsData: true,
    Component: RepairStatus,
    description: 'Tracks the status of each repair (Scheduled, Due soon, Due today, Date passed) based on its repair date, and warns staff about repairs that are due. Staff can turn on browser notifications to be alerted about due repairs.',
    techniques: [
      'Browser Notification API with permission handling (requestPermission)',
      'Date arithmetic to work out days until each repair',
      'Sorting and filtering arrays',
      'Conditional rendering of status badges and alerts'
    ]
  },
  {
    id: 5,
    title: 'Export bookings to CSV',
    needsData: true,
    Component: ExportCsv,
    description: 'Lets staff download the repair bookings as a CSV file that opens in Excel, optionally for one city only. The file is created in the browser, so no server is needed.',
    techniques: [
      'Blob API and URL.createObjectURL to create a downloadable file',
      'Building CSV text with map() and join(), escaping quotes and commas',
      'Programmatic file download using a temporary link element',
      'Filtering the data before it is exported'
    ]
  }
];

function AdvancedJS() {
  const [active, setActive] = useState(1);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load the bookings from Supabase once when the page opens
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase.from('bookings').select('*');
        if (error) throw error;
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const current = demos.find(demo => demo.id === active);
  const Demo = current.Component;

  return (<>
    <div className="container-fluid" style={{ minHeight: '60vh' }}>
      <h2 className="p-3">&quot;Extension&quot; Page: Advanced JS DEMOS</h2>

      <div className="border border-dark rounded p-3 mb-3 bg-light">
        <h5>Statement of authenticity</h5>
        <p className="m-0">I confirm that:</p>
        <ul className="mb-0">
          <li>This is an original assessment and is entirely my own work.</li>
          <li>It contains no material previously published or written by another person or myself except where due acknowledgement is made in the text.</li>
          <li>No material which to a substantial extent, has been submitted for any other academic course, is included without acknowledgement.</li>
        </ul>
      </div>

      <div className="row">
        {/* Demo buttons */}
        <div className="col-12 col-lg-2 p-0 bg-primary">
          <div className="row m-0">
            {demos.map(demo => (
              <button
                key={demo.id}
                type="button"
                className={`col-6 col-lg-12 btn rounded-0 border border-light text-white ${active === demo.id ? 'bg-warning' : 'bg-primary'}`}
                onClick={() => setActive(demo.id)}
              >
                DEMO-{demo.id}
              </button>
            ))}
          </div>
        </div>

        {/* Selected demo: description first, then the working example */}
        <div className="col-12 col-lg-10 bg-secondary text-white p-3" style={{ minHeight: '50vh' }}>
          <h4>DEMO-{current.id}: {current.title}</h4>
          <div className="bg-light text-dark rounded p-3 mb-3">
            <p>{current.description}</p>
            <strong>Advanced JavaScript used:</strong>
            <ul className="mb-0">
              {current.techniques.map(t => <li key={t}>{t}</li>)}
            </ul>
          </div>

          {current.needsData && loading ? (
            <p>Loading bookings...</p>
          ) : current.needsData && error ? (
            <p className="text-warning">Error: {error}</p>
          ) : (
            <Demo bookings={bookings} />
          )}
        </div>
      </div>
    </div>
  </>);
}

export default AdvancedJS;
