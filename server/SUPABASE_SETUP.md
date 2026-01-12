# Supabase Setup Guide

This guide will walk you through setting up Supabase for the HostelCare backend.

## Step 1: Create a Supabase Account and Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: hostelcare (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the region closest to you
   - **Pricing Plan**: Free tier is sufficient for development
5. Click "Create new project"
6. Wait for the project to be set up (usually takes 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. Once your project is ready, go to **Project Settings** (gear icon in the left sidebar)
2. Click on **API** in the settings menu
3. You'll need two values:
   - **Project URL** (under "Project URL")
   - **service_role key** (under "Project API keys" → "service_role" key - **IMPORTANT**: This is the secret key, not the anon key)

## Step 3: Create the Database Table

1. In your Supabase dashboard, go to **SQL Editor** (in the left sidebar)
2. Click "New Query"
3. Copy and paste the following SQL script:

```sql
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
```

4. Click "Run" to execute the SQL script
5. You should see a success message

## Step 4: Set Up Environment Variables

1. In your `server` folder, create a file named `.env` (if it doesn't exist)
2. Copy the contents from `.env.example` (if it exists) or create it with:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=5000
```

3. Replace the placeholder values:
   - `your_supabase_project_url_here` → Your Project URL from Step 2
   - `your_service_role_key_here` → Your service_role key from Step 2

**Example:**
```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQwMDAwMDAwLCJleHAiOjE5NTU1NTU1NTZ9.example
PORT=5000
```

## Step 5: Test the Connection

1. Make sure your `.env` file is in the `server` folder
2. Start your backend server:
   ```bash
   cd server
   npm start
   ```
3. You should see: `Server running on http://localhost:5000`
4. If you see any Supabase connection errors, check your `.env` file values

## Step 6: Verify Database Access

1. In Supabase dashboard, go to **Table Editor**
2. You should see the `complaints` table listed
3. The table should be empty initially
4. Test creating a complaint through your frontend to verify it works

## Important Notes

- **Never commit your `.env` file to Git!** It contains sensitive credentials.
- The `.env` file should already be in `.gitignore`
- Use the `service_role` key (not `anon` key) because it has full database access needed for the backend
- The `service_role` key bypasses Row Level Security (RLS), which is appropriate for backend operations

## Troubleshooting

### Error: "Missing Supabase configuration"
- Make sure your `.env` file exists in the `server` folder
- Verify the variable names match exactly: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check that there are no extra spaces or quotes around the values

### Error: "Invalid API key"
- Double-check you copied the `service_role` key, not the `anon` key
- Make sure there are no extra spaces or line breaks

### Error: "relation 'complaints' does not exist"
- Make sure you ran the SQL script in Step 3
- Check the Table Editor to verify the table was created

### Connection timeout
- Verify your Supabase project is active (not paused)
- Check your internet connection
- Try accessing your Supabase dashboard to ensure the project is accessible
