# Inventory App — Library Management Inventory

Elegant library inventory built with Express, EJS, TailwindCSS and PostgreSQL. It provides a manuscript-inspired UI for managing Books, Authors, Categories, and Members with a clean MVC structure and server-side rendered views.

> Database attribution: The original schema and seed data were written in **MySQL** in my previous project (https://github.com/saifali17x/LibraryMS_DB.git). For this application I performed a full conversion to **PostgreSQL** (ENUM types, functions, serial keys, and procedural logic) and adapted it to the Express/EJS stack.

## Tech Stack

- Node.js + Express
- EJS + express-ejs-layouts (SSR templating)
- PostgreSQL + pg
- Tailwind CSS (via CDN) + Font Awesome
- dotenv for environment configuration

## Features

- Dashboard with key stats and recent activity
- CRUD for:
  - Books (Collection registry with detailed views)
  - Authors (Hall of Scribes aesthetic)
  - Categories (Archive Classifications with meaningful organization types)
  - Members (Readers Registry)
- Polished, consistent UI with dark theme and library aesthetics

## Project Structure

```
index.js                 # App bootstrap (Express, routes, layouts)
package.json             # Scripts and dependencies
views/                   # EJS views (SSR)
	layout.ejs             # Global layout (Tailwind via CDN)
	books/                 # Books list/detail/create/edit
	authors/               # Authors list/detail/create/edit
	categories/            # Categories list/detail/create/edit
	members/               # Members list/detail/create/edit
controllers/controller.js# Route handlers (MVC controllers)
routes/                  # Express routers per resource
db/
	pool.js                # PostgreSQL connection (pg Pool)
	populatedb.js          # One-shot DB (re)creation + seed script
	queries.js             # SQL queries used by controllers
```

## Getting Started

### Prerequisites

- Node.js 18+ (or later)
- PostgreSQL running and reachable

### Environment Variables

Create a `.env` file in the project root with your database credentials:

```
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=library_inventory
DB_PORT=5432
```

### Install Dependencies

```
npm install
```

### Initialize / Seed the Database

The script will drop and recreate tables, types, and functions, then insert sample data.

```
npm run populate
```

### Run the App

```
npm start
```

Then open http://localhost:3000

For live-reload during development:

```
npm run dev
```

## Key Routes

- Home/Dashboard: `/`
- Books: `/books`, `/books/:id`, `/books/create`, `/books/:id/edit`
- Authors: `/authors`, `/authors/:id`, `/authors/create`, `/authors/:id/edit`
- Categories: `/categories`, `/categories/:id`, `/categories/create`, `/categories/:id/edit`
- Members: `/members`, `/members/:id`, `/members/create`, `/members/:id/edit`

## Styling Notes

- Tailwind CSS is loaded via CDN in `views/layout.ejs`; no build step required.
- Forms use dark inputs for readability; tables and headers follow a library/manuscript theme with antique-gold accents.

## Database Source & Migration Notes

The schema (tables, relationships, sample data, and stored logic) originated in a MySQL implementation from my earlier project:

- Original (MySQL) repository: https://github.com/saifali17x/LibraryMS_DB.git

### Conversion Highlights

- Replaced MySQL `AUTO_INCREMENT` with PostgreSQL `SERIAL`.
- Converted MySQL procedural routines to PostgreSQL `FUNCTION`s using PL/pgSQL.
- Implemented custom `ENUM` types (`membership_type_enum`, `member_status_enum`, `transaction_status_enum`) instead of MySQL `ENUM` columns.
- Adjusted date handling and default values to PostgreSQL syntax.
- Updated constraint and cascade semantics to match PostgreSQL behavior.
- Ensured unique + foreign key ordering for reliable recreation in `populatedb.js`.

This adaptation preserves intent while leveraging PostgreSQL features for robustness and clarity.

## Scripts

- `npm start` — Start the server
- `npm run dev` — Start with watch mode (Node --watch)
- `npm run populate` — (Re)create and seed the PostgreSQL database

## License

MIT
