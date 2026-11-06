import { useEffect, useState } from 'react';

function TodoDemo() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => {
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        return response.json();
      })
      .then(json => setTodos([...json]))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const doneCount = todos.filter(item => item.completed).length;

  return (<>
    <h4>Fetch API: To-do list from a REST API</h4>
    {loading ? (
      <p>Loading todos...</p>
    ) : error ? (
      <p className="text-warning">Error: {error}</p>
    ) : (<>
      <p>{doneCount} of {todos.length} completed</p>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {todos.map(item => (
          <div
            className="m-1 p-1 text-dark"
            style={{ backgroundColor: item.completed ? 'pink' : 'lightgray' }}
            key={item.id}
          >
            <h5>Task: {item.title}</h5>
            <p className="m-0">Id: {item.id}</p>
            <p className="m-0">Completed: {String(item.completed)}</p>
          </div>
        ))}
      </div>
    </>)}
  </>);
}

export default TodoDemo;