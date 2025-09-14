import { confirmTransfer, transferTuitionService } from "../services/transactionService.js";

export const transferTuition = async (req, res) => {
  try {
    const { payer, receiver } = req.body;

    if (!payer) {
      return res.status(400).json({ message: 'Payer is required' });
    }

    if (!receiver) {
      return res.status(400).json({ message: 'Receiver is required' });
    }

    const result = await transferTuitionService(payer, receiver);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message || 'Unable to process the transaction' });
  }
};

export const verifyTransfer = async (req, res) => {
  try {
    const { transactionId, otp } = req.body;

    if (!transactionId || !otp) {
      return res.status(400).json({ message: 'Transaction ID and OTP are required' });
    }

    const result = await confirmTransfer(transactionId, otp);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message || 'Transaction not allowed' });
  }
};
