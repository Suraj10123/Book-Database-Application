import { useEffect, useState } from 'react';
import axios                      from 'axios';
import { Link }                   from 'react-router-dom';

export default function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    axios.get('/books')
         .then(res => setBooks(res.data))
         .catch(console.error);
  }, []);

  return (
    <main style={{ padding:'2rem' }}>
      <h1>All Books</h1>
      <ul>
        {books.map(b =>
          <li key={b.id}>
            <Link to={`/book/${b.id}`}>{b.title}</Link>
             — {b.author}
          </li>
        )}
      </ul>
    </main>
  );
}
