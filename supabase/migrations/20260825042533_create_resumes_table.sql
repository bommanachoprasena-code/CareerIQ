/*
# Create resumes table

1. Purpose
   Stores each authenticated user's resume as a single row, used by the
   CareerIQ Resume Builder. One row per user (enforced by a UNIQUE constraint
   on user_id). Repeating sections (education, experience, projects,
   certifications, skills) are stored as JSONB arrays so the form can hold
   multiple structured entries without extra tables.

2. New Table: resumes
   - id              uuid primary key
   - user_id         uuid, NOT NULL, defaults to auth.uid(), references
                     auth.users with ON DELETE CASCADE. Unique so each user
                     has exactly one resume.
   - full_name       text
   - email           text
   - phone           text
   - location        text
   - profile_photo_url text (optional URL to a profile photo)
   - summary         text  (professional summary)
   - education       jsonb default '[]' (array of {degree, institution,
                     start_year, end_year, description})
   - experience      jsonb default '[]' (array of {job_title, company,
                     start_date, end_date, description})
   - skills           jsonb default '[]' (array of strings)
   - projects        jsonb default '[]' (array of {name, description,
                     technologies, url})
   - certifications  jsonb default '[]' (array of {name, organization,
                     issue_date, credential_id, credential_url})
   - achievements    text
   - interests       text
   - github_url      text
   - linkedin_url    text
   - created_at      timestamptz default now()
   - updated_at      timestamptz default now()

3. Security
   - Enable RLS on resumes.
   - Four owner-scoped policies (SELECT/INSERT/UPDATE/DELETE) scoped to
     authenticated users, using auth.uid() = user_id. The DEFAULT auth.uid()
     on user_id lets the frontend insert without passing user_id explicitly.

4. Notes
   - No destructive operations; table is new.
   - updated_at is maintained by the application on save.
*/

CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  location text,
  profile_photo_url text,
  summary text,
  education jsonb NOT NULL DEFAULT '[]'::jsonb,
  experience jsonb NOT NULL DEFAULT '[]'::jsonb,
  skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  projects jsonb NOT NULL DEFAULT '[]'::jsonb,
  certifications jsonb NOT NULL DEFAULT '[]'::jsonb,
  achievements text,
  interests text,
  github_url text,
  linkedin_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT resumes_user_id_key UNIQUE (user_id)
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_resume" ON resumes;
CREATE POLICY "select_own_resume" ON resumes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_resume" ON resumes;
CREATE POLICY "insert_own_resume" ON resumes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_resume" ON resumes;
CREATE POLICY "update_own_resume" ON resumes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_resume" ON resumes;
CREATE POLICY "delete_own_resume" ON resumes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
