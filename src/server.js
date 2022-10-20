const express = require("express");
const app = express();

app.get("/super-secure-resource", (req, res) => {
  res
    .status(401)
    .json({ message: "You need to be logged in to access this resource" });
});

app.listen(5000, () => {
  console.log("Server running on localhost:3001");
});