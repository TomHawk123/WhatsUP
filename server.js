const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const { authRoutes, userRoutes } = require("./routes");

dotenv.config({ path: "./config/config.env" });

const app = express();

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use(helmet());
app.use(cors());

// Use routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Connect to database
const connectDB = require("./config/db");
connectDB();

// Load and use routes
const controllersPath = "./controllers";
const readdir = require("readdir");

readdir.readSync(controllersPath, ["**.js"]).forEach((controller) => {
    app.use("/cl", require(`${controllersPath}/${controller}`));
});

// Define the run function
async function run() {
    const httpServer = http.createServer(app);

    return httpServer;
}

module.exports = run;
