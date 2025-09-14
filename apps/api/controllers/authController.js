import { loginService } from '../services/authService.js';

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const result = await loginService(username, password);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(401).json({ message: error.message || 'Authentication failed' });
    }
};
