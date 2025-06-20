-- PostgreSQL database dump
-- Version 14.8
-- https://www.postgresql.org/

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
-- Name: bookloop; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE bookloop WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.UTF-8';


\connect bookloop

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
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: EXTENSION plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION "uuid-ossp"; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA pg_catalog;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: books; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.books (
    book_id integer NOT NULL,
    seller_id integer NOT NULL,
    category_id integer,
    images_id integer,
    isbn_code character varying(255),
    condition character varying(255),
    publication_date character varying(255),
    googlebooksid character varying(255),
    title character varying(255) NOT NULL,
    authors jsonb,
    description text,
    publisheddate character varying(255),
    isbn character varying(255),
    pagecount integer,
    imageurl character varying(1000),
    coverimageurl character varying(1000),
    categories jsonb,
    language character varying(255),
    averagerating real,
    quantity integer DEFAULT 1,
    available boolean DEFAULT true,
    price numeric(10,2) DEFAULT 99.99 NOT NULL,
    createdat timestamp without time zone NOT NULL,
    updatedat timestamp without time zone NOT NULL,
    publisher character varying(255)
);


--
-- Name: books_book_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.books_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: books_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.books_book_id_seq OWNED BY public.books.book_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    category_name character varying(255) NOT NULL
);


--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.images (
    image_id integer NOT NULL,
    book_id integer NOT NULL,
    image_url text NOT NULL
);


--
-- Name: images_image_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.images_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: images_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.images_image_id_seq OWNED BY public.images.image_id;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id integer NOT NULL,
    direccion character varying(255),
    telefono character varying(255),
    ciudad character varying(255),
    pais character varying(255),
    codigopostal character varying(255),
    userid integer NOT NULL,
    createdat timestamp without time zone NOT NULL,
    updatedat timestamp without time zone NOT NULL
);


--
-- Name: profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.profiles_id_seq OWNED BY public.profiles.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    transaction_id integer NOT NULL,
    buyer_id integer NOT NULL,
    book_id integer NOT NULL,
    experience_rate integer NOT NULL,
    book_rate integer NOT NULL,
    seller_rate integer NOT NULL,
    comment text,
    review_date timestamp without time zone NOT NULL
);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name character varying(255) NOT NULL
);


--
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_role_id_seq OWNED BY public.roles.role_id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    transaction_id integer NOT NULL,
    seller_id integer NOT NULL,
    buyer_id integer NOT NULL,
    book_id integer NOT NULL,
    transaction_date timestamp without time zone NOT NULL,
    message text
);


--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transactions_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transactions_transaction_id_seq OWNED BY public.transactions.transaction_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(255) DEFAULT 'user'::character varying,
    nombre character varying(50) NOT NULL,
    apellido character varying(50) NOT NULL,
    activo boolean DEFAULT true,
    createdat timestamp without time zone NOT NULL,
    updatedat timestamp without time zone NOT NULL,
    role_id integer
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: wishlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wishlist (
    wishlist_id integer NOT NULL,
    user_id integer NOT NULL,
    book_id integer NOT NULL,
    created_at timestamp without time zone
);


--
-- Name: wishlist_wishlist_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.wishlist_wishlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: wishlist_wishlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.wishlist_wishlist_id_seq OWNED BY public.wishlist.wishlist_id;


--
-- Name: books book_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books ALTER COLUMN book_id SET DEFAULT nextval('public.books_book_id_seq'::regclass);


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: images image_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images ALTER COLUMN image_id SET DEFAULT nextval('public.images_image_id_seq'::regclass);


