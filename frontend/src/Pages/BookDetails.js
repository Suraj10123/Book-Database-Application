import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState }         from 'react';
import axios                            from 'axios';
//importing the useParams, Link, and useNavigate hooks from react-router-dom
export default function BookDetails() {
  const { id } = useParams();
  const nav    = useNavigate();
  const [book,  setBook]  = useState(null);
  const [error, setError] = useState(null);
//fetching the book details from the server
  useEffect(() => {
    axios.get(`/books/${id}`)
         .then(r => setBook(r.data))
         .catch(err =>
           setError(err.response?.status===404
                    ? 'Book not found'
                    : 'Server error')
         );
  }, [id]);
//deleting the book from the server
  async function handleDelete() {
    if (!window.confirm('Delete this book?')) return;
    try {
      await axios.delete(`/books/${id}`);
      nav('/');
    } catch {
      setError('Failed to delete');
    }
  }
//displaying the error message if the book is not found or the server error
  if (error) return <p style={{padding:'2rem',color:'red'}}>{error}</p>;
  if (!book) return <p style={{padding:'2rem'}}>Loading…</p>;
//displaying the book details
  return (
    <main style={{ padding:'2rem' }}>
      <h1>{book.title}</h1>
      <p><strong>Author:</strong> {book.author}</p>
      {book.cover_url && (
        <img
          src={book.cover_url}
          alt={`${book.title} cover`}
          style={{ maxWidth: '200px', marginTop: '1rem' }}
        />
      )}
      {book.description && (
        <p style={{ marginTop: '1rem' }}>{book.description}</p>
      )}

      <div style={{ marginTop:'1rem' }}>
        <Link to={`/edit/${id}`} style={{ marginRight:'1rem' }}>
          ✏️ Edit
        </Link>
        <button onClick={handleDelete} style={{ color:'red' }}>
          🗑️ Delete
        </button>
      </div>

      <p style={{ marginTop:'2rem' }}>
        <Link to="/">← Back to list</Link>
      </p>
    </main>
  );
}
