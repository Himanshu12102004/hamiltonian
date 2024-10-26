function catchAsync(fn) {
  return function (req, res, next) {
    try {
      fn(req, res, next).catch(next); // Handle async errors
    } catch (err) {
      next(err); // Handle sync errors
    }
  };
}

module.exports = catchAsync;
