const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use("/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});