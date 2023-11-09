const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/entity/User');
const commonResponse = require('../model/response/commonResponse');
const message = require('../constant/message')
const UserSession = require('../model/entity/UserSession');
const { registerValidator } = require('./../validation/auth');

class AuthController {

    async register (req, res) {
        const { error } = registerValidator(req.body);
    
        if (error) return res.status(400).send(new commonResponse(400, error.details[0].message));
    
        const checkEmailExist = await User.findOne({ email: req.body.email });
    
        if (checkEmailExist) return response.status(400).send(new commonResponse(400, message.EMAIL_EXIST));
    
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
    
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashPassword,
        });
    
        try {
            const newUser = await user.save();
            return res.send(new commonResponse(200, message.SUCCESS, newUser));
        } catch (err) {
            console.log(err)
            res.status(400).send(new commonResponse(400, message.BAB_REQUEST));
        }
    };

    async login (req, res) {
        const user = await User.findOne({email: req.body.email});
        if (!user) return res.status(400).send(new commonResponse(400, message.LOGIN_FAIL));

        const checkPassword = await bcrypt.compare(req.body.password, user.password);

        if (!checkPassword) return res.status(400).send(new commonResponse(400, message.LOGIN_FAIL));

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
            res.status(400).send(new commonResponse(400, message.BAB_REQUEST));
        }

        res.header('auth-token', token).send(token);
    }

    async logout(req, res) {
        const user = await User.findOne({email: req.body.email});
        if (!user) return res.status(400).send(new commonResponse(400, message.USER_NOT_FOUND));
        

        try {
            await UserSession.deleteOne({email: user.email})
            return res.send(new commonResponse(200, message.SUCCESS))
        } catch(e) {
            res.status(400).send(new commonResponse(400, message.BAB_REQUEST));
        }
    }
}

module.exports = new AuthController;
