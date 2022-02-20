const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const { auth } = require("./routers");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Define and attach the routes to the main app.
app.use("/auth", auth);

// define a simple route
app.get("/", (req, res) => {
  res.json({
    message: "Hello from DeltaHack2022 Backend!",
  });
});

// Define port
const port = process.env.PORT || 8080;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
