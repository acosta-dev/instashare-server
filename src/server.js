const express = require("express");
require("dotenv").config();
require("./config/db").connect();
const authRoutes = require("./routes/auth.routes");
const filesRoutes = require("./routes/files.routes");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/files", filesRoutes);

app.listen(process.env.SERVER_PORT | 5000, () => {
  console.log(`Server running on localhost:${process.env.SERVER_PORT}`);
});
