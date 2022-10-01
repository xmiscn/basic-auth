const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode < 400 ? 500 : res.statusCode;

  // console.log('Error middleware: ', err.message);

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: err.stack,
  });
};

module.exports = { errorHandler };
