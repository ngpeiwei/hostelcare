# How to Connect Your Backend to Supabase

This guide provides step-by-step instructions to connect your Node.js backend to Supabase.

## Quick Start

### Step 1: Install Dependencies
The required packages are already installed. If you need to reinstall:
```bash
cd server
npm install @supabase/supabase-js dotenv
```

### Step 2: Get Your Supabase Credentials

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project** (or create a new one)
3. **Navigate to Settings** → **API**
4. **Copy these two values:**
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **service_role key** (long JWT token starting with `eyJ...`)

⚠️ **IMPORTANT**: Use the `service_role` key (secret), NOT the `anon` key. The service_role key has full database access needed for backend operations.

### Step 3: Create Environment File

1. In the `server` folder, create a file named `.env`
2. Add the following content:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key-here
PORT=5000
```

3. Replace the placeholder values with your actual credentials from Step 2

### Step 4: Create the Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the SQL from `database/migrations/001_create_complaints_table.sql`
4. Click **Run** (or press Ctrl+Enter)

This will create the `complaints` table with all necessary columns and indexes.

### Step 5: Test the Connection

1. Start your backend server:
   ```bash
   cd server
   npm start
   ```

2. You should see: `Server running on http://localhost:5000`

3. Test the API:
   - Open: http://localhost:5000/
   - Should see: "Backend is running 🚀"

4. Test complaints endpoint:
   - GET: http://localhost:5000/api/complaints
   - Should return an empty array `[]` initially (or your existing data)

## File Structure

```
server/
├── config/
│   └── supabase.js              # Supabase client configuration
├── controllers/
│   └── complaintController.js   # Business logic with Supabase queries
├── database/
│   └── migrations/
│       └── 001_create_complaints_table.sql  # SQL schema
├── .env                         # Your credentials (NOT in git)
├── .env.example                 # Template (safe to commit)
├── server.js                    # Express server
└── SUPABASE_SETUP.md           # Detailed setup guide
```

## How It Works

### Backend Configuration (`config/supabase.js`)
- Loads environment variables using `dotenv`
- Creates a Supabase client with your credentials
- Exports the client for use in controllers

### Controller (`controllers/complaintController.js`)
- Uses Supabase client to query the database
- Converts database field names (snake_case) to frontend format (camelCase)
- Handles errors and returns appropriate HTTP responses

### API Endpoints
All endpoints maintain the same interface as before:
- `GET /api/complaints?status=Open` - Get filtered complaints
- `GET /api/complaints/:id` - Get single complaint
- `POST /api/complaints` - Create complaint
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint

## Database Schema

The `complaints` table has the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Auto-incrementing primary key |
| description | TEXT | Complaint description |
| detailed_description | TEXT | Detailed description (optional) |
| status | VARCHAR(50) | Status: Open, Pending, In Progress, Resolved |
| date_created | DATE | Creation date |
| name | VARCHAR(255) | Student name |
| email | VARCHAR(255) | Student email |
| category | VARCHAR(100) | Individual or Shared |
| sub_category | VARCHAR(100) | Sub-category |
| hostel | VARCHAR(255) | Hostel name |
| phone_no | VARCHAR(50) | Phone number |
| floor_and_room | VARCHAR(100) | Room location |
| attachments | JSONB | Array of attachment filenames |
| staff_in_charge | VARCHAR(255) | Assigned staff |
| actions_to_be_taken | TEXT | Actions description |
| estimated_service_date | DATE | Estimated completion date |
| feedback | TEXT | Student feedback |
| created_at | TIMESTAMP | Auto-generated timestamp |
| updated_at | TIMESTAMP | Auto-updated timestamp |

## Troubleshooting

### "Missing Supabase configuration"
- Check that `.env` file exists in the `server` folder
- Verify variable names: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Ensure no extra spaces or quotes in values

### "Invalid API key"
- Make sure you copied the `service_role` key (not `anon` key)
- Check for any extra spaces or line breaks
- Re-copy from Supabase dashboard

### "relation 'complaints' does not exist"
- Run the SQL migration script in Supabase SQL Editor
- Verify table exists in Table Editor

### "Failed to fetch complaints"
- Check your internet connection
- Verify Supabase project is active (not paused)
- Check server console for detailed error messages

### Connection Issues
- Ensure your Supabase project is not paused
- Check firewall settings
- Try accessing Supabase dashboard to verify project accessibility

## Security Notes

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use service_role key only in backend** - Never expose it to frontend
3. **Keep your keys secure** - Rotate keys if compromised
4. **Use Row Level Security (RLS)** - For production, consider enabling RLS policies

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Create database table
3. ✅ Configure environment variables
4. ✅ Test API endpoints
5. ✅ Verify Admin pages work correctly

Your backend is now fully integrated with Supabase! 🎉
