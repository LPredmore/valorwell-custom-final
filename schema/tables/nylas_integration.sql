-- Nylas Integration Tables
-- Calendar and email integration with Nylas service

-- Nylas Accounts Table
CREATE TABLE nylas_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  account_id text NOT NULL,
  access_token text NOT NULL,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Nylas Events Table
CREATE TABLE nylas_events (
  event_id text PRIMARY KEY,
  user_id uuid NOT NULL,
  account_id text NOT NULL,
  calendar_id text NOT NULL,
  title text,
  description text,
  location text,
  when_start timestamptz,
  when_end timestamptz,
  when_data jsonb,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for Nylas tables
CREATE INDEX idx_nylas_accounts_account_id ON nylas_accounts USING btree (account_id);
CREATE INDEX idx_nylas_accounts_user_id ON nylas_accounts USING btree (user_id);
CREATE UNIQUE INDEX nylas_accounts_pkey ON nylas_accounts USING btree (id);
CREATE UNIQUE INDEX nylas_accounts_user_id_key ON nylas_accounts USING btree (user_id);

CREATE INDEX idx_nylas_events_calendar_id ON nylas_events USING btree (calendar_id);
CREATE INDEX idx_nylas_events_user_id ON nylas_events USING btree (user_id);
CREATE INDEX idx_nylas_events_when_start ON nylas_events USING btree (when_start);
CREATE UNIQUE INDEX nylas_events_pkey ON nylas_events USING btree (event_id);