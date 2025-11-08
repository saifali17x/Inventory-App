import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const SQL = `
-- Drop existing tables if they exist (in reverse order due to foreign keys)
DROP TABLE IF EXISTS Transactions CASCADE;
DROP TABLE IF EXISTS Staff CASCADE;
DROP TABLE IF EXISTS Members CASCADE;
DROP TABLE IF EXISTS Books CASCADE;
DROP TABLE IF EXISTS Categories CASCADE;
DROP TABLE IF EXISTS Publishers CASCADE;
DROP TABLE IF EXISTS Authors CASCADE;

-- Drop existing procedures if they exist
DROP FUNCTION IF EXISTS IssueBook(INT, INT, INT, INT);
DROP FUNCTION IF EXISTS ReturnBook(INT, DECIMAL);
DROP FUNCTION IF EXISTS CalculateOverdueFines(DECIMAL);
DROP FUNCTION IF EXISTS GetMemberHistory(INT);
DROP FUNCTION IF EXISTS GetBookAvailabilityReport();

-- Create custom types for ENUM equivalents
DROP TYPE IF EXISTS membership_type_enum CASCADE;
DROP TYPE IF EXISTS member_status_enum CASCADE;
DROP TYPE IF EXISTS transaction_status_enum CASCADE;

CREATE TYPE membership_type_enum AS ENUM ('Student', 'Faculty', 'Public');
CREATE TYPE member_status_enum AS ENUM ('Active', 'Inactive', 'Suspended');
CREATE TYPE transaction_status_enum AS ENUM ('Issued', 'Returned', 'Overdue');

CREATE TABLE Authors (
    author_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_year INT,
    nationality VARCHAR(50),
    email VARCHAR(100)
);

CREATE TABLE Publishers (
    publisher_id SERIAL PRIMARY KEY,
    publisher_name VARCHAR(100) NOT NULL,
    address VARCHAR(200),
    phone VARCHAR(20),
    email VARCHAR(100),
    established_year INT
);

CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    description TEXT,
    priority_level INT DEFAULT 1
);

CREATE TABLE Books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    author_id INT,
    publisher_id INT,
    category_id INT,
    publication_year INT,
    pages INT,
    price DECIMAL(10,2),
    copies_available INT DEFAULT 0,
    total_copies INT DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES Authors(author_id),
    FOREIGN KEY (publisher_id) REFERENCES Publishers(publisher_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

CREATE TABLE Members (
    member_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address VARCHAR(200),
    membership_date DATE,
    membership_type membership_type_enum DEFAULT 'Public',
    status member_status_enum DEFAULT 'Active'
);

CREATE TABLE Staff (
    staff_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    position VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    hire_date DATE,
    salary DECIMAL(10,2)
);

CREATE TABLE Transactions (
    transaction_id SERIAL PRIMARY KEY,
    member_id INT,
    book_id INT,
    staff_id INT,
    issue_date DATE,
    due_date DATE,
    return_date DATE NULL,
    fine_amount DECIMAL(8,2) DEFAULT 0.00,
    status transaction_status_enum DEFAULT 'Issued',
    FOREIGN KEY (member_id) REFERENCES Members(member_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
);

-- Insert sample data
INSERT INTO Authors (first_name, last_name, birth_year, nationality, email) VALUES
('Allama', 'Iqbal', 1877, 'Pakistani', 'allama.iqbal@gmail.com'),
('Faiz', 'Ahmad', 1911, 'Pakistani', 'faiz.ahmad@yahoo.com'),
('Ashfaq', 'Ahmed', 1925, 'Pakistani', 'ashfaq.ahmed@hotmail.com'),
('Bano', 'Qudsia', 1928, 'Pakistani', 'bano.qudsia@gmail.com'),
('Naseem', 'Hijazi', 1914, 'Pakistani', 'naseem.hijazi@yahoo.com'),
('Mumtaz', 'Mufti', 1905, 'Pakistani', 'mumtaz.mufti@gmail.com'),
('Ahmad', 'Nadeem', 1916, 'Pakistani', 'ahmad.nadeem@hotmail.com'),
('Qurratulain', 'Hyder', 1927, 'Pakistani', 'qurratulain.hyder@gmail.com');

INSERT INTO Publishers (publisher_name, address, phone, email, established_year) VALUES
('Sang-e-Meel Publications', 'Lower Mall, Lahore, Punjab', '+92-42-37220100', 'info@sang-e-meel.com', 1960),
('Oxford University Press Pakistan', 'No. 38, Sector 15, Korangi Industrial Area, Karachi', '+92-21-35090300', 'enquiry@oup.com.pk', 1951),
('Maktaba Jamal', 'Urdu Bazaar, Lahore, Punjab', '+92-42-37630145', 'info@maktabajamal.com', 1945),
('Ferozsons Publishers', 'Feroz Palace, 60 Shahrah-e-Quaid-e-Azam, Lahore', '+92-42-37220081', 'info@ferozsons.com.pk', 1894),
('National Book Foundation', 'Bird Wood Road, Karachi, Sindh', '+92-21-99213143', 'info@nbf.gov.pk', 1972),
('Caravan Book House', 'Saddar, Lahore, Punjab', '+92-42-37320652', 'caravan@caravanbooks.com', 1955),
('Al-Faisal Nashiran', 'Shah Alam Market, Lahore, Punjab', '+92-42-37354287', 'alfaisal@publishers.pk', 1968),
('Liberty Books', 'Liberty Market, Gulberg III, Lahore', '+92-42-35758784', 'info@libertybooks.com', 1970);

INSERT INTO Categories (category_name, description) VALUES
('Fiction', 'Literary works of imaginative narration'),
('Mystery', 'Books involving puzzles, crimes, and detective work'),
('Science Fiction', 'Fiction dealing with futuristic concepts and technology'),
('Romance', 'Fiction focusing on romantic relationships'),
('Horror', 'Fiction intended to frighten, unsettle, or create suspense'),
('Fantasy', 'Fiction involving magical or supernatural elements'),
('Biography', 'Account of someone''s life written by someone else'),
('History', 'Books about past events and civilizations'),
('Science', 'Books about natural sciences and scientific methods');

INSERT INTO Books (title, isbn, author_id, publisher_id, category_id, publication_year, pages, price, copies_available, total_copies) VALUES
('Bang-e-Dra', '978-969-35-0001-1', 1, 1, 7, 1908, 328, 850.00, 5, 8),
('Naqsh-e-Faryadi', '978-969-35-0002-8', 2, 2, 1, 1941, 112, 650.00, 3, 5),
('Zavia', '978-969-35-0003-5', 3, 3, 1, 1982, 432, 750.00, 4, 7),
('Raja Gidh', '978-969-35-0004-2', 4, 1, 1, 1981, 274, 950.00, 2, 6),
('Yusuf bin Tashfin', '978-969-35-0005-9', 5, 4, 8, 1963, 256, 890.00, 6, 9),
('Alakh Nagri', '978-969-35-0006-6', 6, 5, 1, 1973, 447, 1200.00, 3, 7),
('Safina-e-Gham-e-Dil', '978-969-35-0007-3', 7, 6, 1, 1969, 223, 780.00, 8, 12),
('Aag Ka Darya', '978-969-35-0008-0', 8, 7, 1, 1959, 387, 1100.00, 4, 6);

INSERT INTO Members (first_name, last_name, email, phone, address, membership_date, membership_type, status) VALUES
('Muhammad', 'Ali', 'muhammad.ali@gmail.com', '+92-300-1234567', 'Model Town, Lahore, Punjab', '2023-01-15', 'Public', 'Active'),
('Fatima', 'Khan', 'fatima.khan@yahoo.com', '+92-321-9876543', 'Defence Housing Authority, Karachi, Sindh', '2023-02-20', 'Student', 'Active'),
('Ahmed', 'Hassan', 'ahmed.hassan@hotmail.com', '+92-333-4567890', 'F-7 Sector, Islamabad', '2023-03-10', 'Faculty', 'Active'),
('Ayesha', 'Sheikh', 'ayesha.sheikh@gmail.com', '+92-301-2345678', 'Gulberg, Lahore, Punjab', '2023-04-05', 'Public', 'Active'),
('Usman', 'Malik', 'usman.malik@yahoo.com', '+92-345-6789012', 'Clifton, Karachi, Sindh', '2023-05-12', 'Student', 'Active'),
('Zainab', 'Ahmad', 'zainab.ahmad@gmail.com', '+92-302-3456789', 'Hayatabad, Peshawar, KPK', '2023-06-18', 'Public', 'Inactive'),
('Tariq', 'Jamil', 'tariq.jamil@hotmail.com', '+92-336-7890123', 'Satellite Town, Rawalpindi, Punjab', '2023-07-25', 'Faculty', 'Active'),
('Sana', 'Butt', 'sana.butt@gmail.com', '+92-312-4567890', 'Johar Town, Lahore, Punjab', '2023-08-30', 'Student', 'Active');

INSERT INTO Staff (first_name, last_name, position, email, phone, hire_date, salary) VALUES
('Asma', 'Qureshi', 'Head Librarian', 'asma.qureshi@library.edu.pk', '+92-42-11111111', '2020-01-15', 95000.00),
('Bilal', 'Raza', 'Assistant Librarian', 'bilal.raza@library.edu.pk', '+92-42-22222222', '2021-03-20', 65000.00),
('Nadia', 'Siddiqui', 'Library Technician', 'nadia.siddiqui@library.edu.pk', '+92-42-33333333', '2022-05-10', 55000.00),
('Kashif', 'Mahmood', 'Circulation Clerk', 'kashif.mahmood@library.edu.pk', '+92-42-44444444', '2022-08-15', 45000.00),
('Rubina', 'Ashraf', 'Reference Librarian', 'rubina.ashraf@library.edu.pk', '+92-42-55555555', '2021-11-01', 75000.00),
('Faisal', 'Iqbal', 'IT Support', 'faisal.iqbal@library.edu.pk', '+92-42-66666666', '2023-02-14', 70000.00),
('Saima', 'Nawaz', 'Cataloging Specialist', 'saima.nawaz@library.edu.pk', '+92-42-77777777', '2022-09-30', 60000.00),
('Waseem', 'Ahmed', 'Security Guard', 'waseem.ahmed@library.edu.pk', '+92-42-88888888', '2023-01-10', 35000.00);

INSERT INTO Transactions (member_id, book_id, staff_id, issue_date, due_date, return_date, fine_amount, status) VALUES
(1, 1, 2, '2024-01-15', '2024-02-15', '2024-02-10', 0.00, 'Returned'),
(2, 3, 2, '2024-01-20', '2024-02-20', NULL, 0.00, 'Issued'),
(3, 5, 4, '2024-02-01', '2024-03-01', '2024-03-05', 25.00, 'Returned'),
(4, 7, 2, '2024-02-10', '2024-03-10', NULL, 0.00, 'Issued'),
(5, 2, 4, '2024-02-15', '2024-03-15', '2024-03-20', 30.00, 'Returned'),
(1, 6, 2, '2024-03-01', '2024-04-01', NULL, 0.00, 'Issued'),
(6, 4, 4, '2024-03-10', '2024-04-10', '2024-04-08', 0.00, 'Returned'),
(7, 8, 2, '2024-03-15', '2024-04-15', NULL, 0.00, 'Issued'),
(8, 1, 4, '2024-03-20', '2024-04-20', '2024-04-25', 27.50, 'Returned');
`;

