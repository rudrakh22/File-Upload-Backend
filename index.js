const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const fileUpload=require('express-fileupload');

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir: "/tmp/",
}))

const db = require("./Config/database");
db.connect();

const cloudinary = require("./Config/cloudinary");
cloudinary.cloudinaryConnect();

const Upload = require("./Router/FileUpload");

app.use("/api/v1/upload", Upload);

app.listen(PORT, () => {
  console.log("App running on port ", PORT);
});

app.get("/", (req, res) => {
  res.send(`<h1>This is homePage</h1>`);
});
