const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- SECURITY: MOCK AUTHENTICATION MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  // In production, verify JWT here. For demo, we check our mock tokens.
  if (token === 'mock-jwt-token-12345' || token === 'mock-user-token-67890') {
    req.user = token === 'mock-jwt-token-12345' ? { role: 'admin' } : { role: 'user' };
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
};

// --- 1. HEALTH CHECK (CRITICAL FOR CI/CD) ---
app.get('/health', async (req, res) => {
  try {
    const dbStatus = await db.checkConnection();
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      database: dbStatus ? 'connected' : 'disconnected'
    });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// --- 2. AUTHENTICATION ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Mock credentials
  if (username === 'admin' && password === 'password123') {
    res.json({ token: 'mock-jwt-token-12345', role: 'admin', username });
  } else if (username === 'user' && password === 'password123') {
    res.json({ token: 'mock-user-token-67890', role: 'user', username });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// --- 3. REST API: GET EVENTS ---
app.get('/api/events', async (req, res) => {
  try {
    const events = await db.getEvents();
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// --- 4. REST API: CREATE BOOKING (Requires Auth) ---
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { eventId, userName, userEmail } = req.body;
    const booking = await db.createBooking(eventId, userName, userEmail);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- 5. ADMIN DASHBOARD API (Requires Admin Auth) ---
app.get('/api/admin/bookings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const bookings = await db.getAllBookings();
    res.json({ success: true, totalBookings: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// --- SERVE FRONTEND ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Ticket Booking App running on port ${PORT}`);
});
