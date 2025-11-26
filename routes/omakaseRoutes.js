// routes/omakaseRoutes.js
const express = require('express');
const router = express.Router();
const OmakaseReservation = require('../models/omakaseModel');
const { Op } = require('sequelize');

const PRICE_PER_PERSON = 330; // $330 USD por persona
const MAX_CAPACITY = 12; // 12 personas máximo por horario

// Función para verificar si es jueves
const isThursday = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.getDay() === 4; // 4 = jueves
};

// Función para verificar si es feriado (BVI holidays)
const isHoliday = (dateString) => {
  const holidays = [
    // 2024
    '2024-12-25', // Christmas Day
    '2024-12-26', // Boxing Day
    // 2025
    '2025-01-01', // New Year's Day
    '2025-03-14', // Commonwealth Day
    '2025-04-18', // Good Friday
    '2025-04-21', // Easter Monday
    '2025-05-19', // Whit Monday
    '2025-06-16', // Sovereign's Birthday
    '2025-07-01', // Territory Day
    '2025-08-04', // Emancipation Day (First Monday in August)
    '2025-10-21', // St. Ursula's Day
    // Agregar más según necesites
  ];
  return holidays.includes(dateString);
};

// Crear reserva
router.post('/create', async (req, res) => {
  const { 
    firstName, 
    lastName, 
    email,
    phone,
    guests,
    reservationDate,
    reservationTime,      // ⭐ AGREGAR ESTO
    allergies,
    specialRequests,
    paymentNumber, 
    tokenAuth, 
    complianceData 
  } = req.body;

  const totalAmount = guests * PRICE_PER_PERSON;

  try {
    // Validar que no sea jueves
    if (isThursday(reservationDate)) {
      return res.status(400).json({ 
        error: 'Ikigai Omakase is closed on Thursdays' 
      });
    }

    // Validar que no sea feriado
    if (isHoliday(reservationDate)) {
      return res.status(400).json({ 
        error: 'Ikigai Omakase is closed on this holiday' 
      });
    }

    // Verificar disponibilidad para esa fecha Y HORA específica
    const existingReservations = await OmakaseReservation.findAll({
      where: {
        reservationDate,
        reservation_time: reservationTime,  // ⭐ AGREGAR ESTO
        status: { [Op.ne]: 'cancelled' }
      }
    });

    const totalGuests = existingReservations.reduce((sum, res) => sum + res.guests, 0);
    
    if (totalGuests + guests > MAX_CAPACITY) {
      return res.status(400).json({ 
        error: `Only ${MAX_CAPACITY - totalGuests} seats available for this time` 
      });
    }

    // Crear la reserva
    const newReservation = await OmakaseReservation.create({
      firstName,
      lastName,
      email,
      phone,
      guests,
      reservationDate,
      reservation_time: reservationTime,  // ⭐ AGREGAR ESTO
      allergies,
      specialRequests,
      totalAmount,
      paymentNumber,
      tokenAuth,
      complianceData,
      status: 'confirmed'
    });

    // Enviar emails (cliente y restaurante)
    const sendOmakaseEmails = require('../utils/omakaseEmailService');
    await sendOmakaseEmails({
      firstName,
      lastName,
      email,
      phone,
      guests,
      reservationDate,
      reservation_time: reservationTime,  // ⭐ AGREGAR ESTO
      allergies,
      specialRequests,
      totalAmount,
      paymentNumber,
      reservationId: newReservation.id
    });

    res.status(201).json({
      message: 'Reservation created successfully',
      reservation: newReservation
    });

  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Error creating reservation' });
  }
});

// Verificar disponibilidad para una fecha Y HORA
router.post('/availability', async (req, res) => {
  const { reservationDate, reservationTime, guests } = req.body;  // ⭐ AGREGAR reservationTime

  try {
    // Validar que no sea jueves
    if (isThursday(reservationDate)) {
      return res.json({ 
        available: false,
        reason: 'Closed on Thursdays',
        seatsLeft: 0
      });
    }

    // Validar que no sea feriado
    if (isHoliday(reservationDate)) {
      return res.json({ 
        available: false,
        reason: 'Closed on holidays',
        seatsLeft: 0
      });
    }

    // Verificar cuántos asientos quedan para esa fecha Y HORA
    const existingReservations = await OmakaseReservation.findAll({
      where: {
        reservationDate,
        reservation_time: reservationTime,  // ⭐ AGREGAR ESTO
        status: { [Op.ne]: 'cancelled' }
      }
    });

    const totalGuests = existingReservations.reduce((sum, res) => sum + res.guests, 0);
    const seatsLeft = MAX_CAPACITY - totalGuests;

    res.json({ 
      available: seatsLeft >= guests,
      seatsLeft: seatsLeft,
      reason: seatsLeft >= guests ? null : 'Not enough seats available'
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Error checking availability' });
  }
});

// Obtener todas las reservas (para admin)
router.get('/', async (req, res) => {
  try {
    const reservations = await OmakaseReservation.findAll({
      order: [['reservationDate', 'DESC'], ['reservation_time', 'ASC'], ['createdAt', 'DESC']]  // ⭐ Ordenar por hora también
    });
    res.json({ reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Error fetching reservations' });
  }
});

// Obtener reservas por fecha específica
router.get('/date/:date', async (req, res) => {
  try {
    const reservations = await OmakaseReservation.findAll({
      where: {
        reservationDate: req.params.date,
        status: { [Op.ne]: 'cancelled' }
      },
      order: [['reservation_time', 'ASC']]  // ⭐ Ordenar por hora
    });
    
    // Agrupar por hora
    const byTime = {};
    reservations.forEach(res => {
      const time = res.reservation_time;
      if (!byTime[time]) {
        byTime[time] = { reservations: [], totalGuests: 0 };
      }
      byTime[time].reservations.push(res);
      byTime[time].totalGuests += res.guests;
    });
    
    res.json({ 
      reservations,
      byTime,
      totalReservations: reservations.length
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Error fetching reservations' });
  }
});

// Cancelar reserva
router.patch('/:id/cancel', async (req, res) => {
  try {
    const reservation = await OmakaseReservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    await reservation.update({ status: 'cancelled' });
    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ error: 'Error cancelling reservation' });
  }
});

module.exports = router;