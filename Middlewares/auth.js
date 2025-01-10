const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });

exports.auth = async (req, res, next) => {
  try {
    var token = req.header("Authorization");
    if (!token) {
      return res.status(400).send({
        status: "RS_ERROR",
        message: "Token Not Provided",
      });
    }
    token = token.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error occurred during authentication:", error);

    if (error.name === "TypeError") {
      return res.status(401).json({
        status: "RS_ERROR",
        message: "Unauthorized User",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "RS_ERROR",
        message: "Token has expired",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "RS_ERROR",
        message: "Invalid token",
      });
    } else {
      return res.status(500).json({
        status: "RS_ERROR",
        message: "Internal Server Error",
      });
    }
  }
};
