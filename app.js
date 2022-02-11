const express = require('express')
const cors = require('cors')
const dotenv = require("dotenv");
const morgan = require('morgan')
dotenv.config({ path: "./config.env" });

const {connectDB} = require('./db/mongoose');
const campRouter = require('./router/campRouter')
const subscribeRouter = require('./router/subscribeRouter')
const userRouter = require('./router/userRouter')

const app = express();

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
connectDB()

app.use('/api/user', userRouter)
app.use('/api/camp', campRouter)
app.use('/api/subscribe', subscribeRouter)         

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})