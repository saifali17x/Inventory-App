--
-- PostgreSQL database dump
--

\restrict 4a3wB8mcqUZpaxtcPhhbWYbzaQ9J43l1PHnFmqlQqA4wSP4fJQewI6mrrrjB3Zi

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: member_status_enum; Type: TYPE; Schema: public; Owner: seezy
--

CREATE TYPE public.member_status_enum AS ENUM (
    'Active',
    'Inactive',
    'Suspended'
);



--
-- Name: membership_type_enum; Type: TYPE; Schema: public; Owner: seezy
--

CREATE TYPE public.membership_type_enum AS ENUM (
    'Student',
    'Faculty',
    'Public'
);



--
-- Name: transaction_status_enum; Type: TYPE; Schema: public; Owner: seezy
--

CREATE TYPE public.transaction_status_enum AS ENUM (
    'Issued',
    'Returned',
    'Overdue'
);



SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: seezy
--

CREATE TABLE public.authors (
    author_id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    birth_year integer,
    nationality character varying(50),
    email character varying(100)
);



--
-- Name: authors_author_id_seq; Type: SEQUENCE; Schema: public; Owner: seezy
--

CREATE SEQUENCE public.authors_author_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: authors_author_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: seezy
--

ALTER SEQUENCE public.authors_author_id_seq OWNED BY public.authors.author_id;


--
-- Name: books; Type: TABLE; Schema: public; Owner: seezy
--

CREATE TABLE public.books (
    book_id integer NOT NULL,
    title character varying(200) NOT NULL,
    isbn character varying(20),
    author_id integer,
    publisher_id integer,
    category_id integer,
    publication_year integer,
    pages integer,
    price numeric(10,2),
    copies_available integer DEFAULT 0,
    total_copies integer DEFAULT 0
);



--
-- Name: books_book_id_seq; Type: SEQUENCE; Schema: public; Owner: seezy
--

CREATE SEQUENCE public.books_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: books_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: seezy
--

ALTER SEQUENCE public.books_book_id_seq OWNED BY public.books.book_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: seezy
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    category_name character varying(50) NOT NULL,
    description text,
    priority_level integer DEFAULT 1
);



--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: seezy
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: seezy
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: members; Type: TABLE; Schema: public; Owner: seezy
--

CREATE TABLE public.members (
    member_id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(100),
    phone character varying(20),
    address character varying(200),
    membership_date date,
    membership_type public.membership_type_enum DEFAULT 'Public'::public.membership_type_enum,
    status public.member_status_enum DEFAULT 'Active'::public.member_status_enum
);



--
-- Name: members_member_id_seq; Type: SEQUENCE; Schema: public; Owner: seezy
--

CREATE SEQUENCE public.members_member_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: members_member_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: seezy
--

ALTER SEQUENCE public.members_member_id_seq OWNED BY public.members.member_id;


--
-- Name: publishers; Type: TABLE; Schema: public; Owner: seezy
--

CREATE TABLE public.publishers (
    publisher_id integer NOT NULL,
    publisher_name character varying(100) NOT NULL,
    address character varying(200),
    phone character varying(20),
    email character varying(100),
    established_year integer
);



--
-- Name: publishers_publisher_id_seq; Type: SEQUENCE; Schema: public; Owner: seezy
--

CREATE SEQUENCE public.publishers_publisher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: publishers_publisher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: seezy
--

ALTER SEQUENCE public.publishers_publisher_id_seq OWNED BY public.publishers.publisher_id;


--
-- Name: staff; Type: TABLE; Schema: public; Owner: seezy
--

CREATE TABLE public.staff (
    staff_id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    "position" character varying(50),
    email character varying(100),
    phone character varying(20),
    hire_date date,
    salary numeric(10,2)
);



--
-- Name: staff_staff_id_seq; Type: SEQUENCE; Schema: public; Owner: seezy
--

CREATE SEQUENCE public.staff_staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: staff_staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: seezy
--

ALTER SEQUENCE public.staff_staff_id_seq OWNED BY public.staff.staff_id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: seezy
--

CREATE TABLE public.transactions (
    transaction_id integer NOT NULL,
    member_id integer,
    book_id integer,
    staff_id integer,
    issue_date date,
    due_date date,
    return_date date,
    fine_amount numeric(8,2) DEFAULT 0.00,
    status public.transaction_status_enum DEFAULT 'Issued'::public.transaction_status_enum
);



--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: seezy
--

CREATE SEQUENCE public.transactions_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: seezy
--

ALTER SEQUENCE public.transactions_transaction_id_seq OWNED BY public.transactions.transaction_id;


--
-- Name: authors author_id; Type: DEFAULT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.authors ALTER COLUMN author_id SET DEFAULT nextval('public.authors_author_id_seq'::regclass);


--
-- Name: books book_id; Type: DEFAULT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.books ALTER COLUMN book_id SET DEFAULT nextval('public.books_book_id_seq'::regclass);


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: members member_id; Type: DEFAULT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.members ALTER COLUMN member_id SET DEFAULT nextval('public.members_member_id_seq'::regclass);


