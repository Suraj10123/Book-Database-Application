import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav style={{ padding: '1rem', background: '#20232a' }}>
      <Link to="/"       style={{ color: 'white', marginRight: '1rem' }}>Home</Link>
      <Link to="/search" style={{ color: 'white', marginRight: '1rem' }}>Search</Link>
      <Link to="/new"    style={{ color: 'white' }}>+ New Book</Link>
    </nav>
  );
}
