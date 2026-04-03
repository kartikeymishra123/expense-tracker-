require("dotenv").config();
let express = require("express");
const { default: mongoose } = require("mongoose");
let cors = require("cors");
let app = express();
let userRoute = require("./routes/userRoute");
let transactionRoute = require("./routes/transactionRoute");

//connection to database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.error(`there's an error ${err}`));

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

app.use("/user", userRoute);
app.use("/transaction", transactionRoute);

let PORT = process.env.PORT;
app.listen(PORT, () => console.log(`the server is running on ${PORT}`));
