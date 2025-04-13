import { Router } from "express";
import * as projectController from "../controllers/projects.controller.js";
import { body } from "express-validator";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  [body("name").isString().withMessage("Invalid project name")],
  projectController.createProjectController
);

router.get("/all", authMiddleware, projectController.getAllProjectsController);

router.get(
  "/:projectId",
  authMiddleware,
  projectController.getProjectByIdController
);

router.put(
  "/add-users/:projectId",
  authMiddleware,
  [
    body("members")
      .isArray({ min: 1 })
      .withMessage("Members must be a non-empty array")
      .bail()
      .custom((members) => members.every((id) => /^[a-fA-F0-9]{24}$/.test(id)))
      .withMessage("Each member must be a valid MongoDB ObjectId"),
  ],
  projectController.addUsersToProjectController
);

export default router;
