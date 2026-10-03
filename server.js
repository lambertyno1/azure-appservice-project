const express = require('express');
const app = express();
const PORT = process.env.PORT || 80;
app.use(express.json());
app.get('/', (req, res) => res.send('Azure App Service Production Deployment Running!'));
app.get('/health', (req, res) => res.status(200).json({ status: 'healthy', timestamp: new Date() }));
app.get('/api/data', (req, res) => res.json({ message: 'REST API data', dbConnected: !!process.env.DB_CONNECTION_STRING }));
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    res.json({ token: 'mock-jwt-token-12345' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
app.get('/admin', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader === 'Bearer mock-jwt-token-12345') {
    res.send('<h1>Admin Dashboard</h1><p>Connected to DB: ' + (process.env.DB_CONNECTION_STRING ? 'Yes' : 'No') + '</p>');
  } else {
    res.status(403).send('Unauthorized');
  }
});
app.listen(PORT, function() {
  console.log('Server running on port ' + PORT);
});