--
-- Name: publishers publisher_id; Type: DEFAULT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.publishers ALTER COLUMN publisher_id SET DEFAULT nextval('public.publishers_publisher_id_seq'::regclass);


--
-- Name: staff staff_id; Type: DEFAULT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.staff ALTER COLUMN staff_id SET DEFAULT nextval('public.staff_staff_id_seq'::regclass);


--
-- Name: transactions transaction_id; Type: DEFAULT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.transactions ALTER COLUMN transaction_id SET DEFAULT nextval('public.transactions_transaction_id_seq'::regclass);


--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: seezy
--

COPY public.authors (author_id, first_name, last_name, birth_year, nationality, email) FROM stdin;
1	Allama	Iqbal	1877	Pakistani	allama.iqbal@gmail.com
2	Faiz	Ahmad	1911	Pakistani	faiz.ahmad@yahoo.com
3	Ashfaq	Ahmed	1925	Pakistani	ashfaq.ahmed@hotmail.com
4	Bano	Qudsia	1928	Pakistani	bano.qudsia@gmail.com
5	Naseem	Hijazi	1914	Pakistani	naseem.hijazi@yahoo.com
6	Mumtaz	Mufti	1905	Pakistani	mumtaz.mufti@gmail.com
7	Ahmad	Nadeem	1916	Pakistani	ahmad.nadeem@hotmail.com
8	Qurratulain	Hyder	1927	Pakistani	qurratulain.hyder@gmail.com
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: seezy
--

COPY public.books (book_id, title, isbn, author_id, publisher_id, category_id, publication_year, pages, price, copies_available, total_copies) FROM stdin;
1	Bang-e-Dra	978-969-35-0001-1	1	1	7	1908	328	850.00	5	8
2	Naqsh-e-Faryadi	978-969-35-0002-8	2	2	1	1941	112	650.00	3	5
3	Zavia	978-969-35-0003-5	3	3	1	1982	432	750.00	4	7
4	Raja Gidh	978-969-35-0004-2	4	1	1	1981	274	950.00	2	6
5	Yusuf bin Tashfin	978-969-35-0005-9	5	4	8	1963	256	890.00	6	9
6	Alakh Nagri	978-969-35-0006-6	6	5	1	1973	447	1200.00	3	7
7	Safina-e-Gham-e-Dil	978-969-35-0007-3	7	6	1	1969	223	780.00	8	12
8	Aag Ka Darya	978-969-35-0008-0	8	7	1	1959	387	1100.00	4	6
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: seezy
--

COPY public.categories (category_id, category_name, description, priority_level) FROM stdin;
1	Fiction	Literary works of imaginative narration	1
2	Mystery	Books involving puzzles, crimes, and detective work	1
3	Science Fiction	Fiction dealing with futuristic concepts and technology	1
4	Romance	Fiction focusing on romantic relationships	1
5	Horror	Fiction intended to frighten, unsettle, or create suspense	1
6	Fantasy	Fiction involving magical or supernatural elements	1
7	Biography	Account of someone's life written by someone else	1
8	History	Books about past events and civilizations	1
9	Science	Books about natural sciences and scientific methods	1
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: seezy
--

COPY public.members (member_id, first_name, last_name, email, phone, address, membership_date, membership_type, status) FROM stdin;
1	Muhammad	Ali	muhammad.ali@gmail.com	+92-300-1234567	Model Town, Lahore, Punjab	2023-01-15	Public	Active
2	Fatima	Khan	fatima.khan@yahoo.com	+92-321-9876543	Defence Housing Authority, Karachi, Sindh	2023-02-20	Student	Active
3	Ahmed	Hassan	ahmed.hassan@hotmail.com	+92-333-4567890	F-7 Sector, Islamabad	2023-03-10	Faculty	Active
4	Ayesha	Sheikh	ayesha.sheikh@gmail.com	+92-301-2345678	Gulberg, Lahore, Punjab	2023-04-05	Public	Active
5	Usman	Malik	usman.malik@yahoo.com	+92-345-6789012	Clifton, Karachi, Sindh	2023-05-12	Student	Active
6	Zainab	Ahmad	zainab.ahmad@gmail.com	+92-302-3456789	Hayatabad, Peshawar, KPK	2023-06-18	Public	Inactive
7	Tariq	Jamil	tariq.jamil@hotmail.com	+92-336-7890123	Satellite Town, Rawalpindi, Punjab	2023-07-25	Faculty	Active
8	Sana	Butt	sana.butt@gmail.com	+92-312-4567890	Johar Town, Lahore, Punjab	2023-08-30	Student	Active
\.


--
-- Data for Name: publishers; Type: TABLE DATA; Schema: public; Owner: seezy
--

