const path = require("path");

const express = require("express");
const session = require("express-session");
const nocache = require("nocache");
const mongoConnect = require("./util/database").mongoConnect;

require("dotenv").config();
const app = express();

const userRouter = require("./routes/user-routes");
const adminRouter = require("./routes/admin-routes");

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(nocache());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/admin", adminRouter);
app.use("/", userRouter);

mongoConnect(() => {
  app.listen(process.env.PORT);
});
