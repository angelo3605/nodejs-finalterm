import express from 'express';
const transactionRoutes = express.Router();
import { transferTuition, verifyTransfer } from '../controllers/transactionsController.js';


transactionRoutes.post('/transaction', transferTuition)
transactionRoutes.post('/verify', verifyTransfer)


export default transactionRoutes;