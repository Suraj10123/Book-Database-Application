import { useState } from 'react';
import axios        from 'axios';
import { useNavigate } from 'react-router-dom';

//defining the NewBook component
export default function NewBook() {
  const [title,  setTitle]  = useState('');
  const [author, setAuthor] = useState('');
  const [error,  setError]  = useState('');
  const navigate = useNavigate();
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
            value={title}
            onChange={e=>setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Author</label><br/>
          <input
            value={author}
            onChange={e=>setAuthor(e.target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </main>
  );
}
