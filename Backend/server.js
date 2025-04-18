// Backend/server.js
// This is the backend server for the book recommendation app
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { Pool } = require('pg');
// ─── CREATE an express app ───────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;
const pool = new Pool();  // reads PG* from .env
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
  const id = Number(req.params.id);
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
    const { rows } = await pool.query(
      'INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *',
      [title, author]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating book:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── UPDATE an existing book ──────────────────────────────────
app.put('/books/:id', async (req, res) => {
  const id = Number(req.params.id);
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
  const id = Number(req.params.id);
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
