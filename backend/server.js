const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require ("./data");

const API_Port = 3001;
const app = express();
const router = express.Router();

// mongoDB database 
const dbRoute = "mongodb://Superunknown1103:Bruce1103@ds213183.mlab.com:13183/fashion-app";
// mongodb://jelo:a9bc839993@ds151382.mlab.com:51382/jelotest

mongoose.connect(
    dbRoute,
    {useNewUrlParser: true}
);

let db = mongoose.connection;

// successful mongo connection
db.once("open", console.error.bind(console, "MongoDB connection error:"));

// error connecting to db
db.on("error", console.error.bind(console, "MongoDB connection error:");

// logging
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// get method
// this method facilitates all available data in database
router.get("/getData", (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data});
    });
});

// update method
// method overwrites existing data in our database
router.post("/updateData", (req, res) => {
    const { id, update } = req.body;
    Data.findOneAndUpdate(id, update, err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

// delete method
// this method removes existing data in database
router.delete("/deleteData", (req, res) => {
    const { id } = req.body;
    Data.findOneAndDelete(id, err => {
        if (err) return res.send(err);
        return res.json({ success: true });
    });
});

// this is our create method
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));


