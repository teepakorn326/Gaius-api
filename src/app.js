// const { sequelize } = require("./models");
// sequelize.sync({ alter: "true" });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const roomRoute = require("./routes/roomRoute");
const authRoute = require("./routes/authRoute");
const listRoute = require("./routes/listRoute");

const error = require("./middleware/error");
const notFound = require("./middleware/notFound");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRoute);
app.use("/room", roomRoute);
app.use("/mylist", listRoute);
app.use("/result", listRoute);

app.use(error);
app.use(notFound);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server running on port : ${port}`));
