const express = require("express");

const authController = require("../controllers/authControllers");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.getme);

module.exports = router;
