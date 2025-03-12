const express = require("express");

const router = express.Router();

const { homePage, registerPage, loginPage, register_post, login_post, loginAdmin, logout_get } = require("../controllers/userController");
const { loginAdmin_post } = require("../controllers/adminController");
const { aboutPage } = require("../controllers/userController");

router.get("/", homePage);

router.get("/about", aboutPage);

router.get("/register", registerPage);
router.post('/register',register_post);

router.get("/login", loginPage);
router.post('/login',login_post);

router.get('/loginAdminse', loginAdmin);
router.post('/loginAdminse', loginAdmin_post)

router.get('/logout', logout_get)









module.exports = router;