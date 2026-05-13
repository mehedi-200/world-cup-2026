const errorHandler = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle known error types
  let message = err.message;

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }
  if (err.name === 'TokenExpiredError') {
    err.statusCode = 401;
    message = 'Token expired. Please log in again.';
  }

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    err.statusCode = 409;
    message = 'Duplicate entry. This record already exists.';
  }

  // MySQL foreign key constraint
  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
    err.statusCode = 400;
    message = 'Cannot perform this action due to related records.';
  }

  // Log server errors
  if (err.statusCode >= 500) {
    console.error('SERVER ERROR:', err.message, err.stack);
  }

  const response = {
    status: err.statusCode < 500 ? 'fail' : 'error',
    message,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.error = err;
    response.stack = err.stack;
  }

  return res.status(err.statusCode).json(response);
};

module.exports = errorHandler;
