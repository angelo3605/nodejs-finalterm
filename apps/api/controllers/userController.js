import { lookUpInfo } from "../services/userService.js";

export const findMore = async (req, res) => {
    try {
        const { mssv } = req.body;

        if (!mssv) {
            return res.status(400).json({ message: 'MSSV is required' });
        }

        const customer = await lookUpInfo(mssv);
        return res.status(200).json(customer);
    } catch (error) {
        return res.status(401).json({ message: error.message || 'Customer not found' });
    }
};
