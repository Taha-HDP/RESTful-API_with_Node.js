const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const schema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true, length: 11 },
    address: String,
    create_date: String,
});

schema.methods.createAuthToken = function () {
    const data = {
        _id: this.id,
        username: this.username,
        phone: this.phone,
        role: this.role,
    }
    return jwt.sign(data, config.get("jwtPrivetKey"));
}
const UserModel = mongoose.model('User', schema);
mongoose.set('strictQuery', true);
module.exports = UserModel;