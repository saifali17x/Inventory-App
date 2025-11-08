import pool from "./pool.js";

// BOOKS QUERIES
export const getAllBooks = async () => {
  const { rows } = await pool.query(`
    SELECT b.*, a.first_name, a.last_name, c.category_name, p.publisher_name
    FROM Books b
    JOIN Authors a ON b.author_id = a.author_id
    JOIN Categories c ON b.category_id = c.category_id
    JOIN Publishers p ON b.publisher_id = p.publisher_id
    ORDER BY b.title
  `);
  return rows;
};

export const getBookById = async (id) => {
  const { rows } = await pool.query(
    `
    SELECT b.*, a.first_name, a.last_name, c.category_name, p.publisher_name
    FROM Books b
    JOIN Authors a ON b.author_id = a.author_id
    JOIN Categories c ON b.category_id = c.category_id
    JOIN Publishers p ON b.publisher_id = p.publisher_id
    WHERE b.book_id = $1
  `,
    [id]
  );
  return rows[0];
};

export const createBook = async (bookData) => {
  const {
    title,
    isbn,
    author_id,
    publisher_id,
    category_id,
    publication_year,
    pages,
    price,
    copies_available,
    total_copies,
  } = bookData;
  const { rows } = await pool.query(
    `
    INSERT INTO Books (title, isbn, author_id, publisher_id, category_id, publication_year, pages, price, copies_available, total_copies)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `,
    [
      title,
      isbn,
      author_id,
      publisher_id,
      category_id,
      publication_year,
      pages,
      price,
      copies_available,
      total_copies,
    ]
  );
  return rows[0];
};

export const updateBook = async (id, bookData) => {
  const {
    title,
    isbn,
    author_id,
    publisher_id,
    category_id,
    publication_year,
    pages,
    price,
    copies_available,
    total_copies,
  } = bookData;
  const { rows } = await pool.query(
    `
    UPDATE Books 
    SET title = $1, isbn = $2, author_id = $3, publisher_id = $4, category_id = $5, 
        publication_year = $6, pages = $7, price = $8, copies_available = $9, total_copies = $10
    WHERE book_id = $11
    RETURNING *
  `,
    [
      title,
      isbn,
      author_id,
      publisher_id,
      category_id,
      publication_year,
      pages,
      price,
      copies_available,
      total_copies,
      id,
    ]
  );
  return rows[0];
};

export const deleteBook = async (id) => {
  await pool.query("DELETE FROM Books WHERE book_id = $1", [id]);
};

// AUTHORS QUERIES
export const getAllAuthors = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM Authors ORDER BY last_name, first_name"
  );
  return rows;
};

export const getAuthorById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM Authors WHERE author_id = $1",
    [id]
  );
  return rows[0];
};

export const getAuthorWithBooks = async (id) => {
  const author = await getAuthorById(id);
  const { rows } = await pool.query(
    `
    SELECT b.*, c.category_name, p.publisher_name
    FROM Books b
    JOIN Categories c ON b.category_id = c.category_id
    JOIN Publishers p ON b.publisher_id = p.publisher_id
    WHERE b.author_id = $1
    ORDER BY b.title
  `,
    [id]
  );
  return { author, books: rows };
};

export const createAuthor = async (authorData) => {
  const { first_name, last_name, birth_year, nationality, email } = authorData;
  const { rows } = await pool.query(
    `
    INSERT INTO Authors (first_name, last_name, birth_year, nationality, email)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `,
    [first_name, last_name, birth_year, nationality, email]
  );
  return rows[0];
};

export const updateAuthor = async (id, authorData) => {
  const { first_name, last_name, birth_year, nationality, email } = authorData;
  const { rows } = await pool.query(
    `
    UPDATE Authors 
    SET first_name = $1, last_name = $2, birth_year = $3, nationality = $4, email = $5
    WHERE author_id = $6
    RETURNING *
  `,
    [first_name, last_name, birth_year, nationality, email, id]
  );
  return rows[0];
};

export const deleteAuthor = async (id) => {
  await pool.query("DELETE FROM Authors WHERE author_id = $1", [id]);
};

// CATEGORIES QUERIES
export const getAllCategories = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM Categories ORDER BY category_name"
  );
  return rows;
};

export const getCategoryById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM Categories WHERE category_id = $1",
    [id]
  );
  return rows[0];
};

export const getCategoryWithBooks = async (id) => {
  const category = await getCategoryById(id);
  const { rows } = await pool.query(
    `
    SELECT b.*, a.first_name, a.last_name, p.publisher_name
    FROM Books b
    JOIN Authors a ON b.author_id = a.author_id
    JOIN Publishers p ON b.publisher_id = p.publisher_id
    WHERE b.category_id = $1
    ORDER BY b.title
  `,
    [id]
  );
  return { category, books: rows };
};

