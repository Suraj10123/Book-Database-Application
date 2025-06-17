import { useState, useEffect } from 'react';
import axios                  from 'axios';
import { useNavigate }        from 'react-router-dom';

//defining the NewBook component
export default function NewBook() {
  const [title,  setTitle]  = useState('');
  const [author, setAuthor] = useState('');
  const [error,  setError]  = useState('');
  const [titleOpts, setTitleOpts]   = useState([]);
  const [authorOpts,setAuthorOpts]  = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (title.trim().length < 2) { setTitleOpts([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await axios.get('https://openlibrary.org/search.json', {
          params: { title, limit: 5 },
        });
        const docs = res.data?.docs || [];
        setTitleOpts([...new Set(docs.map(d => d.title))].slice(0,5));
      } catch { setTitleOpts([]); }
    }, 300);
    return () => clearTimeout(t);
  }, [title]);

  useEffect(() => {
    if (author.trim().length < 2) { setAuthorOpts([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await axios.get('https://openlibrary.org/search/authors.json', {
          params: { q: author, limit: 5 },
        });
        const docs = res.data?.docs || [];
        setAuthorOpts([...new Set(docs.map(d => d.name))].slice(0,5));
      } catch { setAuthorOpts([]); }
    }, 300);
    return () => clearTimeout(t);
  }, [author]);
//defining the handleSubmit function
  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError('Both fields required');
      return;
    }
    try {
      const res = await axios.post('/books', { title, author });
      // navigate to the newly created book’s detail page
      navigate(`/book/${res.data.id}`);
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  }
//defining the return statement
  return (
    <main style={{ padding:'2rem' }}>
      <h1>+ New Book</h1>
      {error && <p style={{ color:'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label><br/>
          <input
            list="title-options"
            value={title}
            onChange={e=>setTitle(e.target.value)}
          />
          <datalist id="title-options">
            {titleOpts.map(t => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
        <div>
          <label>Author</label><br/>
          <input
            list="author-options"
            value={author}
            onChange={e=>setAuthor(e.target.value)}
          />
          <datalist id="author-options">
            {authorOpts.map(a => (
              <option key={a} value={a} />
            ))}
          </datalist>
        </div>
        <button type="submit">Create</button>
      </form>
    </main>
  );
}
