import jwt from "jsonwebtoken";
import redis from "../services/redis.service.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ errors: "Unauthorized" });
    }

    const isLoggedOut = await redis.get(token);

    if (isLoggedOut) {
      return res.status(401).json({ errors: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ errors: error.message });
  }
};

export const authMiddlewareForWebSocket = async (request) => {
  const token =
    request.headers?.["sec-websocket-protocol"]
      ?.split(",")
      .map((item) => item.trim())[1] ?? null;
  console.log("token", request.headers);
  if (!token) {
    throw new Error("Unauthorized");
  }

  const isLoggedOut = await redis.get(token);

  if (isLoggedOut) {
    throw new Error("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
  } catch (error) {
    throw new Error(error.message);
  }
};