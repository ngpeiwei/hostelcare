# Troubleshooting: No Tickets Showing in AdminDashboard

## Quick Checks

### 1. Check Backend Server is Running
```bash
cd server
npm start
```
You should see: `Server running on http://localhost:5000`

### 2. Check Browser Console
Open browser DevTools (F12) and check:
- **Console tab**: Look for errors like:
  - "Error loading tickets"
  - "Failed to fetch"
  - Network errors
- **Network tab**: Check if `/api/complaints` request is being made and what response you get

### 3. Check Backend Console
Look at your server terminal for:
- "Fetched X complaints from Supabase"
- Any Supabase connection errors
- Missing Supabase configuration errors

### 4. Verify Environment Variables
Check that `server/.env` file exists with:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=5000
```

### 5. Verify Supabase Tables Exist
In Supabase Dashboard:
- Go to **Table Editor**
- Verify `complaints` table exists
- Verify `complaint_attachments` table exists
- Check if there are any rows in the `complaints` table

### 6. Test Backend API Directly
Open in browser: `http://localhost:5000/api/complaints`

You should see JSON data or an error message.

## Common Issues

### Issue: "Missing Supabase configuration"
**Solution**: Create `server/.env` file with your Supabase credentials

### Issue: "relation 'complaints' does not exist"
**Solution**: The `complaints` table doesn't exist in Supabase. Create it using SQL Editor.

### Issue: Backend returns empty array `[]`
**Solution**: 
- Check if you have data in your `complaints` table
- Verify the table structure matches what the backend expects
- Check status values match: 'new', 'pending', 'inprogress', 'resolved'

### Issue: Network error / CORS error
**Solution**: 
- Ensure backend server is running on port 5000
- Check `client/src/services/api.js` has correct `BASE_URL`
- Verify CORS is enabled in `server/server.js`

### Issue: Status filter not working
**Solution**: 
- Check that status values in database match: 'new', 'pending', 'inprogress', 'resolved'
- The backend maps: 'new' → 'Open', 'inprogress' → 'In Progress'

## Testing Steps

1. **Test Backend Connection**:
   ```bash
   curl http://localhost:5000/api/complaints
   ```
   Should return JSON array (even if empty)

2. **Check Supabase Connection**:
   - Backend should log: "Fetched X complaints from Supabase"
   - If you see errors, check `.env` file

3. **Check Frontend Console**:
   - Should see: "Loading tickets with status: Open"
   - Should see: "Response received: {data: [...]}"
   - Should see: "Tickets loaded: X"

4. **Verify Data Format**:
   - Each ticket should have: `id`, `description`, `status`, `dateCreated`
   - Status should be: 'Open', 'Pending', 'In Progress', or 'Resolved'

## Database Schema Check

Your `complaints` table should have these columns:
- `id` (SERIAL or UUID)
- `issue_title` (TEXT)
- `description` (TEXT)
- `status` (VARCHAR) - values: 'new', 'pending', 'inprogress', 'resolved'
- `created_at` (TIMESTAMP)
- `category`, `sub_category`, `hostel`, `building_room_number`
- `staff_in_charge`, `actions_to_be_taken`, `estimated_service_date`, `feedback`

Your `complaint_attachments` table should have:
- `id`
- `complaint_id` (foreign key to complaints.id)
- `file_url` (TEXT)

## Still Not Working?

1. Check browser console for specific error messages
2. Check backend console for Supabase errors
3. Verify your Supabase project is active (not paused)
4. Test the API endpoint directly: `http://localhost:5000/api/complaints`
5. Check if there's data in your Supabase `complaints` table