/**
 * Initialize database with tables and seed data
 * Safe to run multiple times - will recreate everything
 */
export async function initializeDatabase() {
  const isProd = process.env.NODE_ENV === "production";

  const isRailway =
    process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_PROJECT_ID;

  // Debug logging
  console.log("🔍 Environment debug:", {
    NODE_ENV: process.env.NODE_ENV,
    RAILWAY_ENV: process.env.RAILWAY_ENVIRONMENT_NAME,
    DATABASE_URL: process.env.DATABASE_URL ? "Present" : "Missing",
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
  });

  // Force Railway to use correct database configuration
  let clientConfig;

  if (isRailway || (isProd && process.env.DATABASE_URL)) {
    console.log("🚂 Railway deployment detected - using DATABASE_URL");
    clientConfig = {
      connectionString:
        process.env.DATABASE_URL ||
        "postgresql://postgres:NrpzjStfDtpBRbtGuFofSiDUxkBiTDFd@shinkansen.proxy.rlwy.net:40659/railway",
      ssl: { rejectUnauthorized: false },
    };
  } else {
    console.log("💻 Local development - using individual params");
    clientConfig = {
      host: process.env.DB_HOST || "shinkansen.proxy.rlwy.net",
      user: process.env.DB_USER || "postgres",
      database: process.env.DB_NAME || "railway",
      password: process.env.DB_PASSWORD || "NrpzjStfDtpBRbtGuFofSiDUxkBiTDFd",
      port: parseInt(process.env.DB_PORT) || 40659,
      ...(isProd ? { ssl: { rejectUnauthorized: false } } : {}),
    };
  }

  console.log(
    "🔧 Using config type:",
    isRailway || (isProd && process.env.DATABASE_URL)
      ? "DATABASE_URL"
      : "Individual params"
  );
  const client = new Client(clientConfig);

  try {
    console.log("🔄 Initializing database...");
    await client.connect();
    await client.query(SQL);
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  } finally {
    await client.end();
  }
}

