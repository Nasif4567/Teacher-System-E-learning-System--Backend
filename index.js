require("dotenv").config();

// Import necessary modules
const express = require("express");
const connection = require("./utils/db");
const registerRoute = require("./routes/register");
const courseRoute = require("./routes/course");
const dotenv = require("dotenv");
const loginRoute = require("./routes/login");
const getUser = require("./routes/getUser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const contentRoute = require("./routes/content");
const assestmentRoute = require("./routes/assestment");


// Create an Express application
const app = express();

//sanitizer
app.use(require('sanitize').middleware);

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3001' , 
  credentials: true
}));

// Enable cookie parser
app.use(cookieParser());

//static files
app.use('/content', express.static('./content'));

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the register route
app.use("/register", registerRoute);

// Use the login route
app.use("/login", loginRoute);

// Use the getUser route
app.use("/getUser", getUser);

// Use the course route
app.use("/course", courseRoute);

// Use the content route
app.use("/content", contentRoute);


// Use the assestment route
app.use("/assestment", assestmentRoute);



// Define routes

// Default route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start the server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
