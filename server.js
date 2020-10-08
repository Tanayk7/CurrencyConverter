// Imports
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const axios = require("axios");
//Utils
const convertToJson = require("./Utils/csvToJson.js");
const sendMail = require("./Utils/mailer.js");

// Constants
const USD_ENDPOINT =
  "https://v6.exchangerate-api.com/v6/b7a212f360315bd9a05e699a/latest/USD";
const PORT = 5000;

// Init app
const app = express();
let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./Uploads");
  },
  filename: (req, file, callback) => {
    callback(null, file.fieldname + "_" + file.originalname);
  },
});
let upload = multer({
  storage: storage,
}).array("fileUpload", 3);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.post("/getConverted", (req, res) => {
  upload(req, res, (err) => {
    if (err) console.log(err);
    console.log(req.files);
    let ext = req.files[0].filename.split(".")[1];
    if (ext !== "csv") {
      res.send("Please upload valid file type");
      return;
    }
    let filename = "./Uploads/" + req.files[0].filename;
    let data = fs.readFile(filename, "utf8", async function (err, data) {
      if (err) console.log(err);
      else {
        let json_data = convertToJson(data);
        let prices = json_data.prices;
        let rates = await axios.get(USD_ENDPOINT);
        let last_update_time = rates.data.time_last_update_utc;
        let inr_rate = rates.data.conversion_rates.INR;
        let converted = {
          prices: [],
          conversion_rate: inr_rate,
          update_time: last_update_time,
        };
        prices.forEach((price) => {
          let converted_price = price * inr_rate;
          converted_price = converted_price.toFixed(2);
          converted.prices.push({
            original: price,
            converted: converted_price,
          });
        });
        res.send(converted);
      }
    });
  });
});

app.post("/emailResults", (req, res) => {
  let email = req.body.email;
  let results = req.body.results;
  console.log(results);

  let rows = "";
  results.prices.forEach((price) => {
    rows += `<tr> 
                <td>${price.original}</td>
                <td>${price.converted}</td>  
             </tr>`;
  });
  let html = `<table border='1' style='padding:10px;background:#48376e;border:1px solid #755fa3;color:white;'>
                <thead style='padding:5px;'>
                  <tr> 
                    <th>Price In INR</th>
                    <th>Price In USD</th> 
                  </tr> 
                </thead> 
                <tbody tyle='padding:5px;'> 
                  ${rows}
                </tbody> 
             </table>`;

  sendMail(res, {
    from: "Currency Converter",
    to: email,
    subject: "Currency conversion results",
    html: html,
  });
});

app.get("/test", (req, res) => {
  let data = `a
                1
                8`;
  let json_data = convertToJson(data);
  console.log("JSON data is: ", json_data);
  res.send("Welcome to the home route");
});

// Connections
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
