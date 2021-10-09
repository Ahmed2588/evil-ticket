const mongoose = require("mongoose");
const mongoURL = process.env.MONGO_URL;

module.exports.run = (client) => {
    console.log(`${client.user.tag} has logged in.`);

    mongoose.connect(mongoURL).then(console.log("Connected to mongoDB"))
};