export const createCategory = async (categoryData) => {
  const { category_name, description, priority_level } = categoryData;
  const { rows } = await pool.query(
    `
    INSERT INTO Categories (category_name, description, priority_level)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
    [category_name, description, priority_level || 1]
  );
  return rows[0];
};

export const updateCategory = async (id, categoryData) => {
  const { category_name, description, priority_level } = categoryData;
  const { rows } = await pool.query(
    `
    UPDATE Categories 
    SET category_name = $1, description = $2, priority_level = $3
    WHERE category_id = $4
    RETURNING *
  `,
    [category_name, description, priority_level, id]
  );
  return rows[0];
};

export const deleteCategory = async (id) => {
  await pool.query("DELETE FROM Categories WHERE category_id = $1", [id]);
};

// PUBLISHERS QUERIES
export const getAllPublishers = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM Publishers ORDER BY publisher_name"
  );
  return rows;
};

export const getPublisherById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM Publishers WHERE publisher_id = $1",
    [id]
  );
  return rows[0];
};

export const createPublisher = async (publisherData) => {
  const { publisher_name, address, phone, email, established_year } =
    publisherData;
  const { rows } = await pool.query(
    `
    INSERT INTO Publishers (publisher_name, address, phone, email, established_year)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `,
    [publisher_name, address, phone, email, established_year]
  );
  return rows[0];
};

export const updatePublisher = async (id, publisherData) => {
  const { publisher_name, address, phone, email, established_year } =
    publisherData;
  const { rows } = await pool.query(
    `
    UPDATE Publishers 
    SET publisher_name = $1, address = $2, phone = $3, email = $4, established_year = $5
    WHERE publisher_id = $6
    RETURNING *
  `,
    [publisher_name, address, phone, email, established_year, id]
  );
  return rows[0];
};

export const deletePublisher = async (id) => {
  await pool.query("DELETE FROM Publishers WHERE publisher_id = $1", [id]);
};

// MEMBERS QUERIES
export const getAllMembers = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM Members ORDER BY last_name, first_name"
  );
  return rows;
};

export const getMemberById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM Members WHERE member_id = $1",
    [id]
  );
  return rows[0];
};

export const createMember = async (memberData) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    membership_date,
    membership_type,
    status,
  } = memberData;
  const { rows } = await pool.query(
    `
    INSERT INTO Members (first_name, last_name, email, phone, address, membership_date, membership_type, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,
    [
      first_name,
      last_name,
      email,
      phone,
      address,
      membership_date,
      membership_type || "Public",
      status || "Active",
    ]
  );
  return rows[0];
};

export const updateMember = async (id, memberData) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    membership_date,
    membership_type,
    status,
  } = memberData;
  const { rows } = await pool.query(
    `
    UPDATE Members 
    SET first_name = $1, last_name = $2, email = $3, phone = $4, address = $5, 
        membership_date = $6, membership_type = $7, status = $8
    WHERE member_id = $9
    RETURNING *
  `,
    [
      first_name,
      last_name,
      email,
      phone,
      address,
      membership_date,
      membership_type,
      status,
      id,
    ]
  );
  return rows[0];
};

export const deleteMember = async (id) => {
  await pool.query("DELETE FROM Members WHERE member_id = $1", [id]);
};

// TRANSACTIONS QUERIES
export const getAllTransactions = async () => {
  const { rows } = await pool.query(`
    SELECT t.*, m.first_name as member_first_name, m.last_name as member_last_name,
           b.title, s.first_name as staff_first_name, s.last_name as staff_last_name
    FROM Transactions t
    JOIN Members m ON t.member_id = m.member_id
    JOIN Books b ON t.book_id = b.book_id
    JOIN Staff s ON t.staff_id = s.staff_id
    ORDER BY t.issue_date DESC
  `);
  return rows;
};

export const getActiveTransactions = async () => {
  const { rows } = await pool.query(`
    SELECT t.*, m.first_name as member_first_name, m.last_name as member_last_name,
           b.title, s.first_name as staff_first_name, s.last_name as staff_last_name
    FROM Transactions t
    JOIN Members m ON t.member_id = m.member_id
    JOIN Books b ON t.book_id = b.book_id
    JOIN Staff s ON t.staff_id = s.staff_id
    WHERE t.status = 'Issued'
    ORDER BY t.due_date
  `);
  return rows;
};

export const getOverdueTransactions = async () => {
  const { rows } = await pool.query(`
    SELECT t.*, m.first_name as member_first_name, m.last_name as member_last_name,
           b.title, s.first_name as staff_first_name, s.last_name as staff_last_name,
           (CURRENT_DATE - t.due_date) AS days_overdue
    FROM Transactions t
    JOIN Members m ON t.member_id = m.member_id
    JOIN Books b ON t.book_id = b.book_id
    JOIN Staff s ON t.staff_id = s.staff_id
    WHERE t.status = 'Issued' AND t.due_date < CURRENT_DATE
    ORDER BY days_overdue DESC
  `);
  return rows;
};

// DASHBOARD QUERIES
export const getDashboardStats = async () => {
  const totalBooks = await pool.query("SELECT COUNT(*) as count FROM Books");
  const totalMembers = await pool.query(
    "SELECT COUNT(*) as count FROM Members WHERE status = 'Active'"
  );
  const activeTransactions = await pool.query(
    "SELECT COUNT(*) as count FROM Transactions WHERE status = 'Issued'"
  );
  const overdueBooks = await pool.query(
    "SELECT COUNT(*) as count FROM Transactions WHERE status = 'Issued' AND due_date < CURRENT_DATE"
  );

  return {
    totalBooks: totalBooks.rows[0].count,
    totalMembers: totalMembers.rows[0].count,
    activeTransactions: activeTransactions.rows[0].count,
    overdueBooks: overdueBooks.rows[0].count,
  };
};
