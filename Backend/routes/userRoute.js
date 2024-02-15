import { forgotpassotp } from '../controller/checkotpForgotpassController.js';
import { checkotppay } from '../controller/checkotpPayController.js';
import { deleteall } from '../controller/deleteController.js';
import { login } from '../controller/signincontroller.js';
import { signup } from '../controller/signupController.js';
import { updatepass } from '../controller/updatepassController.js';
import { validateemail } from '../controller/validateemailController.js';
import { validatetoken } from '../controller/validatetokenController.js';
import { verifyemail } from '../controller/verifyemailController.js';
import express from 'express';

const router = express.Router();
router.post("/postdata",signup);
router.post("/auntheticatelogin",login);
router.post("/deleteallusers",deleteall);
router.post("/updatepass",updatepass);
router.post("/checkotp",forgotpassotp);
router.post("/validateemail",validateemail);
router.post("/checktop",checkotppay);
router.post("/verifyemail",verifyemail);
router.post("/validateToken",validatetoken);

export default router;
