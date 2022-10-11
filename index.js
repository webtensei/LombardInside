const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter");
const itemRouter = require("./itemRouter");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const PORT = process.env.PORT || 62023;
const eapp = express();

eapp.use(cookieParser("secret"));
eapp.use(session({ cookie: { maxAge: null } }));
eapp.use(express.json());
eapp.use(express.urlencoded({ extended: false }));

eapp.use(authRouter);
eapp.use(itemRouter);
eapp.use(methodOverride("_method"));

//  middleware
eapp.set("view engine", "ejs");
eapp.use("/img", express.static(__dirname + "/views/img"));
eapp.use("/css", express.static(__dirname + "/views/css"));
eapp.use("/js", express.static(__dirname + "/views/js"));

//flash message middleware
eapp.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});
eapp.use((req, res, next) => {
  res.locals.userinfo = req.session.userinfo;
  delete req.session.userinfo;
  next();
});

//  render
eapp.get("/", (req, res) => {
  res.render("login");
});
eapp.get("/ui", (req, res) => {
  res.render("ui");
});
eapp.get("/CreateNewItem", (req, res) => {
  res.render("CreateNewItem");
});
eapp.get("/items", (req, res) => {
  res.render("");
});
eapp.get("/users", (req, res) => {
  res.render("users");
});
eapp.get("/delivery", (req, res) => {
  res.render("delivery");
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://webtensei:902642qqQ_@cluster0.omew2qe.mongodb.net/?retryWrites=true&w=majority"
    );
    eapp.listen(PORT, () => console.log(`server started at ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};
start();
