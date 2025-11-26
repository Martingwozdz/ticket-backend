// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// NUEVO: Servir archivos estáticos (logos)
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const ticketRoutes = require('./routes/ticketRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const omakaseRoutes = require('./routes/omakaseRoutes');

app.use('/api/tickets', ticketRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/omakase', omakaseRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server running' });
});

// NUEVO: Test de logos
app.get('/test-logos', (req, res) => {
  res.json({
    message: 'Logos disponibles',
    mangrove: `http://localhost:${PORT}/images/themangrove.jpg`,
    ikigai: `http://localhost:${PORT}/images/ikigai.jpg`
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Logo Mangrove: http://localhost:${PORT}/images/themangrove.jpg`);
  console.log(`✅ Logo Ikigai: http://localhost:${PORT}/images/ikigai.jpg`);
});