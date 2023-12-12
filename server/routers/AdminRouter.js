const Router = require('express');

const adminController = require('../controllers/AdminController.js');
const {validateUser, validateUserUpdate} = require('../validations/UserValidator.js');
const {validateRole} = require('../validations/RoleValidator.js');
const roleMiddleware = require('../middlewares/RoleMiddleware.js');

const router = new Router();

router.route('/users').get(roleMiddleware(['admin']), adminController.getUsers);
router.route('/users/:id').get(roleMiddleware(['admin']), adminController.getUser);
router.route('/users').post(validateUser, roleMiddleware(['admin']), adminController.createUser);
router.route('/users/:id').delete(roleMiddleware(['admin']), adminController.deleteUser);
router.route('/users/:id').put(validateUserUpdate, roleMiddleware(['admin']), adminController.updateUser);

router.route('/roles').get(roleMiddleware(['admin']), adminController.getRoles);
router.route('/roles/:id').get(roleMiddleware(['admin']), adminController.getRole);
router.route('/roles').post(validateRole, roleMiddleware(['admin']), adminController.createRole);
router.route('/roles/:id').delete(roleMiddleware(['admin']), adminController.deleteRole);
router.route('/roles/:id').put(validateRole, roleMiddleware(['admin']), adminController.updateRole);

module.exports = router;