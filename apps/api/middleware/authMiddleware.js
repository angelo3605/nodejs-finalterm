import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Không có token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // debug
        req.user = { userId: decoded.userId }; // ensure đúng key userId
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}


export default authMiddleware;
