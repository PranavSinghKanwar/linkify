const mongoose = require("mongoose");
const env = require("./environment");

// Use the db_name from the environment configuration
const dbName = env.db_name;

// Define an async function to connect to MongoDB and return a promise
async function db() {
    try {
        // Use await to wait for the promise returned by mongoose.connect()
        await mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        // Now, you can specify the collection name separately
        const sessionCollection = mongoose.connection.collection('sessions');
        
        // Do further operations with sessionCollection or other collections as needed

        // Return the MongoClient connection using getClient()
        return mongoose.connection.getClient();
    } catch (err) {
        // Handle any errors
        console.error('Error connecting to MongoDB', err);
    }
}

// Export the async function
module.exports = db;
