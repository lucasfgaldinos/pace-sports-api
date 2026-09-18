export const adminMiddleware = (req, res, next) => {
  const userIsAdmin = req.userIsAdmin;

  if (!userIsAdmin) {
    return res.status(401).json({ error: 'This user is not Admin.' });
  }

  return next();
};
