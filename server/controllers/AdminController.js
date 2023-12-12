const User = require('../models/User');
const Role = require('../models/Role');
const authController = require('./AuthController.js');

class AdminController {
    async createUser(req, res) {
        await authController.register(req, res);
    }

    async getUsers(req, res) {
        try {
            const users = await User.find().exec();
            return res.json({success: true, users});
        } catch (error) {
            return res.status(404).json({success: false, message: "Failed to get users."});
        }
    }

    async getUser(req, res) {
        try {
            const _id = req.params.id;
            const user = await User.findOne({_id}).exec();
            return res.json({success: true, user});
        } catch (error) {
            return res.status(404).json({success: false, message: "Failed to get user. User not found."});
        }
    }

    async updateUser(req, res) {
        try {
            const _id = req.params.id;
            const {firstName, lastName, username, roles} = req.body;

            const oldUser = await User.findOneAndUpdate({_id}, {
                firstName,
                lastName,
                username,
                roles
            }).exec();

            const newUser = await User.findOne({_id});

            delete oldUser._doc.password;
            delete newUser._doc.password;

            return res.json({success: true, message: "User successfully updated.", oldUser, newUser});
        } catch (error) {
            res.status(400).json({success: false, message: "Failed to update user."});
        }
    }

    async deleteUser(req, res) {
        try {
            const _id = req.params.id;
            const user = await User.findOneAndDelete({_id}).exec();
            return res.json({success: true, message: "User successfully deleted.", user});
        } catch (error) {
            console.log(error)
            return res.status(400).json({success: false, message: "Failed to delete user."});
        }
    }

    async createRole(req, res) {
        try {
            const roleName = req.body.role;

            const existingRole = await Role.findOne({role: roleName}).exec();
            if (existingRole) {
                return res.status(409).json({success: false, message: `Role with name '${roleName}' already exist.`});
            }

            const role = new Role({
                role: roleName
            });

            const result = await role.save();

            return res.json({success: true, message: "Role successfully created.", role: result});
        } catch (error) {
            return res.status(400).json({success: false, message: "Failed to create a new role."});
        }
    }

    async getRoles(req, res) {
        try {
            const roles = await Role.find().exec();
            return res.json({success: true, roles});
        } catch (error) {
            return res.status(404).json({success: false, message: "Failed to get roles."});
        }
    }

    async getRole(req, res) {
        try {
            const _id = req.params.id;
            const role = await Role.findOne({_id}).exec();
            return res.json({success: true, role});
        } catch (error) {
            return res.status(404).json({success: false, message: "Failed to get role. Role not found."});
        }
    }

    async updateRole(req, res) {
        try {
            const _id = req.params.id;
            const roleName = req.body.role;

            const oldRole = await Role.findOneAndUpdate({_id}, {
                role: roleName
            }).exec();

            const newRole = await Role.findOne({_id}).exec();

            return res.json({success: true, message: "Role successfully updated.", oldRole, newRole});
        } catch (error) {
            res.status(400).json({success: false, message: "Failed to update role."});
        }
    }

    async deleteRole(req, res) {
        try {
            const _id = req.params.id;
            const role = await Role.findOneAndDelete({_id}).exec();
            return res.json({success: true, message: "Role successfully deleted.", role});
        } catch (error) {
            console.log(error)
            return res.status(400).json({success: false, message: "Failed to delete role."});
        }
    }

}

module.exports = new AdminController();