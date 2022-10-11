const User = require("./models/User");
const Role = require("./models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { secret } = require("./config");
var fs = require("fs");
const { json } = require("body-parser");
const { nextTick } = require("process");
generateAcessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: "10h" });
};

class authController {
  async createUser(req, res) {
    try {
      const { username, password, name, surname, patronymic, userRole } =
        req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким логином уже существует" });
      }
      var hashPassword = bcrypt.hashSync(password, 5);
      const user = new User({
        username,
        password: hashPassword,
        name,
        surname,
        patronymic,
        roles: [userRole],
      });
      await user.save();
      req.session.message = {
        iconStyle: "check",
        type: "check-Success",
        intro: "Успешно",
        message: "Пользователь зарегестрирован.",
      };
      res.redirect("/users");
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Ошибка регистрации" });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        req.session.message = {
          iconStyle: "x",
          type: "check-Issue",
          intro: "Ошибка:",
          message: "Пользователь с таким логином не существует.",
        };
        res.status(400).redirect("/");
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        req.session.message = {
          iconStyle: "x",
          type: "check-Issue",
          intro: "Ошибка:",
          message: "Введен неверный пароль.",
        };
        res.status(400).redirect("/");
      } else {
        const token = generateAcessToken(user._id, user.roles);
        req.session.message = {
          iconStyle: "check",
          type: "check-Success",
          intro: "Успешная авторизация:",
          message: "Данные под защитой.",
        };

        res
          .cookie("acessToken", token, {
            maxAge: 10 * 60 * 60 * 1000,
          })
          .redirect("ui");
      }
    } catch (e) {
      req.session.message = {
        iconStyle: "x",
        type: "check-Issue",
        intro: "Ошибка входа:",
        message: "Неизвестная.",
      };
      res.status(400).redirect("/");
    }
  }
  async logOut(req, res) {
    try {
      res.clearCookie("acessToken");
      req.session.message = {
        iconStyle: "check",
        type: "check-Success",
        intro: "До новых встреч!",
        message: "Вы вышли из сети.",
      };
      res.status(400).redirect("/");
    } catch (e) {}
  }
  async getUsers(req, res) {
    try {
      const { acessToken } = req.cookies;
      const payload = jwt.verify(acessToken, secret);
      const user = await User.findById(payload.id);
      const payloadstring = JSON.stringify(user);
      const AllUsers = await User.find();
      res.render("users", { AllUsers: AllUsers, payload: payloadstring });
    } catch (e) {}
  }
  async deleteUser(req, res) {
    try {
      const thisUser = await User.findById(
        mongoose.Types.ObjectId(req.params.id)
      );
      console.log(thisUser.roles);
      if (thisUser.roles.includes("ADMIN")) {
        req.session.message = {
          iconStyle: "x",
          type: "check-Issue",
          intro: "Ошибка",
          message: "Ваших прав недостаточно для этого действия.",
        };
        res.redirect("../users");
      } else {
        await User.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id));
        req.session.message = {
          iconStyle: "check",
          type: "check-Success",
          intro: "Успешно",
          message: "Пользователь удалён.",
        };
        res.redirect("../users");
      }
    } catch (e) {
      req.session.message = {
        iconStyle: "x",
        type: "check-Issue",
        intro: "Ошибка",
        message: "Ваших прав недостаточно для этого действия.",
      };
      console.log(e);
      res.redirect("../users");
    }
  }
  async editUser(req, res) {
    try {
      const { username, password, name, surname, patronymic, userRole } =
        req.body;
      var hashPassword = bcrypt.hashSync(password, 5);
      let user = await User.findByIdAndUpdate(
        req.params.id,
        {
          username,
          password: hashPassword,
          name,
          surname,
          patronymic,
          roles: [userRole],
        },
        { useFindAndModify: false }
      );
      await user.save();
      req.session.message = {
        iconStyle: "check",
        type: "check-Success",
        intro: "Успешно",
        message: "Информация обновлена.",
      };
      res.status(400).redirect("/users");
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "nt" });
    }
  }
  async crur(req, res) {
    const { acessToken } = req.cookies;
    const payload = jwt.verify(acessToken, secret);
    const user = await User.findById(payload.id);
    const payloadstring = JSON.stringify(user);
    console.log(payloadstring);
  }
}
module.exports = new authController();
