const User = require('../models/User');

/* gets user role from token
 */

const getRole = (req, res, next) => {
  if (req.userId) {
    User.findById(req.userId, (err, user) => {
      if (user) {
        req.userRole = user.role;
        next();
      }
    });
  } else {
    next();
  }
};

module.exports = getRole;
