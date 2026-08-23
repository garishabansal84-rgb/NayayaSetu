import express from 'express';
import { 
  verifyAadhaarHandler, 
  signupHandler, 
  loginHandler, 
  verifyPassHandler,
  verifyKeyHandler
} from '../controllers/authController.js';

const router = express.Router();

router.post('/verify-aadhaar', verifyAadhaarHandler);
router.post('/signup', signupHandler);
router.post('/login', loginHandler);
router.post('/verify-key', verifyKeyHandler);
router.get('/verify-pass/:passId', verifyPassHandler);

export default router;
