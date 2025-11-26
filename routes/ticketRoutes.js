// routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticketModel');
const sendEmail = require('../utils/emailService');

// Precios por evento
const EVENT_PRICES = {
  mangrove: 260,
  ikigai: 280
};

// Crear ticket después del pago exitoso
router.post('/create', async (req, res) => {
  const { 
    firstName, 
    lastName, 
    email, 
    guests, 
    paymentNumber, 
    tokenAuth, 
    complianceData,
    eventType
  } = req.body;

  const TICKET_PRICE = EVENT_PRICES[eventType] || EVENT_PRICES.mangrove;
  const totalAmount = guests * TICKET_PRICE;

  try {
    const newTicket = await Ticket.create({
      firstName,
      lastName,
      email,
      guests,
      totalAmount,
      paymentNumber,
      tokenAuth,
      complianceData,
      eventType: eventType || 'mangrove',
      status: 'confirmed'
    });

    // Enviar email de confirmación
    await sendEmail({
      firstName,
      lastName,
      email,
      guests,
      totalAmount,
      paymentNumber,
      ticketId: newTicket.id,
      eventType: eventType || 'mangrove',
      ticketPrice: TICKET_PRICE
    });

    res.status(201).json({
      message: 'Ticket creado exitosamente',
      ticket: newTicket
    });

  } catch (error) {
    console.error('Error al crear ticket:', error);
    res.status(500).json({ error: 'Error al crear el ticket' });
  }
});

// Obtener todos los tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ tickets });
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({ error: 'Error al obtener tickets' });
  }
});

// Obtener ticket por ID
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }
    res.json({ ticket });
  } catch (error) {
    console.error('Error al obtener ticket:', error);
    res.status(500).json({ error: 'Error al obtener ticket' });
  }
});

module.exports = router;