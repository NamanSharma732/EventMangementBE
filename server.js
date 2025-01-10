const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const authRoutes = require("./Routes/authroutes");
const eventRoutes = require("./Routes/eventroutes");
const taskRoutes = require("./Routes/taskroutes");
const attendeeRoutes = require("./Routes/attendeeroutes")

app.use(cors());
app.use(express.json());
app.options("*", cors());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB connection Successful");
  } catch (error) {
    console.error("Error occurred while connecting to DB:", error);
  }
};
connectDB();


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events",eventRoutes);
app.use("/api/v1/task",taskRoutes);
app.use("/api/v1/attendee",attendeeRoutes);


const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});


app.get("/", (req, res) => {
  res.send("Hello World");
});
