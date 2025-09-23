import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { passport } from './utils/passport.js';
import router from './routes/router.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(passport.initialize());
app.use('/', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
