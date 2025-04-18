Book Database App
A full‑stack CRUD (Create, Read, Update, Delete) demo application that lets you browse, search, add, edit, and delete book records.

🚀 Overview
This project is designed as a portfolio piece and learning exercise in building:

A PostgreSQL database backend

A Node.js/Express REST API

A React single‑page application with React Router and Axios

You’ll walk through:

Database schema and seeding data

API server with endpoints for listing, searching, creating, updating, and deleting books

React client for consuming the API and providing a user interface

📦 Tech Stack
Database: PostgreSQL

Backend: Node.js, Express, pg (node‑postgres), dotenv, CORS

Frontend: React, Create React App, React Router v6, Axios

Dev Tools: Docker (for Postgres), VS Code (recommended), Git & GitHub

🔧 Prerequisites
Node.js ≥ v16.x

npm (comes with Node.js)

Docker & docker-compose (optional, but recommended for local Postgres)


⚙️ Configuration
Clone the repo
git clone https://github.com/Suraj10123/Book-Database-Application.git
cd Book-Database-Application

Backend environment
In Backend/.env, set your database credentials:
PGUSER=postgres
PGPASSWORD=postgres
PGHOST=localhost
PGPORT=5432
PGDATABASE=bookdb

PORT=5000

Frontend proxy
In frontend/package.json, ensure:
"proxy": "http://localhost:5000"

🛠️ Installation & Running
1. Start PostgreSQL
With Docker:
docker run -d \
--name bookdb \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=bookdb \
-p 5432:5432 \
postgres:latest

Or locally: install Postgres and create a bookdb database and user.

2. Initialize the database
From project root (PowerShell):
Get-Content .\init.sql | docker exec -i bookdb psql -U postgres -d bookdb

You should see:
DROP TABLE
CREATE TABLE
INSERT 0 2

3. Launch the backend
cd Backend
npm install (if not already installed)
npm start

The API server listens on http://localhost:5000.

4. Launch the frontend
cd frontend
npm install
npm start

Your browser opens http://localhost:3000.

🖼️ UI Workflow
Home

Lists all books

Click [edit] to navigate to the edit form

Search

Type a query and hit Search

View results with links to detail pages

New Book

Fill in title & author

On submit, navigates to the new book’s detail page

Book Details

View title & author

Delete button to remove the book and return home
