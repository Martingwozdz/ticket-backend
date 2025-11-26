// models/omakaseModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OmakaseReservation = sequelize.define('OmakaseReservation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12
    }
  },
  reservationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  reservation_time: {           // ⭐ AGREGAR ESTO
    type: DataTypes.STRING(5),
    allowNull: false,
    defaultValue: '19:30',
    field: 'reservation_time'  // Nombre exacto en la base de datos
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tokenAuth: {
    type: DataTypes.STRING,
    allowNull: true
  },
  complianceData: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'confirmed'
  }
}, {
  tableName: 'omakase_reservations',
  timestamps: true
});

module.exports = OmakaseReservation;