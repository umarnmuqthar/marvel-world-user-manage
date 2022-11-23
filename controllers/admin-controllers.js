const User = require("../models/user");
const { ObjectId } = require("mongodb");

exports.getAdminHome = (req, res) => {
  if (req.session.adminEmail) {
    const searchValue = req.query.query;
    if (!searchValue) {
      console.log(req.session);
      let message;
      if (req.session.userCreated) {
        message = "User created successfully";
        req.session.userCreated = null;
      }
      User.fetch()
        .then((users) => {
          users.shift();
          res.render("admin/home", {
            pageTitle: "Admin Panel",
            users: users,
            message: message,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      User.fetchByValue(searchValue)
        .then((users) => {
          res.render("admin/home", { pageTitle: "Admin Panel", users: users });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } else {
    return res.redirect("/admin/login");
  }
};

exports.getLogin = (req, res) => {
  if (!req.session.adminEmail) {
    let message;
    if (req.session.message == "invalid-pswd") {
      message = "Password Incorrect";
    } else if (req.session.message == "invalid-user") {
      message = "Access denied, Please use a valid email address";
    }
    res.render("admin/login", { pageTitle: "Admin Login", message: message });
  } else {
    return res.redirect("/admin");
  }
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  const user = User.findByEmail(email);
  user
    .then((user) => {
      if (user) {
        if (user.isAdmin == true) {
          if (user.password == password) {
            req.session.adminEmail = email;
            res.redirect("/admin");
          } else {
            req.session.message = "invalid-pswd";
            res.redirect("/admin/login");
          }
        } else {
          req.session.message = "invalid-user";
          res.redirect("/admin/login");
        }
      } else {
        req.session.message = "invalid-user";
        res.redirect("/admin/login");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res) => {
  req.session.adminEmail = null;
  return res.redirect("/admin");
};

exports.getAddUser = (req, res) => {
  if (!req.session.adminEmail) {
    return res.redirect("/admin");
  }
  let message;
  if (req.session.passwordState == "invalid") {
    req.session.passwordState = null;
    message = "Passwords must be same";
  } else if (req.session.userExist) {
    req.session.userExist = null;
    message = "User already exist. Please provide a different email address.";
  }
  res.render("admin/add-user", { pageTitle: "Add new user", message: message });
};

exports.postAddUser = (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password == confirmPassword) {
    const checkUser = User.findByEmail(email);
    checkUser.then((user) => {
      console.log(user);
      if (!user) {
        const newUser = new User(name, email, password);
        newUser
          .save()
          .then((result) => {
            req.session.userCreated = true;
            return res.redirect("/admin");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        req.session.userExist = true;
        return res.redirect("/admin/add-user");
      }
    });
  } else {
    req.session.passwordState = "invalid";
    return res.redirect("/admin/add-user");
  }

  const user = new User(name, email, password);
  console.log(user);

  user
    .save()
    .then((result) => {
      res.redirect("/admin");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditUser = (req, res) => {
  if (!req.session.adminEmail) {
    return res.redirect("/admin");
  }
  let message;
  if (req.session.passwordState == "invalid") {
    message = "Passwords must be same";
    req.session.passwordState = null;
  } else if (req.session.userExist) {
    message =
      "A user with the same email id already exist. Please provide a different one.";
    req.session.userExist = null;
  }
  User.findById(req.params.id).then((user) => {
    res.render("admin/edit-user", {
      pageTitle: "Edit User",
      user: user,
      message: message,
    });
  });
};

exports.postEditUser = (req, res) => {
  const { id, name, email, password, confirmPassword } = req.body;
  console.log(ObjectId(id));
  if (password != confirmPassword) {
    req.session.passwordState = "invalid";
    return res.redirect(`/admin/edit-user/${id}`);
  }

  const updatedUser = {
    name,
    email,
    password,
  };

  User.update(id, updatedUser)
    .then(() => {
      return res.redirect("/admin");
    })
    .catch((err) => {
      req.session.userExist = true;
      return res.redirect(`/admin/edit-user/${id}`);
    });
};

exports.deleteUser = (req, res) => {
  User.deleteById(req.params.id)
    .then((result) => {
      res.redirect("/admin");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getMovies = (req, res) => {
  if (!req.session) {
    return res.redirect("/admin");
  }
  res.render("admin/movies", { pageTitle: "Movies" });
};
