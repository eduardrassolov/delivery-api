const mongoose = require("mongoose");

const ShopsSchema = new mongoose.Schema({
  shop_name: String,
});
module.exports = mongoose.model("shops", ShopsSchema);
