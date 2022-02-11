const mongoose = require('mongoose')

module.exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Database Connected')
  } catch (error) {
    console.log('An Error occured!');
    process.exit(1)
  }
}