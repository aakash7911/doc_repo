const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  let token;

  // 1. Check karo ki header me token hai ya nahi
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token nikalo ("Bearer <token>" se)
      token = req.headers.authorization.split(' ')[1];

      // 2. Token Verify karo
      // NOTE: JWT_SECRET wahi hona chahiye jo aapke Main App me hai
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. User ID request me jod do
      req.user = { _id: decoded.id || decoded._id };

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};