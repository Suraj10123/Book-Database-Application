import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Search() {
  const [query,  setQuery]   = useState('');
  const [results,setResults] = useState([]);
  const [loading,setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get('/search', { params:{ q:query }});
      setResults(res.data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding:'2rem' }}>
      <h1>Search Books</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={e=>setQuery(e.target.value)}
          placeholder="title or author"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading…</p>}

      <ul>
        {!loading && results.map(b => (
          <li key={b.id}>
            <Link to={`/book/${b.id}`}>{b.title}</Link> — {b.author}
          </li>
        ))}
        {!loading && query && results.length===0 && <p>No results.</p>}
      </ul>
    </main>
  );
}
