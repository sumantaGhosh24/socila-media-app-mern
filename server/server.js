require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");

const connectDB = require("./lib/connectDb");
const corsOptions = require("./lib/corsOptions");

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(express.json({limit: "50mb"}));
app.use(
  express.urlencoded({extended: true, limit: "50mb", parameterLimit: 50000})
);
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api", require("./routes/authRouter"));
app.use("/api", require("./routes/userRouter"));
app.use("/api", require("./routes/postRouter"));
app.use("/api", require("./routes/commentRouter"));
app.use("/api", require("./routes/notifyRouter"));
app.use("/api", require("./routes/messageRouter"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
