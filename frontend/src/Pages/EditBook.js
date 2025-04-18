import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
//defining the EditBook component
export default function EditBook() {
  const { id } = useParams();
  const nav    = useNavigate();
  const [title,  setTitle]  = useState('');
  const [author, setAuthor] = useState('');
  const [error,  setError]  = useState(null);
//fetching the book details from the server
  useEffect(() => {
    axios.get(`/books/${id}`)
         .then(r => {
           setTitle(r.data.title);
           setAuthor(r.data.author);
         })
         .catch(() => setError('Could not load'));
  }, [id]);
//defining the handleSubmit function
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.put(`/books/${id}`, { title, author });
      nav(`/book/${id}`);
    } catch {
      setError('Failed to save');
    }
  }
//displaying the error message if the book is not found or the server error
  if (error) return <p style={{ padding:'2rem', color:'red' }}>{error}</p>;
  if (!title && !author) return <p style={{ padding:'2rem' }}>Loading…</p>;
//displaying the edit book form
  return (
    <main style={{ padding:'2rem' }}>
      <h1>Edit Book</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:<br/>
          <input
            value={title}
            onChange={e=>setTitle(e.target.value)}
            required
          />
        </label>
        <br/><br/>
        <label>
          Author:<br/>
          <input
            value={author}
            onChange={e=>setAuthor(e.target.value)}
            required
          />
        </label>
        <br/><br/>
        <button type="submit">Save</button>
      </form>
    </main>
  );
}