/**
 * Check if database tables exist
 */
export async function isDatabaseInitialized() {
  const isProd = process.env.NODE_ENV === "production";
  const isRailway =
    process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_PROJECT_ID;

  // Force Railway to use correct database configuration
  const clientConfig =
    isRailway || (isProd && process.env.DATABASE_URL)
      ? {
          connectionString:
            process.env.DATABASE_URL ||
            "postgresql://postgres:NrpzjStfDtpBRbtGuFofSiDUxkBiTDFd@shinkansen.proxy.rlwy.net:40659/railway",
          ssl: { rejectUnauthorized: false },
        }
      : {
          host: process.env.DB_HOST || "shinkansen.proxy.rlwy.net",
          user: process.env.DB_USER || "postgres",
          database: process.env.DB_NAME || "railway",
          password:
            process.env.DB_PASSWORD || "NrpzjStfDtpBRbtGuFofSiDUxkBiTDFd",
          port: parseInt(process.env.DB_PORT) || 40659,
          ...(isProd ? { ssl: { rejectUnauthorized: false } } : {}),
        };

  const client = new Client(clientConfig);

  try {
    await client.connect();
    const result = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('authors', 'books', 'categories', 'members')
    `);
    return parseInt(result.rows[0].count) >= 4;
  } catch (error) {
    console.log("📋 Database check failed, will initialize:", error.message);
    return false;
  } finally {
    await client.end();
  }
}
