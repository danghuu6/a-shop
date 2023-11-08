const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const UserSession = require('../model/userSession');
const { registerValidator } = require('./../validation/auth');

class AuthController {

    async register (req, res) {
        const { error } = registerValidator(req.body);
    
        if (error) return res.status(400).send(error.details[0].message);
    
        const checkEmailExist = await User.findOne({ email: req.body.email });
    
        if (checkEmailExist) return response.status(400).send('Email is exist');
    
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
    
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashPassword,
        });
    
        try {
            const newUser = await user.save();
            return res.send(newUser);
        } catch (err) {
            res.status(400).send(err);
        }
    };

    async login (req, res) {
        const user = await User.findOne({email: req.body.email});
        if (!user) return res.status(400).send('Email or Password is not correct');

        const checkPassword = await bcrypt.compare(req.body.password, user.password);

        if (!checkPassword) return res.status(400).send('Email or Password is not correct');

        const expireDate = new Date(Date.now() + (60 * 60 * 1000 * 24));

        const payload = {
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            roleList: user.roleList,
            expireDate: expireDate
        }
        
        const token = jwt.sign(payload, process.env.TOKEN_SECRET);

        const checkUserSession = await UserSession.findOne({email: user.email});
        if (checkUserSession) await UserSession.deleteOne({email: user.email})

        const userSession = new UserSession({
            email: user.email,
            expireDate: expireDate,
            accessToken: token
        })

        try {
            await userSession.save();
        } catch (err) {
            res.status(400).send(err);
        }

        res.header('auth-token', token).send(token);
    }

    async logout(req, res) {
        const user = await User.findOne({email: req.body.email});
        if (!user) return res.status(400).send({
            code: 400,
            message: "Bad Request",
            Data: null
        });
        

        try {
            await UserSession.deleteOne({email: user.email})
            return res.send({
                code: 200,
                message: "SUCCESS",
                data: null
            })
        } catch(e) {
            res.status(400).send({
                code: 400,
                message: e,
                data: null
            });
        }
    }
}

module.exports = new AuthController;
