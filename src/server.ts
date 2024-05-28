import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { productRouter } from './routes/productRoutes';
import { authRouter } from './routes/auth.route';
import { userRouter } from './routes/user.route';

const PORT = process.env.PORT || 5005;
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(express.static('static'));

app.use('/products', productRouter);
app.use(authRouter);
app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
