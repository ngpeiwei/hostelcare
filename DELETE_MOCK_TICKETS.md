# How to Delete Mock Tickets from Supabase

The tickets like "room socket spoil", "Table lamp is not working", etc. are stored in your Supabase database. Here are ways to remove them:

## Method 1: Using SQL Editor in Supabase (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run this SQL command to delete mock tickets:

```sql
-- Delete mock tickets by description
DELETE FROM complaint_attachments 
WHERE complaint_id IN (
  SELECT id FROM complaints 
  WHERE LOWER(issue_title) LIKE '%room socket%' 
     OR LOWER(issue_title) LIKE '%table lamp%'
     OR LOWER(issue_title) LIKE '%corridor lamp%'
     OR LOWER(issue_title) LIKE '%ceiling fan%'
     OR LOWER(issue_title) LIKE '%door handle%'
     OR LOWER(description) LIKE '%room socket%'
     OR LOWER(description) LIKE '%table lamp%'
     OR LOWER(description) LIKE '%corridor lamp%'
     OR LOWER(description) LIKE '%ceiling fan%'
     OR LOWER(description) LIKE '%door handle%'
);

DELETE FROM complaints 
WHERE LOWER(issue_title) LIKE '%room socket%' 
   OR LOWER(issue_title) LIKE '%table lamp%'
   OR LOWER(issue_title) LIKE '%corridor lamp%'
   OR LOWER(issue_title) LIKE '%ceiling fan%'
   OR LOWER(issue_title) LIKE '%door handle%'
   OR LOWER(description) LIKE '%room socket%'
   OR LOWER(description) LIKE '%table lamp%'
   OR LOWER(description) LIKE '%corridor lamp%'
   OR LOWER(description) LIKE '%ceiling fan%'
   OR LOWER(description) LIKE '%door handle%';
```

## Method 2: Delete All Test Data (Nuclear Option)

If you want to delete ALL tickets and start fresh:

```sql
-- Delete all attachments first
DELETE FROM complaint_attachments;

-- Delete all complaints
DELETE FROM complaints;
```

## Method 3: Using the Utility Script

1. Make sure your `server/.env` file has Supabase credentials
2. Run the script:

```bash
cd server
node scripts/deleteMockTickets.js
```

## Method 4: Delete Specific Tickets by ID

If you know the specific ticket IDs:

```sql
-- Replace 1, 2, 3 with actual ticket IDs
DELETE FROM complaint_attachments WHERE complaint_id IN (1, 2, 3, 4);
DELETE FROM complaints WHERE id IN (1, 2, 3, 4);
```

## Verify Deletion

After deletion, check your AdminDashboard - it should now show only real tickets from your database, or "No tickets found" if the database is empty.
