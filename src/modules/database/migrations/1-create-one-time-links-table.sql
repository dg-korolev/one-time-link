DROP TABLE IF EXISTS public.one_time_links;

CREATE TABLE public.one_time_links (
  id UUID PRIMARY KEY NOT NULL,
  "value" TEXT NOT NULL,
  "isUsed" BOOLEAN NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);
