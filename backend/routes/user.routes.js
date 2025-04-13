import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("username").isLength({ min: 3 }).withMessage("Invalid username"),
    body("password").isLength({ min: 6 }).withMessage("Invalid password"),
  ],
  userController.createUserController
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Invalid password"),
  ],
  userController.loginController
);

router.get("/profile", authMiddleware, userController.profileController);

router.get("/logout", authMiddleware, userController.logoutController);

router.get("/all", authMiddleware, userController.getAllUsersController);

router.post("/auth", authMiddleware, userController.authController);

export default router;
