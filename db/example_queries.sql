-- PostgreSQL Example Queries for Library Management System

-- Query to find overdue books with member details
SELECT m.first_name, m.last_name, m.phone, m.email,
       b.title, t.issue_date, t.due_date,
       (CURRENT_DATE - t.due_date) AS days_overdue
FROM Transactions t
JOIN Members m ON t.member_id = m.member_id
JOIN Books b ON t.book_id = b.book_id
WHERE t.status = 'Issued' 
AND t.due_date < CURRENT_DATE
ORDER BY days_overdue DESC;

-- Query to find most popular books (most borrowed)
SELECT b.title, a.first_name, a.last_name, c.category_name,
       COUNT(t.transaction_id) AS times_borrowed
FROM Books b
JOIN Authors a ON b.author_id = a.author_id
JOIN Categories c ON b.category_id = c.category_id
LEFT JOIN Transactions t ON b.book_id = t.book_id
GROUP BY b.book_id, b.title, a.first_name, a.last_name, c.category_name
ORDER BY times_borrowed DESC
LIMIT 5;

-- Query to find members with highest fines
SELECT m.first_name, m.last_name, m.email, m.phone,
       SUM(t.fine_amount) AS total_fines,
       COUNT(t.transaction_id) AS total_transactions
FROM Members m
JOIN Transactions t ON m.member_id = t.member_id
WHERE t.fine_amount > 0
GROUP BY m.member_id, m.first_name, m.last_name, m.email, m.phone
ORDER BY total_fines DESC;

-- Basic SELECT queries
SELECT title, publication_year 
FROM Books 
ORDER BY publication_year DESC;

-- Select inactive members
SELECT member_id, first_name, last_name, email, status, membership_date
FROM Members 
WHERE status = 'Inactive';

-- Category analysis with book count
SELECT c.category_name, c.priority_level, COUNT(b.book_id) as book_count
FROM Categories c
LEFT JOIN Books b ON c.category_id = b.category_id
GROUP BY c.category_id, c.category_name, c.priority_level
ORDER BY book_count DESC;

-- Books with author and publisher information
SELECT b.title, a.first_name, a.last_name, p.publisher_name
FROM Books b
JOIN Authors a ON b.author_id = a.author_id
JOIN Publishers p ON b.publisher_id = p.publisher_id
ORDER BY b.title;

-- Currently issued books
SELECT m.first_name, m.last_name, b.title, t.issue_date, t.due_date
FROM Transactions t
JOIN Members m ON t.member_id = m.member_id
JOIN Books b ON t.book_id = b.book_id
WHERE t.status = 'Issued';

-- Books grouped by category
SELECT c.category_name, b.title, a.first_name, a.last_name
FROM Books b
JOIN Categories c ON b.category_id = c.category_id
JOIN Authors a ON b.author_id = a.author_id
ORDER BY c.category_name, b.title;

-- Returned transactions with staff information
SELECT m.first_name, m.last_name, b.title, 
       s.first_name AS staff_first_name, s.last_name AS staff_last_name, 
       t.issue_date, t.return_date, t.fine_amount
FROM Transactions t
JOIN Members m ON t.member_id = m.member_id
JOIN Books b ON t.book_id = b.book_id
JOIN Staff s ON t.staff_id = s.staff_id
WHERE t.return_date IS NOT NULL;

-- Publisher statistics
SELECT p.publisher_name, COUNT(b.book_id) as total_books, AVG(b.price) as avg_price
FROM Publishers p
LEFT JOIN Books b ON p.publisher_id = b.publisher_id
GROUP BY p.publisher_id, p.publisher_name
ORDER BY total_books DESC;

-- Books by Pakistani authors 
SELECT title, publication_year, price
FROM Books
WHERE author_id IN (
    SELECT author_id 
    FROM Authors 
    WHERE nationality = 'Pakistani'
);

-- Members who borrowed books published after 1950
SELECT DISTINCT first_name, last_name, email
FROM Members
WHERE member_id IN (
    SELECT member_id 
    FROM Transactions 
    WHERE book_id IN (
        SELECT book_id 
        FROM Books 
        WHERE publication_year > 1950
    )
);

-- Books never borrowed
SELECT title, isbn, price
FROM Books
WHERE book_id NOT IN (
    SELECT DISTINCT book_id 
    FROM Transactions 
    WHERE book_id IS NOT NULL
);

-- Fiction authors
SELECT first_name, last_name, nationality
FROM Authors
WHERE author_id IN (
    SELECT author_id 
    FROM Books 
    WHERE category_id = (
        SELECT category_id 
        FROM Categories 
        WHERE category_name = 'Fiction'
    )
);

-- Books with above average price
SELECT title, price, 
       (SELECT AVG(price) FROM Books) as avg_price
FROM Books
WHERE price > (
    SELECT AVG(price) 
    FROM Books
);

-- Overall book statistics
SELECT COUNT(*) as total_books,
       AVG(price) as average_price,
       MIN(price) as lowest_price,
       MAX(price) as highest_price,
       SUM(total_copies) as total_inventory
FROM Books;

-- Category statistics
SELECT c.category_name, 
       COUNT(b.book_id) as book_count,
       AVG(b.price) as avg_price
FROM Categories c
LEFT JOIN Books b ON c.category_id = b.category_id
GROUP BY c.category_id, c.category_name
ORDER BY book_count DESC;

-- Member statistics by type 
SELECT membership_type,
       COUNT(*) as member_count
FROM Members
GROUP BY membership_type;

-- Count active members by type 
SELECT membership_type,
       COUNT(*) as active_members
FROM Members
WHERE status = 'Active'
GROUP BY membership_type;

-- Staff salary statistics
SELECT position,
       COUNT(*) as staff_count,
       AVG(salary) as avg_salary,
       MIN(salary) as min_salary,
       MAX(salary) as max_salary
FROM Staff
GROUP BY position
ORDER BY avg_salary DESC;

-- Transaction statistics by month
SELECT EXTRACT(YEAR FROM issue_date) as year,
       EXTRACT(MONTH FROM issue_date) as month,
       COUNT(*) as total_transactions,
       SUM(fine_amount) as total_fines,
       AVG(fine_amount) as avg_fine
FROM Transactions
GROUP BY EXTRACT(YEAR FROM issue_date), EXTRACT(MONTH FROM issue_date)
ORDER BY year DESC, month DESC;

-- Pattern matching queries
SELECT title, author_id, publication_year
FROM Books
WHERE title LIKE 'A%'
ORDER BY title;

SELECT first_name, last_name, nationality
FROM Authors
WHERE first_name LIKE '%a%' OR last_name LIKE '%a%';

SELECT first_name, last_name, email
FROM Members
WHERE email LIKE '%@gmail.com' 
   OR email LIKE '%@yahoo.com' 
   OR email LIKE '%@hotmail.com';

SELECT publisher_name, address, established_year
FROM Publishers
WHERE publisher_name LIKE '%Publications%' OR publisher_name LIKE '%Publishers%';

SELECT first_name, last_name, position, phone
FROM Staff
WHERE phone LIKE '+92-42%'
ORDER BY last_name;

-- Example function calls
-- SELECT IssueBook(1, 2, 1, 14);
-- SELECT ReturnBook(1, 25.50);
-- SELECT CalculateOverdueFines(5.00);
-- SELECT * FROM GetMemberHistory(1);
-- SELECT * FROM GetBookAvailabilityReport();