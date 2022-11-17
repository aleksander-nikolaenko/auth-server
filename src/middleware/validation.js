const { createError } = require('../helpers');

const validation =
  (schema, reqPart = 'body') =>
  (req, res, next) => {
    const { error } = schema.validate(req[reqPart]);
    if (error) {
      next(createError(400, error.message));
      return;
    }
    next();
  };

module.exports = validation;
