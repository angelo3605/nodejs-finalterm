import { loginService, registerService } from '../services/authService.js';

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

export const register = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const result = await registerService(email, password, fullName);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Registration failed' });
    }
};
