import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateAccessToken, validateRefreshToken } from '../../../middlewares/auth';

const router = Router();

router.post('/auth/sign-up', AuthController.signUp);
router.post('/auth/login', AuthController.signInWithEmailAndPassword);
router.post('/auth/logout', validateAccessToken, AuthController.signOut);
router.post('/auth/token', validateRefreshToken, AuthController.renewToken);
// router.post('/auth/send-reset-password-email', AuthController.sendResetPasswordEmail);
// router.post('/auth/reset-password', AuthController.resetPassword);
// router.post('/auth/verify-email', AuthController.verifyEmail);
router.post('/auth/send-verification-email', AuthController.sendVerificationEmail);

export { router as authRoutes };
