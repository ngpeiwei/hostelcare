-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  detailed_description TEXT,
  status VARCHAR(50) DEFAULT 'Open',
  date_created DATE NOT NULL DEFAULT CURRENT_DATE,
  name VARCHAR(255),
  email VARCHAR(255),
  category VARCHAR(100),
  sub_category VARCHAR(100),
  hostel VARCHAR(255),
  phone_no VARCHAR(50),
  floor_and_room VARCHAR(100),
  attachments JSONB DEFAULT '[]'::jsonb,
  staff_in_charge VARCHAR(255),
  actions_to_be_taken TEXT,
  estimated_service_date DATE,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);

-- Create index on date_created for sorting
CREATE INDEX IF NOT EXISTS idx_complaints_date_created ON complaints(date_created);

-- Create index on id for faster lookups
CREATE INDEX IF NOT EXISTS idx_complaints_id ON complaints(id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE
    ON complaints FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
