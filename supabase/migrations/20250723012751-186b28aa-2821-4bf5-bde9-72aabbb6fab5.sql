-- Create nylas_accounts table for storing user calendar connections
CREATE TABLE public.nylas_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  account_id TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one Nylas account per user
  UNIQUE(user_id)
);

-- Create nylas_events table for storing synced calendar events
CREATE TABLE public.nylas_events (
  event_id TEXT NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  calendar_id TEXT NOT NULL,
  title TEXT,
  description TEXT,
  when_start TIMESTAMP WITH TIME ZONE,
  when_end TIMESTAMP WITH TIME ZONE,
  when_data JSONB, -- Full when object from Nylas
  location TEXT,
  metadata JSONB, -- Additional Nylas metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.nylas_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nylas_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for nylas_accounts
CREATE POLICY "Users can view their own Nylas accounts" 
ON public.nylas_accounts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own Nylas accounts" 
ON public.nylas_accounts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Nylas accounts" 
ON public.nylas_accounts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Nylas accounts" 
ON public.nylas_accounts 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for nylas_events
CREATE POLICY "Users can view their own Nylas events" 
ON public.nylas_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own Nylas events" 
ON public.nylas_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Nylas events" 
ON public.nylas_events 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Nylas events" 
ON public.nylas_events 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_nylas_accounts_user_id ON public.nylas_accounts(user_id);
CREATE INDEX idx_nylas_accounts_account_id ON public.nylas_accounts(account_id);
CREATE INDEX idx_nylas_events_user_id ON public.nylas_events(user_id);
CREATE INDEX idx_nylas_events_calendar_id ON public.nylas_events(calendar_id);
CREATE INDEX idx_nylas_events_when_start ON public.nylas_events(when_start);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_nylas_accounts_updated_at
  BEFORE UPDATE ON public.nylas_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_nylas_events_updated_at
  BEFORE UPDATE ON public.nylas_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();