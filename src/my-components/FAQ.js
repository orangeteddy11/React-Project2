// FAQ.js: frequently asked questions loaded from faqs.json, with a keyword search box.
// Also has two movie slideshows (manual and automatic) from lab 2-2.
import { useState, useEffect } from 'react';
import Questions from './faqs.json';
import movie0 from './images/movie0.jpg';
import movie1 from './images/movie1.jpg';
import movie2 from './images/movie2.jpg';
import movie3 from './images/movie3.jpg';
import movie4 from './images/movie4.jpg';

// Movies shown in the slideshows
const topMovies = [
  { id: 0, title: "The Shawshank Redemption", year: 1994, image_url: movie0 },
  { id: 1, title: "The Godfather", year: 1972, image_url: movie1 },
  { id: 2, title: "The Dark Knight", year: 2008, image_url: movie2 },
  { id: 3, title: "12 Angry Men", year: 1957, image_url: movie3 },
  { id: 4, title: "Schindler's List", year: 1993, image_url: movie4 }
];

const boxStyle = {
  border: '4px solid black',
  minHeight: '400px'
};

function FAQ() {
  const [keywords, setKeywords] = useState('');
  const [manualIndex, setManualIndex] = useState(0);
  const [autoIndex, setAutoIndex] = useState(0);

  // Automatic slideshow: move to the next image every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoIndex(i => (i + 1) % topMovies.length);
    }, 2000);
    // Stop the timer when the component is removed
    return () => clearInterval(timer);
  }, []);

  // Manual slideshow buttons (wrap around at both ends)
  const prev = () => setManualIndex(i => (i - 1 + topMovies.length) % topMovies.length);
  const next = () => setManualIndex(i => (i + 1) % topMovies.length);

  // FAQ search: keep questions where the question or the answer contains the keywords
  const search = keywords.toLowerCase();
  const filtered = Questions.filter(q =>
    q.question.toLowerCase().includes(search) ||
    q.answer.toLowerCase().includes(search)
  );

  const manualMovie = topMovies[manualIndex];
  const autoMovie = topMovies[autoIndex];

  return (<>
    {/* Slideshows */}
    <div className="container my-3">
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="p-3 h-100" style={boxStyle}>
            <h2>Manual Slideshow: Two buttons</h2>
            <h4>{manualMovie.title} ({manualMovie.year})</h4>
            <img src={manualMovie.image_url} alt={manualMovie.title} style={{ height: '250px' }} />
            <div className="mt-2">
              <button type="button" className="btn btn-outline-dark me-2" onClick={prev}>PREVIOUS</button>
              <button type="button" className="btn btn-outline-dark" onClick={next}>NEXT</button>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="p-3 h-100" style={boxStyle}>
            <h2>Automatic Slideshow</h2>
            <h4>{autoMovie.title} ({autoMovie.year})</h4>
            <img src={autoMovie.image_url} alt={autoMovie.title} style={{ height: '250px' }} />
          </div>
        </div>
      </div>
    </div>

    {/* FAQ search box and list of matching questions */}
    <div>
      <h3>Frequently Asked Questions</h3>
      <div className="row">
        <input
          className="col-11 m-3"
          type="text"
          name="search"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          placeholder="Keywords"
        />
      </div>
      {filtered.map((q, i) => (
        <div className="bg-warning p-3 m-2" key={i}>
          <h4>{q.question}</h4>
          <p>{q.answer}</p>
        </div>
      ))}
    </div>
  </>);
}

export default FAQ;
