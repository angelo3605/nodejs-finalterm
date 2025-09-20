import express from 'express';
const authRouter = express.Router();
import { login } from '../controllers/authController.js';
import passport from '../utils/passport.js';



authRouter.post('/login', login);

// router.use(authMiddleware);
authRouter.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));
authRouter.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        // JWT tạo ở đây nếu bạn muốn
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { userId: req.user.id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Có thể redirect về frontend kèm token
        res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
    }
);

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        // Đăng nhập thành công
        res.redirect('/');
    }
);

export default authRouter;