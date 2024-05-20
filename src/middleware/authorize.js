module.exports = function authorize(roles = []) {
    if (typeof roles === 'ROLE_ADMIN') {
      roles = [roles];
    }
  
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access Denied' });
      }
  
      next();
    };
  };
  