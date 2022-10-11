const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const fs = require("fs");
module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const { acessToken } = req.cookies;
    if (!acessToken) {
      req.session.message = {
        iconStyle: "x",
        type: "check-Issue",
        intro: "Ошибка:",
        message: "Пользователь не авторизирован.",
      };
      res.status(400).redirect("/");
    }
    const decodedData = jwt.verify(acessToken, secret);
    req.user = decodedData;
    next();
  } catch (e) {
    console.log(e);
    req.session.message = {
      iconStyle: "x",
      type: "check-Issue",
      intro: "Ошибка:",
      message: "У пользователя недостаточно прав.",
    };
    res.status(400).redirect("/");
  }
};

// ДОРАБОТАТЬ! ЕСЛИ НЕ СУЩЕСТВУЕТ currentSessionToken ТО РЕДИРЕКТ НА МЕЙН А НЕ CATCH E, ЭТО НЕ НЕИЗВЕСТНАЯ ОШИБКА
