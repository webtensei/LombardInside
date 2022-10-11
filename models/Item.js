const { Schema, model } = require("mongoose");
const Item = new Schema({
  Image: { type: String, required: false },
  Articul: { type: String, required: true },
  Type: { type: String, required: true },
  Material: { type: String, required: true },
  Weight: { type: String, required: true },
  Price: { type: String, required: true },
  Status: {type: String, required: true},
  Now: { type: String, required: true },
  Delivery: { type: String, required: false },
});
module.exports = model("Item", Item);