--
-- Name: profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles ALTER COLUMN id SET DEFAULT nextval('public.profiles_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Name: roles role_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);


--
-- Name: transactions transaction_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions ALTER COLUMN transaction_id SET DEFAULT nextval('public.transactions_transaction_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: wishlist wishlist_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist ALTER COLUMN wishlist_id SET DEFAULT nextval('public.wishlist_wishlist_id_seq'::regclass);


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.books (book_id, seller_id, category_id, images_id, isbn_code, condition, publication_date, googlebooksid, title, authors, description, publisheddate, isbn, pagecount, imageurl, coverimageurl, categories, language, averagerating, quantity, available, price, createdat, updatedat, publisher) VALUES
(16, 4, 6, NULL, '9780307474278', 'Nuevo', '2009-03-31', NULL, 'The Da Vinci Code', '["Dan Brown"]', '#1 WORLDWIDE BESTSELLER • While in Paris, Harvard symbologist Robert Langdon is awakened by a phone call in the dead of the night. The elderly curator of the Louvre has been murdered inside the museum, his body covered in baffling symbols. "Blockbuster perfection.... A gleefully erudite suspense novel." —The New York Times "A pulse-quickening, brain-teasing adventure." —People As Langdon and gifted French cryptologist Sophie Neveu sort through the bizarre riddles, they are stunned to discover a trail of clues hidden in the works of Leonardo da Vinci—clues visible for all to see and yet ingeniously disguised by the painter. Even more startling, the late curator was involved in the Priory of Sion—a secret society whose members included Sir Isaac Newton, Victor Hugo, and Da Vinci—and he guarded a breathtaking historical secret. Unless Langdon and Neveu can decipher the labyrinthine puzzle—while avoiding the faceless adversary who shadows their every move—the explosive, ancient truth will be lost forever.', NULL, NULL, 610, '/uploads/1749785064216-991042173.jpg', NULL, '[]', 'en', NULL, 1, true, 3000.00, '2025-05-27 02:17:03', '2025-06-13 03:35:53', 'Planeta'),
(17, 4, 5, NULL, '9780544003415', 'Bueno', '2025-06-11', NULL, 'The Lord of the Rings', '["J. R. R. Tolkien"]', 'Presents the epic depicting the Great War of the Ring, a struggle between good and evil in Middle-earth, following the odyssey of Frodo the hobbit and his companions on a quest to destroy the Ring of Power.', NULL, NULL, 1178, '/uploads/1748312375028-452432862.png', '/uploads/1748312375028-452432862.png', '[]', 'en', NULL, 1, true, 44444.00, '2025-05-27 02:19:35', '2025-06-13 04:46:24', 'Penguin'),
(20, 5, 9, NULL, '9780140283334', 'Aceptable', '1999-10-01', NULL, 'Lord of the Flies', '["William Golding"]', 'Lord of the Flies remains as provocative today as when it was first published in 1954, igniting passionate debate with its startling, brutal portrait of human nature. Though critically acclaimed, it was largely ignored upon its initial publication. Yet soon it became a cult favorite among both students and literary critics who compared it to J.D. Salinger''s The Catcher in the Rye in its influence on modern thought and literature. William Golding''s compelling story about a group of very ordinary small boys marooned on a coral island has become a modern classic. At first it seems as though it is all going to be great fun; but the fun before long becomes furious and life on the island turns into a nightmare of panic and death. As ordinary standards of behaviour collapse, the whole world the boys know collapses with them—the world of cricket and homework and adventure stories—and another world is revealed beneath, primitive and terrible. Labeled a parable, an allegory, a myth, a morality tale, a parody, a political treatise, even a vision of the apocalypse, Lord of the Flies has established itself as a true classic. "Lord of the Flies is one of my favorite books. That was a big influence on me as a teenager, I still read it every couple of years." —Suzanne Collins, author of The Hunger Games "As exciting, relevant, and thought-provoking now as it was when Golding published it in 1954." —Stephen King', NULL, NULL, 1200, '/uploads/1748378760773-817602128.jpg', NULL, '[]', 'en', NULL, 1, true, 7500.00, '2025-05-27 20:46:00', '2025-06-13 03:29:18', 'Cafe'),
(21, 4, 5, NULL, '9780061122415', 'Como nuevo', '2006', NULL, 'To Kill a Mockingbird', '["Harper Lee"]', '...resumen...', NULL, NULL, 336, '/uploads/1749784002862-464954884.jpg', NULL, '[]', 'en', NULL, 1, true, 6000.00, '2025-05-27 02:17:03', '2025-06-13 03:06:42', 'Harper Perennial Modern Classics'),
(23, 4, 3, NULL, '9780140449266', 'Como nuevo', '2025-06-10', NULL, 'The Odyssey', '["Homer"]', '...resumen...', NULL, NULL, 560, '/uploads/1748312375028-452432862.png', NULL, '[]', 'en', NULL, 1, true, 7000.00, '2025-05-27 02:17:03', '2025-06-13 04:31:49', 'Penguin Classics'),
(29, 4, 5, NULL, '9780451524935', 'Como nuevo', '1950', NULL, '1984', '["George Orwell"]', '...resumen...', NULL, NULL, 328, '/uploads/1749784981768-750340431.jpg', '/uploads/1749784981768-750340431.jpg', '[]', 'en', NULL, 1, true, 8000.00, '2025-05-27 02:17:03', '2025-06-13 04:49:10', 'Signet Classics'),
(33, 4, 5, NULL, '9780142437230', 'Aceptable', '2002', NULL, 'Moby-Dick', '["Herman Melville"]', '...resumen...', NULL, NULL, 720, '/uploads/1749785279483-551536488.webp', NULL, '[]', 'en', NULL, 1, true, 8800.00, '2025-05-27 02:17:03', '2025-06-13 03:34:21', 'Penguin Classics'),
(34, 4, 7, NULL, '9780140449136', 'Aceptable', '2007', NULL, 'Crime and Punishment', '["Fyodor Dostoevsky"]', '...resumen...', NULL, NULL, 720, '/uploads/1749785171068-85007806.jpg', NULL, '[]', 'en', NULL, 1, true, 7700.00, '2025-05-27 02:17:03', '2025-06-13 04:21:48', 'Penguin Classics'),
(36, 4, 9, NULL, '9780679783275', 'Como nuevo', '1999', NULL, 'Pride and Prejudice', '["Jane Austen"]', '...resumen...', NULL, NULL, 480, '/uploads/1749783334074-378473697.jpg', NULL, '[]', 'en', NULL, 1, true, 6600.00, '2025-05-27 02:17:03', '2025-06-13 04:29:34', 'Vintage');


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categories (category_id, category_name) VALUES
(1, 'Novela'),
(2, 'Cuento'),
(3, 'Poesía'),
(4, 'Drama'),
(5, 'Ciencia ficción'),
(6, 'Fantasía'),
(7, 'Misterio'),
(8, 'Terror'),
(9, 'Romance'),
(10, 'Deportes'),
(11, 'Realistas'),
(12, 'Salud'),
(13, 'Tecnología'),
(14, 'Ciencias'),
(15, 'Escolar'),
(16, 'Filosofía');


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.images (image_id, book_id, image_url) VALUES
(10, 17, '/uploads/1748312375028-452432862.png'),
(11, 17, '/uploads/1748312375046-579867956.jpg'),
(16, 20, '/uploads/1748378760745-386470253.png'),
(17, 20, '/uploads/1748378760773-817602128.jpg'),
(18, 20, '/uploads/1748378760745-386470253.png'),
(19, 23, '/uploads/1748312375028-452432862.png'),
(21, 23, '/uploads/1749784797833-437540278.jpg'),
(23, 29, '/uploads/1749784981768-750340431.jpg'),
(24, 16, '/uploads/1749785064216-991042173.jpg'),
(26, 34, '/uploads/1749785171068-85007806.jpg'),
(28, 33, '/uploads/1749785279483-551536488.webp'),
(29, 20, '/uploads/1749783380647-331037118.jpg'),
(30, 36, '/uploads/1749783334074-378473697.jpg'),
(33, 29, '/uploads/1749790143096-942280971.jpg');


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.profiles (id, direccion, telefono, ciudad, pais, codigopostal, userid, createdat, updatedat) VALUES
(1, NULL, NULL, NULL, NULL, NULL, 2, '2025-05-24 17:47:32', '2025-05-24 17:47:32'),
(3, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-27 02:06:03', '2025-05-27 02:06:03'),
(4, NULL, NULL, NULL, NULL, NULL, 5, '2025-05-27 20:42:33', '2025-05-27 20:42:33');


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.roles (role_id, role_name) VALUES
(1, 'user'),
(2, 'admin');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users (id, username, email, password, role, nombre, apellido, activo, createdat, updatedat, role_id) VALUES
(2, 'katiadle', 'katiadle@gmail.com', '$2a$10$YxDsk63QzQKz5hc9CcT7OupujBwUZ5k/FV8/8o2xOQS9UeSYtaX22', 'user', 'Katja', 'Adle', true, '2025-05-24 17:47:32', '2025-05-24 21:26:39', NULL),
(4, 'valentinaadle', 'valentinaadle1@gmail.com', '$2a$10$uIV2s1t9OzC7x2e2yReBGuiA5f7k60gD.RAIPBh1b7.ahJXO8TXwS', 'user', 'Valentina', 'Adle', true, '2025-05-27 02:06:02', '2025-05-27 02:06:02', NULL),
(5, 'andresbleck', 'andres.bleckwedel2@gmail.com', '$2a$10$TyRmyHm8WaVGXzaD1eOq6uctr/x44/oXaTI1RBwf.AmPW5JFsRkDO', 'user', 'andres', 'bleck', true, '2025-05-27 20:42:32', '2025-05-27 20:42:32', NULL),
(7, 'adminbl', 'itsbookloop@gmail.com', '$2a$10$9.v5Pn/qnJC3WyhcdMR5Q.NlnTRRbJKk/eU3xQL3x8fIva7l9upom', 'admin', 'Admin', 'BookLoop', true, '2025-06-12 20:17:24', '2025-06-12 20:17:24', 2),
(10, 'katiadle1', 'katiadle1@gmail.com', '$2a$10$TyujLnrALVX4XIKF/gJNOeY.KC/Anbw6ml76FXkmVFzfBkLv8reVi', 'user', 'Kati', 'Adle', true, '2025-06-13 04:50:45', '2025-06-13 04:50:45', NULL);


--
-- Data for Name: wishlist; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.wishlist (wishlist_id, user_id, book_id, created_at) VALUES
(5, 4, 20, '2025-06-13 03:15:04'),
(6, 4, 36, '2025-06-13 03:35:16'),
(8, 10, 20, '2025-06-13 04:51:07');


--
-- Name: books_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.books_book_id_seq', 36, true);


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 16, true);


--
-- Name: images_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.images_image_id_seq', 33, true);


--
-- Name: profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.profiles_id_seq', 4, true);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 1, false);


--
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 2, true);


--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transactions_transaction_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- Name: wishlist_wishlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.wishlist_wishlist_id_seq', 8, true);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (book_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (image_id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: wishlist wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_pkey PRIMARY KEY (wishlist_id);


--
-- Name: books books_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON UPDATE CASCADE;


--
-- Name: books books_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: images images_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: profiles profiles_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON UPDATE CASCADE;


--
-- Name: reviews reviews_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: reviews reviews_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(transaction_id) ON UPDATE CASCADE;


--
-- Name: transactions transactions_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON UPDATE CASCADE;


--
-- Name: transactions transactions_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: transactions transactions_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: wishlist wishlist_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON UPDATE CASCADE;


--
-- Name: wishlist wishlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- PostgreSQL database dump complete
--