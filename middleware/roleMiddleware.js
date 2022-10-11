const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const fs = require("fs");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const { acessToken } = req.cookies;
      if (!acessToken) {
        return res.status(403).json({ message: "Пользователь не авторизован" });
      }
      const { roles: userRoles } = jwt.verify(acessToken, secret);
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        req.session.message = {
          iconStyle: "bx bx-user-x",
          type: "check-Issue",
          intro: "Отказано в доступе:",
          message: "У пользователя недостаточно прав.",
        };
        res.status(400).redirect("/ui");
      }
      next();
    } catch (e) {
      console.log(e);
      req.session.message = {
        iconStyle: "x",
        type: "check-Issue",
        intro: "Ошибка:",
        message: "Пользователь не авторизирован.",
      };
      res.status(400).redirect("/");
    }
  };
};
