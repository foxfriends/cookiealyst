--! Previous: sha1:f13230e6433a096866618e1cf38041772c96b01c
--! Hash: sha1:68b252bfff5435081d6aeb5a3f6134a26b915c3d

ALTER TABLE reviews DROP CONSTRAINT IF EXISTS comment_max_length;
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comment_max_length;
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS account_id_max_length;
ALTER TABLE reviews ADD CONSTRAINT comment_max_length CHECK (length(comment) <= 2048);
ALTER TABLE comments ADD CONSTRAINT comment_max_length CHECK (length(comment) <= 2048);
ALTER TABLE accounts ADD CONSTRAINT account_id_max_length CHECK (length(id) <= 128);
