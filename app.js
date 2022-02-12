const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
dotenv.config({ path: './config.env' });

const { connectDB } = require('./config/db');
const campRouter = require('./routes/campRouter');
const subscribeRouter = require('./routes/subscribeRouter');
const userRouter = require('./routes/userRouter');
const documentRouter = require('./routes/documentRouter');

const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use("/documents", express.static(path.join(__dirname + "/Documents")));

app.use('/api/user', userRouter);
app.use('/api/camp', campRouter);
app.use('/api/subscribe', subscribeRouter);
app.use('/', documentRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
