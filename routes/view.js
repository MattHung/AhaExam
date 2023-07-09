import express from 'express';
import { ViewController } from '../controller/viewController.js';

const router = express.Router();
const viewController = new ViewController();

//the view pages
router.get('/', viewController.home);
router.get('/register', viewController.register);
router.get('/verify', viewController.verify);
router.get('/resetpassword', viewController.resetpassword);
router.get('/changeusername', viewController.changeUserName);

router.get('/auth/facebook', viewController.getFacebookLogin)
router.get('/auth/facebook/callback', viewController.handleFacebookLogin);

router.get('/auth/google', viewController.getGoogleLogin)
router.get('/auth/google/callback', viewController.handleGoogleLogin);

export {router};
