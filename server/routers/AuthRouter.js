const Router = require('express');

const authController = require('../controllers/AuthController.js');
const {validateUser} = require('../validations/UserValidator.js');
const authMiddleware = require('../middlewares/AuthMiddleware.js');

const router = new Router();

router.route('/register').post(validateUser, authController.register);
router.route('/login').post(authController.login);
router.route('/me', ).get(authMiddleware, authController.getMe);

module.exports = router;