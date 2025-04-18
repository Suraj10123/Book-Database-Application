# Book Recommendation App

A simple **CRUD** (Create, Read, Update, Delete) demo using:

- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: React, React Router, Axios

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Docker](https://www.docker.com/) (for PostgreSQL container)

---

## Setup

### 1. Start PostgreSQL

```bash
docker run -d \
  --name bookdb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=bookdb \
  -p 5432:5432 \
  postgres:latest
