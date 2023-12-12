const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '24h'})
}

class AuthController {
    async register(req, res) {
        try {
            const {firstName, lastName, username, password} = req.body;

            const [existingUser, userRole] = await Promise.all([
                User.findOne({username}).exec(),
                Role.findOne({role: 'user'}).exec()
            ]);

            if (existingUser) {
                return res.status(409).json({success: false, message: "User already exists."});
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hashSync(password, salt);

            const user = new User({
                firstName,
                lastName,
                username,
                password: hashPassword,
                roles: [userRole.role]
            });

            const result = await user.save();

            const token = generateAccessToken(result._id, result.roles);

            return res.json({success: true, message: "User successfully registered.", token});
        } catch (error) {
            return res.status(400).json({success: false, message: "Registration error."});
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;

            const user = await User.findOne({username}).exec();

            if (!user) {
                return res.status(404).json({success: false, message: `User '${username}' not found.`});
            }

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                return res.status(400).json({success: false, message: "Wrong password."});
            }

            const token = generateAccessToken(user._id, user.roles);

            return res.json({success: true, token});
        } catch (error) {
            return res.status(400).json({success: false, message: "Authorisation error."});
        }
    }

    async getMe(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const {id} = jwt.verify(token, process.env.SECRET_KEY);
            const user = await User.findById(id).exec();
            delete user._doc.password;
            return res.json({success: true, user: user});
        } catch (error) {
            return res.status(400).json({success: false, message: "Failed to get user."});
        }
    }

}

module.exports = new AuthController();