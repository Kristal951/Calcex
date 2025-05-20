import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import currencyRoutes from './routes/CurrencyConverter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT_NUMBER || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/currency', currencyRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
