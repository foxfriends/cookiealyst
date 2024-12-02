--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0 (Debian 17.0-1.pgdg120+1)
-- Dumped by pg_dump version 17.0 (Debian 17.0-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    id public.citext NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id bigint NOT NULL,
    account_id public.citext NOT NULL,
    review_id bigint NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.comments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cookies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cookies (
    id text NOT NULL,
    name text NOT NULL,
    year integer NOT NULL,
    description text NOT NULL,
    ordering integer NOT NULL,
    image_url text
);


--
-- Name: rankings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rankings (
    id bigint NOT NULL,
    account_id public.citext NOT NULL,
    cookie_id text NOT NULL,
    year integer NOT NULL,
    ranking integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: rankings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.rankings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rankings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id bigint NOT NULL,
    account_id public.citext NOT NULL,
    cookie_id text NOT NULL,
    comment text,
    year integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.reviews ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    account_id public.citext,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '30 days'::interval) NOT NULL
);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: cookies cookies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cookies
    ADD CONSTRAINT cookies_pkey PRIMARY KEY (id, year);


--
-- Name: cookies cookies_year_ordering_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cookies
    ADD CONSTRAINT cookies_year_ordering_key UNIQUE (year, ordering);


--
-- Name: rankings rankings_account_id_cookie_id_year_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rankings
    ADD CONSTRAINT rankings_account_id_cookie_id_year_key UNIQUE (account_id, cookie_id, year);


--
-- Name: rankings rankings_account_id_year_ranking_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rankings
    ADD CONSTRAINT rankings_account_id_year_ranking_key UNIQUE (account_id, year, ranking);


--
-- Name: rankings rankings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rankings
    ADD CONSTRAINT rankings_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: comments comments_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.comments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_cookie_id_year_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_cookie_id_year_fkey FOREIGN KEY (cookie_id, year) REFERENCES public.cookies(id, year) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sessions sessions_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

