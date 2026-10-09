// MOCK DATABASE LAYER
const db = {
  events: [
    { id: 1, name: 'DevOps Bootcamp Final Presentation', date: '2026-10-15', category: 'Education', price: 0, totalSeats: 50, bookedSeats: 0 },
    { id: 2, name: 'Cloud Architecture Summit', date: '2026-11-01', category: 'Technology', price: 150, totalSeats: 100, bookedSeats: 0 },
    { id: 3, name: 'Azure App Service Workshop', date: '2026-11-10', category: 'Workshop', price: 75, totalSeats: 25, bookedSeats: 0 }
  ],
  bookings: []
};

const database = {
  getEvents: async () => {
    return db.events.map(e => ({ ...e, availableSeats: e.totalSeats - e.bookedSeats }));
  },
  
  createBooking: async (eventId, userName, userEmail) => {
    const event = db.events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');
    if (event.bookedSeats >= event.totalSeats) throw new Error('Event is sold out');

    const booking = {
      id: Date.now(),
      eventId,
      eventName: event.name,
      category: event.category,
      price: event.price,
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
    return true; 
  }
};

module.exports = database;
