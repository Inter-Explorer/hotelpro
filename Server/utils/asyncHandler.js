// Express 4 does not catch errors thrown inside async functions.
// This wrapper catches them and passes them to our central error handler.
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