COPY public.publishers (publisher_id, publisher_name, address, phone, email, established_year) FROM stdin;
1	Sang-e-Meel Publications	Lower Mall, Lahore, Punjab	+92-42-37220100	info@sang-e-meel.com	1960
2	Oxford University Press Pakistan	No. 38, Sector 15, Korangi Industrial Area, Karachi	+92-21-35090300	enquiry@oup.com.pk	1951
3	Maktaba Jamal	Urdu Bazaar, Lahore, Punjab	+92-42-37630145	info@maktabajamal.com	1945
4	Ferozsons Publishers	Feroz Palace, 60 Shahrah-e-Quaid-e-Azam, Lahore	+92-42-37220081	info@ferozsons.com.pk	1894
5	National Book Foundation	Bird Wood Road, Karachi, Sindh	+92-21-99213143	info@nbf.gov.pk	1972
6	Caravan Book House	Saddar, Lahore, Punjab	+92-42-37320652	caravan@caravanbooks.com	1955
7	Al-Faisal Nashiran	Shah Alam Market, Lahore, Punjab	+92-42-37354287	alfaisal@publishers.pk	1968
8	Liberty Books	Liberty Market, Gulberg III, Lahore	+92-42-35758784	info@libertybooks.com	1970
\.


--
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: seezy
--

COPY public.staff (staff_id, first_name, last_name, "position", email, phone, hire_date, salary) FROM stdin;
1	Asma	Qureshi	Head Librarian	asma.qureshi@library.edu.pk	+92-42-11111111	2020-01-15	95000.00
2	Bilal	Raza	Assistant Librarian	bilal.raza@library.edu.pk	+92-42-22222222	2021-03-20	65000.00
3	Nadia	Siddiqui	Library Technician	nadia.siddiqui@library.edu.pk	+92-42-33333333	2022-05-10	55000.00
4	Kashif	Mahmood	Circulation Clerk	kashif.mahmood@library.edu.pk	+92-42-44444444	2022-08-15	45000.00
5	Rubina	Ashraf	Reference Librarian	rubina.ashraf@library.edu.pk	+92-42-55555555	2021-11-01	75000.00
6	Faisal	Iqbal	IT Support	faisal.iqbal@library.edu.pk	+92-42-66666666	2023-02-14	70000.00
7	Saima	Nawaz	Cataloging Specialist	saima.nawaz@library.edu.pk	+92-42-77777777	2022-09-30	60000.00
8	Waseem	Ahmed	Security Guard	waseem.ahmed@library.edu.pk	+92-42-88888888	2023-01-10	35000.00
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: seezy
--

COPY public.transactions (transaction_id, member_id, book_id, staff_id, issue_date, due_date, return_date, fine_amount, status) FROM stdin;
1	1	1	2	2024-01-15	2024-02-15	2024-02-10	0.00	Returned
2	2	3	2	2024-01-20	2024-02-20	\N	0.00	Issued
3	3	5	4	2024-02-01	2024-03-01	2024-03-05	25.00	Returned
4	4	7	2	2024-02-10	2024-03-10	\N	0.00	Issued
5	5	2	4	2024-02-15	2024-03-15	2024-03-20	30.00	Returned
6	1	6	2	2024-03-01	2024-04-01	\N	0.00	Issued
7	6	4	4	2024-03-10	2024-04-10	2024-04-08	0.00	Returned
8	7	8	2	2024-03-15	2024-04-15	\N	0.00	Issued
9	8	1	4	2024-03-20	2024-04-20	2024-04-25	27.50	Returned
\.


--
-- Name: authors_author_id_seq; Type: SEQUENCE SET; Schema: public; Owner: seezy
--

SELECT pg_catalog.setval('public.authors_author_id_seq', 8, true);


--
-- Name: books_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: seezy
--

SELECT pg_catalog.setval('public.books_book_id_seq', 8, true);


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: seezy
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 9, true);


--
-- Name: members_member_id_seq; Type: SEQUENCE SET; Schema: public; Owner: seezy
--

SELECT pg_catalog.setval('public.members_member_id_seq', 8, true);


--
-- Name: publishers_publisher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: seezy
--

SELECT pg_catalog.setval('public.publishers_publisher_id_seq', 8, true);


--
-- Name: staff_staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: seezy
--

SELECT pg_catalog.setval('public.staff_staff_id_seq', 8, true);


--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: seezy
--

SELECT pg_catalog.setval('public.transactions_transaction_id_seq', 9, true);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (author_id);


--
-- Name: books books_isbn_key; Type: CONSTRAINT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_isbn_key UNIQUE (isbn);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (book_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: members members_email_key; Type: CONSTRAINT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_email_key UNIQUE (email);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (member_id);


--
-- Name: publishers publishers_pkey; Type: CONSTRAINT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.publishers
    ADD CONSTRAINT publishers_pkey PRIMARY KEY (publisher_id);


--
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (staff_id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: books books_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.authors(author_id) ON DELETE RESTRICT;


--
-- Name: books books_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE;


--
-- Name: books books_publisher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_publisher_id_fkey FOREIGN KEY (publisher_id) REFERENCES public.publishers(publisher_id) ON DELETE CASCADE;


--
-- Name: transactions transactions_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: transactions transactions_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id) ON DELETE CASCADE;


--
-- Name: transactions transactions_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: seezy
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict 4a3wB8mcqUZpaxtcPhhbWYbzaQ9J43l1PHnFmqlQqA4wSP4fJQewI6mrrrjB3Zi

