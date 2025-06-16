// Backend/server.js
// This is the backend server for the book recommendation app
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const axios   = require('axios');
const { Pool } = require('pg');
// ─── CREATE an express app ───────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;
const pool = new Pool();  // reads PG* from .env

async function fetchBookInfo(title) {
  try {
    const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1`;
    const searchRes = await axios.get(searchUrl);
    const doc = searchRes.data?.docs?.[0];
    if (!doc) return {};

    const author = doc.author_name ? doc.author_name[0] : null;
    const coverUrl = doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null;

    let description = null;
    if (doc.key) {
      try {
        const workRes = await axios.get(`https://openlibrary.org${doc.key}.json`);
        const desc = workRes.data?.description;
        description = typeof desc === 'string' ? desc : desc?.value || null;
      } catch (err) {
        console.error('Error fetching description:', err.message);
      }
    }

    return { author, coverUrl, description };
  } catch (err) {
    console.error('Error querying Open Library:', err.message);
    return {};
  }
}
// ─── MIDDLEWARE ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── GET all books ───────────────────────────────────────────
app.get('/books', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM books ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET single book by ID ────────────────────────────────────
app.get('/books/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }
  try {
    const { rows } = await pool.query(
      'SELECT * FROM books WHERE id = $1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(`Error fetching book ${id}:`, err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── SEARCH books ─────────────────────────────────────────────
app.get('/search', async (req, res) => {
  const q = `%${(req.query.q || '').toLowerCase()}%`;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM books
       WHERE LOWER(title)  LIKE $1
          OR LOWER(author) LIKE $1
       ORDER BY id`,
      [q]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error searching books:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── CREATE a new book ────────────────────────────────────────
app.post('/books', async (req, res) => {
  const { title, author } = req.body;
  try {
    const insert = await pool.query(
      'INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *',
      [title, author]
    );
    let book = insert.rows[0];

    // Fetch additional details from Open Library
    const info = await fetchBookInfo(title);
    if (info.author || info.description || info.coverUrl) {
      const updated = await pool.query(
        'UPDATE books SET author = $1, description = $2, cover_url = $3 WHERE id = $4 RETURNING *',
        [info.author || book.author, info.description, info.coverUrl, book.id]
      );
      book = updated.rows[0];
    }

    res.status(201).json(book);
  } catch (err) {
    console.error('Error creating book:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── UPDATE an existing book ──────────────────────────────────
app.put('/books/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }
  const { title, author } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE books SET title = $1, author = $2 WHERE id = $3 RETURNING *',
      [title, author, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(`Error updating book ${id}:`, err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── DELETE a book ────────────────────────────────────────────
app.delete('/books/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }
  try {
    const result = await pool.query(
      'DELETE FROM books WHERE id = $1',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(`Error deleting book ${id}:`, err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
