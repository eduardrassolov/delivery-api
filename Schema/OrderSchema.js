const { mongoose, Schema } = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customers: {
    name: String,
    email: String,
    phone: String,
    adress: String,
  },
  productsArr: [
    {
      product_id: {
        type: Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: Number,
    },
  ],

  bill: Number,
  created: Date,
  number_order: Number,
});
module.exports = mongoose.model("orders", OrderSchema);
