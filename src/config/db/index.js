const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.DB_LINK + process.env.DB_NAME);
        console.log("Connect DB Successfully")
    } catch (error) {
        console.log("Connect Fail!!")
    }
}

module.exports = { connect }
