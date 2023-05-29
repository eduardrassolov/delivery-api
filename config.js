const DB_URL_CONNECTION =
  "mongodb+srv://test:6YiXhAd3klJjYBtk@cluster0.1nlrtuh.mongodb.net/?retryWrites=true&w=majority";
const DB_NAME = "shop_db";
const PORT_NUBMER = 3001;

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: DB_NAME,
};

exports.DB_URL_CONNECTION = DB_URL_CONNECTION;
exports.DB_NAME = DB_NAME;
exports.PORT_NUBMER = PORT_NUBMER;
exports.OPTIONS = OPTIONS;
