const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'departures.json');

// Opprett data-mappe og fil hvis ikke eksisterer
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]');
}

app.use(cors());
app.use(express.json());
app.use(express.static('../frontend')); // Server frontend

// --- API: Hent alle avganger ---
app.get('/api/departures', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Kunne ikke lese data' });
  }
});

// --- API: Lagre alle avganger ---
app.post('/api/departures', (req, res) => {
  try {
    const data = req.body;
    if (Array.isArray(data)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      res.json({ success: true, message: 'Lagret!' });
    } else {
      res.status(400).json({ error: 'Forventet array' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke lagre' });
  }
});

// --- Server frontend ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server kjører på http://localhost:${PORT}`);
  console.log(`📁 Data lagres i: ${DATA_FILE}`);
});