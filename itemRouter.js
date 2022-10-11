const Router = require("express");
const itemRouter = new Router();
const itemController = require("./itemController");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
const Item = require("./models/Item");
itemRouter.post("/createNewItem", itemController.createNewItem);
itemRouter.post("/deleteItem/(:id)", itemController.deleteItem);
itemRouter.post("/deliveryItem/(:id)", itemController.deliveryItem);
itemRouter.post(
  "/itemInDelivery/(:id)",
  roleMiddleware(["DELIVERY", "ADMIN"]),
  itemController.itemInDelivery
);
itemRouter.post(
  "/itemDelivered/(:id)",
  roleMiddleware(["DELIVERY", "ADMIN"]),
  itemController.itemDelivered
);

itemRouter.get(
  "/ui",
  roleMiddleware(["DELIVERY", "ADMIN", "USER"]),
  itemController.getItems
);
itemRouter.get(
  "/delivery",
  roleMiddleware(["DELIVERY", "ADMIN"]),
  itemController.deliveryList
);
itemRouter.get("/deleteItem/(:id)", itemController.deleteItem);
itemRouter.get("/deliveryItem/(:id)", itemController.deliveryItem);
itemRouter.get(
  "/itemInDelivery/(:id)",
  roleMiddleware(["DELIVERY", "ADMIN"]),
  itemController.itemInDelivery
);
itemRouter.get(
  "/itemDelivered/(:id)",
  roleMiddleware(["DELIVERY", "ADMIN"]),
  itemController.itemDelivered
);
module.exports = itemRouter;
