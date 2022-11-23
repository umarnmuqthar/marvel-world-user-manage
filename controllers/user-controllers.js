const User = require("../models/user");

let sess;
exports.getHome = (req, res) => {
  sess = req.session;
  if (sess.email) {
    return res.render("app/home", {
      pageTitle: "Marvel World",
    });
  }
  res.redirect("/login");
};

exports.getLogin = (req, res) => {
  sess = req.session;
  let message;
  if (req.query.message == "invalid-email") {
    message = "There is no user with this email address. Please Signup";
  } else if (req.query.message == "invalid-password") {
    message = "Incorrect password";
  } else if (req.query.message == "user-deleted") {
    message =
      "This user has been deleted. Please contact support for more details.";
  }
  if (sess.email) {
    return res.redirect("/");
  }
  res.render("app/login", {
    pageTitle: "Login: Marvel World",
    message: message,
  });
};
exports.postLogin = (req, res) => {
  sess = req.session;
  const { email, password } = req.body;
  const user = User.findByEmail(email);
  user.then((user) => {
    if (user) {
      if (user.deleted == true) {
        return res.redirect("/login?message=user-deleted");
      }
      if (user.password == password) {
        sess.email = email;
        return res.redirect("/");
      } else {
        return res.redirect("/login?message=invalid-password");
      }
    } else {
      return res.redirect("/login?message=invalid-email");
    }
  });
};
exports.postLogout = (req, res) => {
  req.session.email = null;
  return res.redirect("/");
};

exports.getSignup = (req, res) => {
  sess = req.session;
  if (sess.email) {
    return res.redirect("/");
  }
  let message;
  if (req.query.message == "email-exist") {
    message =
      "Email already exist. Please provide a different email address or signin.";
  } else if (req.query.message == "password-mismatch") {
    message = "Passwords must be same";
  }
  res.render("app/signup", {
    pageTitle: "Signup: Marvel World",
    message: message,
  });
};

exports.postSignup = (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password == confirmPassword) {
    const checkUser = User.findByEmail(email);
    checkUser.then((user) => {
      if (!user) {
        const newUser = new User(name, email, password);
        console.log(user);
        newUser
          .save()
          .then((result) => {
            sess = req.session;
            sess.email = email;
            return res.redirect("/");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return res.redirect("/signup?message=email-exist");
      }
    });
  } else {
    return res.redirect("/signup?message=pasword-mismatch");
  }
};
exports.getSingleMovie = (req, res) => {
  sess = req.session;
  if (sess.email) {
    return res.render("app/moviePage", {
      id: req.params.id,
      pageTitle: "Movie",
    });
  }
  res.redirect("/");
};
