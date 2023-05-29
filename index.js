const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const orders = require("./Schema/OrderSchema.js");
const shops = require("./Schema/ShopsSchema.js");
const products = require("./Schema/ProductsSchema.js");
const {
  DB_URL_CONNECTION,
  DB_NAME,
  PORT_NUBMER,
  OPTIONS,
} = require("./config.js");
const { async } = require("regenerator-runtime");

//TODO: refactor CRUD operations, make more ORM-like

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//
app.listen(PORT_NUBMER, () => {
  console.log(`Server running on port ${PORT_NUBMER}`);
});
//
app.get('/', (req,cres) =>{
  res.setHeader("Access-Control-Allow-Credentials", true);
  red.send('');
});

//from client - when page loads. From server - send to client array of all shops
app.get("/api/getshops", async (req, res) => {
  await mongoose.connect(DB_URL_CONNECTION, OPTIONS);
  let result;
  try {
    result = await shops.find();
    console.log(result);
  } catch (err) {
    console.error(err);
  } finally {
    res.send(result);
  }
});

//From client when page loads. From server - send to client array of all products
app.get("/api/getproducts", async (req, res) => {
  const filter = req.query.shopid;
  console.log(filter);
  await mongoose.connect(DB_URL_CONNECTION, OPTIONS);
  let result;

  try {
    result = await products.find({ shop_id: filter }).populate("shop_id");
    console.log(result);
  } catch (err) {
    console.error(err);
  } finally {
    res.send(result);
  }
});

async function requestTo(collectionName) {}

app.post("/api/submitorder", async (req, res) => {
  const order = { ...req.body };
  console.log(order);

  const orderToSend = {
    ...order,
    productsArr: order.productsArr.map((product) => {
      const id = new ObjectId(product.product_id);
      return {
        ...product,
        product_id: new ObjectId(id),
      };
    }),
  };
  const response = await addOrderToDb(orderToSend);
  res.send(response);
});
async function addOrderToDb(order) {
  await mongoose.connect(DB_URL_CONNECTION, OPTIONS);
  let result;
  try {
    const orderList = await orders.find();
    order.number_order = getLastOrder(orderList);

    result = await orders.create(order);
  } catch (err) {
    console.error(err);
  } finally {
    return result;
  }
}

function getLastOrder(list) {
  return list.length + 1;
}

app.get("/api/searchByorder", async (req, res) => {
  console.log("This is search by order ", req.query.order);
  try {
    const response = await searchOrders(
      "number_order",
      Number(req.query.order)
    );
    console.log("By order", response);
    res.send(response);
  } catch (err) {
    res.status(err.message).send(err.message);
  }
});
app.get("/api/searchByphone", async (req, res) => {
  console.log("This is search by phone", req.query.phone);
  try {
    const response = await searchOrders("customers.phone", req.query.phone);
    console.log("By phone", response);
    res.send(response);
  } catch (err) {
    console.log(err.message);
  }
});
app.get("/api/searchByemail", async (req, res) => {
  console.log("This is search by email", req.query.email);
  try {
    const response = await searchOrders("customers.email", req.query.email);
    console.log("By email", response);
    res.send(response);
  } catch (err) {
    console.log(err.message);
  }
});
async function searchOrders(searchBy, searchMask) {
  //use mongoose
  await mongoose.connect(DB_URL_CONNECTION, OPTIONS);
  try {
    const results = await orders.find({ [searchBy]: searchMask }).populate({
      path: "productsArr.product_id",
      populate: {
        path: "shop_id",
        model: "shops",
      },
    });
    if (results.length === 0) throw new Error(204);

    const formattedResults = await results.map((entry) => {
      const order = {
        _id: entry._id,
        order_number: entry.number_order,
        customers: entry.customers,
        productsArr: entry.productsArr.map((product) => {
          return {
            name: product.product_id.product,
            shop: product.product_id.shop_id.shop_name,
            quantity: product.quantity,
            price: product.product_id.price,
          };
        }),
        created: entry.created,
        bill: entry.bill,
      };
      return order;
    });

    return formattedResults;
  } catch (err) {
    throw err;
  }
}
