const fs = require("fs");
const mongoose = require("mongoose");
const Item = require("./models/bootcamp");

const db =
  "mongodb+srv://Mujahid:Mujahid_1@cluster0-tbovr.mongodb.net/bootcamp";
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connected now..."))
  .catch((err) => console.log("connection db err", err));

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/data/bootcamps.json`, "utf-8")
);

// import data
const importData = async () => {
  try {
    await Item.create(bootcamps);
    console.log("data import");
    process.exit();
  } catch (err) {
    console.log("not imported");
  }
};
// import data deleted
const importDataDeleted = async () => {
  try {
    await Item.deleteMany();
    console.log("data import delete");
    process.exit();
  } catch (err) {
    console.log("not delete ", err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  importDataDeleted();
}
