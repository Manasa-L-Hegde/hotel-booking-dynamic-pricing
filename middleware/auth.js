import jwt from 'jsonwebtoken';

// =============================================================================
// AUTH MIDDLEWARE — STUB
// =============================================================================
// TODO (Auth teammate): Replace this stub with your real JWT verification.
//       This currently uses JWT_SECRET from .env to decode tokens.
//       The token payload is expected to have: { id, email, role }
//       Generate a test token with:
//         node -e "import('jsonwebtoken').then(j=>console.log(j.default.sign({id:'admin1',email:'admin@test.com',role:'admin'},process.env.JWT_SECRET||'changeme_dev_secret',{expiresIn:'1d'})))"
// =============================================================================

/**
 * Verifies the JWT from the Authorization header and attaches decoded
 * user data to req.user.
 *
 * Expected header: Authorization: Bearer <token>
 * Expected payload: { id, email, role }
 */
export const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

/**
 * Must be used AFTER isAuthenticated.
 * Checks that the authenticated user has role === 'admin'.
 */
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
  next();
};
