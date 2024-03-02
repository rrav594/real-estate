import jwt from "jsonwebtoken";

import { errorHandler } from "./error.js";

export default function verifyToken(req, res, next) {
  const token = req.cookies.jwt;
  // console.log(req.cookies);

  if (!token) {
    return next(errorHandler(401, "User not authorized...."));
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(errorHandler(403, "Forbidden."));
    }

    req.user = user;
    next();
  });
}
