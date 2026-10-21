// Creates an Error object that also carries an HTTP status code (400, 401, 404...).
module.exports = function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
};
