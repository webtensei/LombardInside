const User = require("./models/User");
const jwt = require("jsonwebtoken");
const Item = require("./models/Item");
const { secret } = require("./config");
const createPath = require("./helpers/createPath");
const mongoose = require("mongoose");
var fs = require("fs");
class itemController {
  async createNewItem(req, res) {
    try {
      const {
        Image,
        Articul,
        Type,
        Material,
        Weight,
        Price,
        Status,
        Now,
        Delivery,
      } = req.body;
      const item = new Item({
        Image,
        Articul,
        Type,
        Material,
        Weight,
        Price,
        Status,
        Now,
        Delivery,
      });
      await item.save();
      return res.redirect("/ui");
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Ошибка при добавлении товара" });
    }
  }
  async deleteItem(req, res) {
    try {
      const thisItem = await Item.findById(
        mongoose.Types.ObjectId(req.params.id)
      );
      if (thisItem) {
        await Item.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id));
        req.session.message = {
          iconStyle: "check",
          type: "check-Success",
          intro: "Успешно",
          message: "Предмет удалён.",
        };
        res.redirect("../ui");
      }
    } catch (e) {
      req.session.message = {
        iconStyle: "x",
        type: "check-Issue",
        intro: "Ошибка",
        message: "Ваших прав недостаточно для этого действия.",
      };
      console.log(e);
      res.redirect("../ui");
    }
  }
  async getItems(req, res) {
    try {
      const { acessToken } = req.cookies;
      const payload = jwt.verify(acessToken, secret);
      const user = await User.findById(payload.id);
      const payloadstring = JSON.stringify(user);
      const AllItems = await Item.find();
      res.render("ui", { AllItems: AllItems, payload: payloadstring });
    } catch (e) {}
  }
  async deliveryList(req, res) {
    try {
      const { acessToken } = req.cookies;
      const payload = jwt.verify(acessToken, secret);
      const user = await User.findById(payload.id);
      const payloadstring = JSON.stringify(user);
      const AllItems = await Item.find();
      res.render("delivery", { AllItems: AllItems, payload: payloadstring });
    } catch (e) {}
  }
  async deliveryItem(req, res) {
    try {
      const { Articul, Now, Delivery, Status } = req.body;
      let item = await Item.findByIdAndUpdate(
        req.params.id,
        {
          Articul,
          Now,
          Delivery,
          Status,
        },
        { useFindAndModify: false }
      );
      await item.save();
      req.session.message = {
        iconStyle: "check",
        type: "check-Success",
        intro: "Успешно",
        message: "Информация обновлена.",
      };
      res.status(400).redirect("/ui");
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "nt" });
    }
  }
  async itemInDelivery(req, res) {
    try {
      let thisItem = await Item.findById(req.params.id);
      let item = await Item.findByIdAndUpdate(
        req.params.id,
        {
          Now: thisItem.Delivery,
          Status: "deliveryNow",
          Delivery: "",
        },
        { useFindAndModify: false }
      );
      await item.save();
      req.session.message = {
        iconStyle: "check",
        type: "check-Success",
        intro: "Успешно",
        message: "Информация обновлена.",
      };
      res.status(400).redirect("/delivery");
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "nt" });
    }
  }
  async itemDelivered(req, res) {
    try {
      let item = await Item.findByIdAndUpdate(
        req.params.id,
        {
          Status: "OK",
        },
        { useFindAndModify: false }
      );
      await item.save();
      req.session.message = {
        iconStyle: "check",
        type: "check-Success",
        intro: "Успешно",
        message: "Информация обновлена.",
      };
      res.status(400).redirect("/delivery");
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "nt" });
    }
  }
}
module.exports = new itemController();
