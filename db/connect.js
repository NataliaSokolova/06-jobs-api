const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose.connect(url, {
    // useNewUrlParser: true, // Use the new URL string parser
    // useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
   
  })
}

module.exports = connectDB
