const BookingModel = {
  tableName: 'bookings',
  schema: `
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Pending',
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `
};

module.exports = BookingModel;
