DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id          SERIAL PRIMARY KEY,
  title       TEXT  NOT NULL,
  author      TEXT  NOT NULL,
  description TEXT,
  cover_url   TEXT
);

INSERT INTO books (title, author) VALUES
 ('1984',            'George Orwell'),
 ('Brave New World', 'Aldous Huxley');
