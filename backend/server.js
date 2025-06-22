const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
const PORT = process.env.MYSQLPORT || 5001;
dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://nlfindyourseat.netlify.app/"],
  })
);
4;
//routes
app.use("/api/guests", require("./routes/seatingRoute"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
