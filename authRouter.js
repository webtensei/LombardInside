const Router = require("express");
const router = new Router();
const controller = require("./authController");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
router.post("/", controller.login);
router.post("/users", roleMiddleware(["ADMIN"]), controller.createUser);
router.post(
  "/deleteUser/(:id)",
  roleMiddleware(["ADMIN"]),
  controller.deleteUser
);
router.post("/editUser/(:id)", roleMiddleware(["ADMIN"]), controller.editUser);
router.get(
  "/users",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  controller.getUsers
);
router.get("/ui", authMiddleware);
router.get("/logout", controller.logOut);
router.get(
  "/deleteUser/(:id)",
  roleMiddleware(["ADMIN"]),
  controller.deleteUser
);
module.exports = router;
