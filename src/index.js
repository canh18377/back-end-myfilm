const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const router = require("./routes/index");
const { engine } = require("express-handlebars");
var bodyParser = require("body-parser");
const db = require("./config/connect");
const app = express();
const port = 8080;

app.use(cors()); // Cho phép tất cả các yêu cầu CORS

app.use(morgan("combined"));
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "resourse", "views"));

//path folder store static file
app.use(express.static(path.join(__dirname, "public")));

//middelware đọc json từ client
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router(app);
db.connect();
app.listen(port, "0.0.0.0", () => {
  console.log(`App listening on port ${port}`);
});
