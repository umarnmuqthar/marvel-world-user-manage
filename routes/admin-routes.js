const express = require("express");
const router = express.Router();

const adminControllers = require("../controllers/admin-controllers");

router.get("/", adminControllers.getAdminHome);

router.get("/login", adminControllers.getLogin);
router.post("/login", adminControllers.postLogin);
router.post("/logout", adminControllers.postLogout);

router.get("/add-user", adminControllers.getAddUser);
router.post("/add-user", adminControllers.postAddUser);
router.get("/edit-user/:id", adminControllers.getEditUser);
router.post("/edit-user", adminControllers.postEditUser);
router.post("/delete-user/:id", adminControllers.deleteUser);

router.get("/movies", adminControllers.getMovies);

router.get("*", (req, res) => {
  res.status(404).render("404", { pageTitle: "404", isAdmin: true });
});

module.exports = router;
