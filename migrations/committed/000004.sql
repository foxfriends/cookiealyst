--! Previous: sha1:68b252bfff5435081d6aeb5a3f6134a26b915c3d
--! Hash: sha1:a5744e143675678ff37fb5466182b4dbea74ce8e

ALTER TABLE public.cookies
    DROP CONSTRAINT cookies_year_ordering_key,
    ADD CONSTRAINT cookies_year_ordering_key UNIQUE (year, ordering) DEFERRABLE INITIALLY DEFERRED;
