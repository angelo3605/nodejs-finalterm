import { refreshService, registerService } from '../services/authService.js';
import { passport, issueTokens } from '../utils/passport.js';

export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    const user = await registerService(email, password, fullName);
    return issueTokens(res, user.id);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || 'Registration failed' });
  }
};

export const login = (req, res, next) => {
  return passport.authenticate(
    'local',
    { session: false },
    (err, user, info) => {
      if (err || !user) {
        return res.status(400).json(info || { message: 'Login failed' });
      }
      return issueTokens(res, user.id);
    }
  )(req, res, next);
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const user = await refreshService(refreshToken);
    return issueTokens(res, user.id);
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Not logged in' });
  }
};
