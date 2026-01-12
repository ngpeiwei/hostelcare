// server/server.js
const express = require('express');
const cors = require('cors');
const complaintRoutes = require('./routes/complaintRoutes');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// API Routes
app.use('/api/complaints', complaintRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
