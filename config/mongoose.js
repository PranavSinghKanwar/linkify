// const mongoose = require("mongoose");

// mongoose.connect('mongodb://localhost/linkify_development');

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));

// db.once('open', () =>{
//     console.log('Connected to Database :: MongoDB');
// });

// module.exports = db;
// mongoose.js
// mongoose.js
const mongoose = require("mongoose");

// Define an async function to connect to MongoDB and return a promise
async function db() {
  try {
    // Use await to wait for the promise returned by mongoose.connect()
    await mongoose.connect('mongodb://localhost/linkify_development');
    console.log('Connected to MongoDB');
    // Return the MongoClient connection using getClient()
    return mongoose.connection.getClient();
  } catch (err) {
    // Handle any errors
    console.error('Error connecting to MongoDB', err);
  }
}

// Export the async function
module.exports = db;
