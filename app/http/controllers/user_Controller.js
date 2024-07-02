const User = require("../../models/user_model");
const bcrypt = require("bcrypt");
const dateTime = require('node-datetime');
const { registerValidator, loginValidator, editValidator } = require('../validators/user_validator')
module.exports = new (class User_controller {
    async getUser(req, res) {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("user not found");
        res.send(user);
    }
    async getAllUsers(req, res) {
        //Add pagination 
        const pageSize = 5;
        const pageNumber = req.query.Page;
        try {
            const users = await User.find().skip((pageNumber - 1) * pageSize).limit(pageSize);
            res.send(users);
        } catch (err) {
            console.log(err.message);
        }
    }
    async createUser(req, res) {
        //validate data
        const { error } = registerValidator(req.body);
        if (error) return res.status(400).send({ message: error.message });
        //uniqe check
        const phone = await User.findOne({ phone: req.body.phone });
        const username = await User.findOne({ username: req.body.username });
        if (phone || username) {
            return res.status(400).send("this user is already registered");
        }
        //create new user
        const newMember = new User({
            password: req.body.password,
            username: req.body.username,
            phone: req.body.phone,
            create_date: dateTime.create().format('Y-m-d')
        });
        //encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(newMember.password, salt);
        newMember.password = hashedPass;
        await newMember.save();
        //create jwt token
        const token = newMember.createAuthToken();
        res.header("Access-Control-Expose-headers", "x-auth-token").header("x-auth-token", token).send();
    }
    async editUser(req, res) {
        if (req.user._id != req.params.id) {
            res.status(400).send("you need to login with your own account");
        }
        //validate data
        const { error } = editValidator(req.body);
        if (error) return res.status(400).send({ message: error.message });
        //validate id
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("user not found");
        //uniqe check
        if (req.body.phone) {
            let checkUnique = await User.find({ phone: req.body.phone });
            if (checkUnique.length > 0) {
                return res.send("phone not_unique");
            }
            user.phone = req.body.phone;
        }
        if (req.body.username) {
            let checkUnique = await User.find({ username: req.body.username });
            console.log(checkUnique) ;
            if (checkUnique.length > 0) {
                return res.send("username not_unique");
            }
            user.username = req.body.username;
        }
        if (req.body.address) {
            user.address = req.body.address;
        }
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }
        //save data
        await user.save((err) => {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.status(200).send("unique");
            }
        });
    }
    async deleteUser(req, res) {
        const id = req.params.id;
        if (req.user._id != id) {
            res.status(400).send("you need to login with your own account");
        }
        await User.findByIdAndRemove(id);
        res.status(200).send();
    }
    async login(req, res) {
        //validate data
        const { error } = loginValidator(req.body);
        if (error) return res.status(400).send({ message: error.message });
        //input can be username or phone
        const userA = await User.findOne({ phone: req.body.input });
        const userB = await User.findOne({ username: req.body.input });
        if (userA || userB) {
            let result, token;
            if (userA) {
                result = await bcrypt.compare(req.body.password, userA.password);
                token = userA.createAuthToken();
            }
            else {
                result = await bcrypt.compare(req.body.password, userB.password);
                token = userB.createAuthToken();
            }
            if (!result) {
                return res.status(404).send("not faound");
            }
            res.header("Access-Control-Expose-headers", "x-auth-token").header("x-auth-token", token).send();
        } else {
            return res.status(404).send("not faound");
        }
    }
    async isValidString(input) {
        const forbiddenChars = /[;,\[\]{}\\'"|]/;
        return !forbiddenChars.test(input);
    }
});