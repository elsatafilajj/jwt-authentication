const checkRole = (role, action) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Assuming role is added to req.user via JWT
    const permissions = UserRoles[userRole].can;

    if (permissions.includes(action)) {
      next(); // User has permission, proceed
    } else {
      res.status(403).json({ message: "Access Denied" });
    }
  };
};

module.exports = checkRole;
