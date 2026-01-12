# Backend Server - HostelCare

This is the Node.js backend server for the HostelCare application, integrated with Supabase.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Follow the detailed setup guide in `SUPABASE_SETUP.md`
2. Create a `.env` file in the `server` folder with your Supabase credentials:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=5000
```

### 3. Run Database Migration

1. Open your Supabase dashboard
2. Go to SQL Editor
3. Run the SQL script from `database/migrations/001_create_complaints_table.sql`

### 4. Start the Server

```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Complaints

- `GET /api/complaints` - Get all complaints (optional query: `?status=Open|Pending|In Progress|Resolved|New|All`)
- `GET /api/complaints/:id` - Get a single complaint by ID
- `POST /api/complaints` - Create a new complaint
- `PUT /api/complaints/:id` - Update a complaint
- `DELETE /api/complaints/:id` - Delete a complaint

## Project Structure

```
server/
├── config/
│   └── supabase.js          # Supabase client configuration
├── controllers/
│   └── complaintController.js  # Complaint business logic
├── database/
│   └── migrations/
│       └── 001_create_complaints_table.sql  # Database schema
├── routes/
│   └── complaintRoutes.js   # API routes
├── .env                     # Environment variables (not in git)
├── server.js               # Express server setup
├── SUPABASE_SETUP.md       # Detailed Supabase setup guide
└── package.json            # Dependencies
```

## Environment Variables

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for backend operations)
- `PORT` - Server port (default: 5000)

## Troubleshooting

See `SUPABASE_SETUP.md` for detailed troubleshooting steps.
