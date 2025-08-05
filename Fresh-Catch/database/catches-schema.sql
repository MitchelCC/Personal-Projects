
-- Create catches table
CREATE TABLE IF NOT EXISTS catches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  species VARCHAR(255) NOT NULL,
  nickname VARCHAR(255),
  weight DECIMAL(10, 2),
  length DECIMAL(10, 2),
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS catches_user_id_idx ON catches(user_id);
CREATE INDEX IF NOT EXISTS catches_created_at_idx ON catches(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE catches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own catches" ON catches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own catches" ON catches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own catches" ON catches
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own catches" ON catches
  FOR DELETE USING (auth.uid() = user_id);
