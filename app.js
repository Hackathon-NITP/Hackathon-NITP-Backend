const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: './config.env' });

const { connectDB } = require('./config/db');
const campRouter = require('./routes/campRouter');
const subscribeRouter = require('./routes/subscribeRouter');
const userRouter = require('./routes/userRouter');

const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/user', userRouter);
app.use('/api/camp', campRouter);
app.use('/api/subscribe', subscribeRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
