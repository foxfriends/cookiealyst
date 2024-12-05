ALTER TABLE reviews DROP CONSTRAINT IF EXISTS comment_max_length;
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comment_max_length;
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS account_id_max_length;
ALTER TABLE reviews ADD CONSTRAINT comment_max_length CHECK (length(comment) <= 2048);
ALTER TABLE comments ADD CONSTRAINT comment_max_length CHECK (length(comment) <= 2048);
ALTER TABLE accounts ADD CONSTRAINT account_id_max_length CHECK (length(id) <= 128);
