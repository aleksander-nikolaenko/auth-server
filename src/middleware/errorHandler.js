const errorHandler = (err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  console.log(err.stack);
  res.status(status).json({ message });
};

module.exports = errorHandler;
