const ipRequests = new Map();

// Periodically prune expired client logs to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of ipRequests.entries()) {
    if (now > data.resetTime) {
      ipRequests.delete(key);
    }
  }
}, 60000); // Check once per minute

export const rateLimiter = (options = {}) => {
  const {
    windowMs = 60000, // 1 minute default window
    max = 100, // 100 request threshold
    message = 'Too many requests, please try again later.',
    keyPrefix = 'global'
  } = options;

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
    const clientKey = `${keyPrefix}:${ip}`;
    const now = Date.now();

    let clientData = ipRequests.get(clientKey);
    if (!clientData || now > clientData.resetTime) {
      clientData = {
        count: 0,
        resetTime: now + windowMs
      };
      ipRequests.set(clientKey, clientData);
    }

    clientData.count++;

    if (clientData.count > max) {
      return res.status(429).json({
        success: false,
        message
      });
    }

    next();
  };
};

export default rateLimiter;
