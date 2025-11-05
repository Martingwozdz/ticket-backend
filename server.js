// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configurar CORS para permitir Vercel
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://ticket-frontend-pi.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// Routes
const ticketRoutes = require('./routes/ticketRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/tickets', ticketRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Server running' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});