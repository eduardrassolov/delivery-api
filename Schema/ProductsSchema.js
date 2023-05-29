const { mongoose, Schema } = require("mongoose");
const ShopsSchema = require("./ShopsSchema");

const ProductsSchema = new Schema({
  product: String,
  price: Number,
  img_url: String,
  shop_id: {
    type: Schema.Types.ObjectId,
    ref: "shops",
  },
});
module.exports = mongoose.model("products", ProductsSchema);
