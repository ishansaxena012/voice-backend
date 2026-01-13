import { randomUUID } from "crypto";

const requestIdMiddleware = (req, res, next) => {
  const requestId = randomUUID();

  // attach to request object
  req.requestId = requestId;

  // expose in response headers
  res.setHeader("X-Request-Id", requestId);

  next();
};

export default requestIdMiddleware;
