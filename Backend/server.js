const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contactRoutes = require('./routes/contactRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/contacts', contactRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Contact Book API is running 🚀' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
