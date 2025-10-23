-- Create players table for real-time multiplayer
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  x REAL NOT NULL DEFAULT 0,
  y REAL NOT NULL DEFAULT 0,
  direction TEXT NOT NULL DEFAULT 'down',
  is_moving BOOLEAN NOT NULL DEFAULT false,
  player_class TEXT NOT NULL DEFAULT 'warrior',
  color TEXT NOT NULL DEFAULT '#ff4444',
  health INTEGER NOT NULL DEFAULT 100,
  max_health INTEGER NOT NULL DEFAULT 100,
  mana INTEGER NOT NULL DEFAULT 50,
  max_mana INTEGER NOT NULL DEFAULT 50,
  level INTEGER NOT NULL DEFAULT 1,
  gold INTEGER NOT NULL DEFAULT 100,
  zone_id TEXT NOT NULL DEFAULT 'main',
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  zone_id TEXT NOT NULL DEFAULT 'main',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for open access (no authentication needed)
CREATE POLICY "Anyone can view players" 
ON public.players 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert players" 
ON public.players 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update players" 
ON public.players 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete players" 
ON public.players 
FOR DELETE 
USING (true);

CREATE POLICY "Anyone can view chat messages" 
ON public.chat_messages 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert chat messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (true);

-- Set up real-time
ALTER TABLE public.players REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER publication supabase_realtime ADD TABLE public.players;
ALTER publication supabase_realtime ADD TABLE public.chat_messages;

-- Create indexes for better performance
CREATE INDEX idx_players_zone_id ON public.players(zone_id);
CREATE INDEX idx_players_last_seen ON public.players(last_seen);
CREATE INDEX idx_chat_messages_zone_id ON public.chat_messages(zone_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);

-- Create function to clean up old inactive players
CREATE OR REPLACE FUNCTION public.cleanup_inactive_players()
RETURNS void AS $$
BEGIN
  DELETE FROM public.players 
  WHERE last_seen < now() - interval '5 minutes';
END;
$$ LANGUAGE plpgsql;
