# HostelCare - Hostel Facilities Management System

A web application for tracking and managing complaint tickets for hostel facilities, built with React.js (frontend) and Node.js (backend).

## Features

- **Admin Dashboard**: View and manage tickets by status (New, Pending, Resolved, All)
- **Ticket Management**: Create, view, update, and delete tickets
- **Ticket Details**: Detailed view with editable fields for staff assignment, actions, and status
- **Status Filtering**: Filter tickets by status (New/Open, Pending, Resolved)
- **Modern UI**: Clean, modern interface with purple theme matching the design

## Project Structure

```
hostelcare/
├── client/          # React.js frontend
│   └── src/
│       ├── pages/
│       │   └── Admin/
│       │       ├── Dashboard.js      # Main admin dashboard
│       │       └── TicketDetails.js  # Ticket detail page
│       ├── modules/
│       │   └── complaints/
│       │       └── services/
│       │           └── complaintService.js
│       └── services/
│           └── api.js
└── server/          # Node.js backend
    ├── server.js
    ├── routes/
    │   └── complaintRoutes.js
    └── controllers/
        └── complaintController.js
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

### Backend Setup

1. Navigate to the server directory:
```bash
cd hostelcare/server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd hostelcare/client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. Start both the backend and frontend servers
2. Navigate to `http://localhost:3000/admin/dashboard` in your browser
3. Use the navigation tabs to filter tickets by status:
   - **New Tickets**: Shows tickets with "Open" status
   - **Pending Tickets**: Shows tickets with "Pending" status
   - **Resolved Tickets**: Shows tickets with "Resolved" status
   - **All Tickets**: Shows all tickets
4. Click on action buttons to:
   - **Open**: View ticket details
   - **Assign Staff**: Open ticket details to assign staff
   - **View Progress**: View pending ticket details
   - **View Feedback**: View resolved ticket details
5. In the ticket details page, you can:
   - Assign staff to the ticket
   - Set actions to be taken
   - Set estimated service date
   - Update ticket status
   - Save changes

## API Endpoints

- `GET /api/complaints` - Get all tickets (optional query: `?status=New|Pending|Resolved|All`)
- `GET /api/complaints/:id` - Get a specific ticket by ID
- `POST /api/complaints` - Create a new ticket
- `PUT /api/complaints/:id` - Update a ticket
- `DELETE /api/complaints/:id` - Delete a ticket

## Technologies Used

### Frontend
- React.js
- React Router DOM
- CSS3

### Backend
- Node.js
- Express.js
- CORS

## Notes

- The backend currently uses in-memory storage. For production, replace with a database (MongoDB, PostgreSQL, etc.)
- Authentication is not implemented in this version
- File uploads for attachments are not fully implemented (UI is ready)

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- User authentication and authorization
- File upload functionality for attachments
- Email notifications
- Real-time updates
- Advanced filtering and search
- Reports and analytics

