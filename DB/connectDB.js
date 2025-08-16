const mongoose = require('mongoose')

const connectDB = async () => {
    return mongoose.connect('mongodb://127.0.0.1:27017/travelBucket')
        .then(() => {
            console.log("connection established successfully")
        })
        .catch((error) => {
            console.log(error)
        });

}

module.exports = connectDB;