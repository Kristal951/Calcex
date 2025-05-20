import express from 'express';
import { currencyController} from '../controllers/CurrencyConverter.js';

const router = express.Router();

router.get('/convert', currencyController.convertCurrency);
router.get('/supportedCurrencies', currencyController.getAllSupportedCurrencies);

export default router;
