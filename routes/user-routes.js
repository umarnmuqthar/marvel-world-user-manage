const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/user-controllers");

router.get("/", userControllers.getHome);

router.get("/login", userControllers.getLogin);
router.post("/login", userControllers.postLogin);
router.post("/logout", userControllers.postLogout);

router.get("/signup", userControllers.getSignup);
router.post("/signup", userControllers.postSignup);

router.get("/movie/:id", userControllers.getSingleMovie);

// error
router.get("*", (req, res) => {
  res.status(404).render("404", { pageTitle: "404", isAdmin: false });
});

module.exports = router;
