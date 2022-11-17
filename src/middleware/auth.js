const jwt = require('jsonwebtoken');
const userService = require('../auth/service');
const { createError } = require('../helpers');

const auth = async (req, _, next) => {
  const authorizationHeader = req.get('Authorization');
  try {
    if (authorizationHeader) {
      const [bearer, token] = authorizationHeader.split(' ');
      if (bearer !== 'Bearer') {
        next(createError(401, 'Not authorized'));
      }

      const { id } = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await userService.getUserById(id);
      if (!user || !user.token) {
        next(createError(401, 'Not authorized'));
      }
      req.user = user;
      next();
    } else {
      next(createError(400, 'Missing authentication token'));
    }
  } catch (error) {
    next(createError(401, error.message));
  }
};

module.exports = auth;
