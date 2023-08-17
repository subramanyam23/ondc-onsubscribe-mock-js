const express = require("express");
const onSubscribeDemo = require("./router.js");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use("/option/:id", onSubscribeDemo);

app.listen("3000", async () => {
  console.log("Server starting on PORT 3000");
});
