
//use this to protect routes so that only logged in users can accessa any specified routes
const authenticateUser = (req, res, next) => {
    if (!req.session.userId) {
      return res
        .status(401)
        .json({ message: "You must be logged in to view this page." });
    }
    next();
  };
  
  module.exports = {
    authenticateUser,
  };
  