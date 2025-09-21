import express from 'express';
import { login, register } from '../controllers/authController.js';
import passport from '../utils/passport.js';
import authMiddleware from '../middleware/authMiddleware.js';


const authRouter = express.Router();


authRouter.post('/register', register);
authRouter.post('/login', login);

authRouter.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

authRouter.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { userId: req.user.id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
    }
);

// Xử lý đăng nhập qua Facebook
authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

authRouter.get('/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { userId: req.user.id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
    }
);


export default authRouter;