const mongoose = require("mongoose");
const DB = "mongodb://127.0.0.1:27017/validations-web15";
const connect = () => {
    return mongoose.connect(DB).then(() => {
        console.log("connection successful");
    }).catch((err) => console.log(err));
};

module.exports = connect;