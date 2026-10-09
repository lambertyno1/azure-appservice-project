// MOCK DATABASE LAYER
// In a real production environment, this file would contain the Azure PostgreSQL connection logic.
// For this DevOps demonstration, we use an in-memory store to ensure 100% reliability during the CI/CD demo.

const db = {
  events: [
    { id: 1, name: 'DevOps Bootcamp Final Presentation', date: '2026-10-15', totalSeats: 50, bookedSeats: 0 },
    { id: 2, name: 'Cloud Architecture Summit', date: '2026-11-01', totalSeats: 100, bookedSeats: 0 },
    { id: 3, name: 'Azure App Service Workshop', date: '2026-11-10', totalSeats: 25, bookedSeats: 0 }
  ],
  bookings: []
};

// Simulate async database queries
const database = {
  getEvents: async () => {
    return db.events.map(e => ({ ...e, availableSeats: e.totalSeats - e.bookedSeats }));
  },
  
  createBooking: async (eventId, userName, userEmail) => {
    const event = db.events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');
    if (event.bookedSeats >= event.totalSeats) throw new Error('Event is sold out');

    // --- NEW: CHECK FOR DUPLICATE BOOKING ---
    const isDuplicate = db.bookings.some(b => b.eventId === eventId && b.userEmail === userEmail);
    if (isDuplicate) {
        throw new Error('This email has already booked this event.');
    }

    const booking = {
      id: Date.now(),
      eventId,
      eventName: event.name,
      userName,
      userEmail,
      bookedAt: new Date().toISOString()
    };
    
    db.bookings.push(booking);
    event.bookedSeats += 1;
    return booking;
  },

  getAllBookings: async () => {
    return db.bookings;
  },

  checkConnection: async () => {
    // Simulates a DB ping
    return true; 
  }
};

module.exports = database;
