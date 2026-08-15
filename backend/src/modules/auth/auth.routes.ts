import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '@middleware/validate';
import { authenticate } from '@middleware/authenticate';
import { authRateLimiter } from '@middleware/rateLimiter';
import { loginSchema, changePasswordSchema } from './auth.validation';

const router = Router();

router.post('/login', authRateLimiter, validate({ body: loginSchema }), authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);

// Deliberately NOT gated by requirePasswordChangeComplete —
// this is how the forced-change state gets cleared.
router.post(
  '/change-password',
  authenticate,
  validate({ body: changePasswordSchema }),
  authController.changePassword
);

export default router;