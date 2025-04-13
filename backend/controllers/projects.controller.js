import { validationResult } from "express-validator";
import * as projectService from "../services/project.service.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const createProjectController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;

  const loggedInUser = req.user;
  const userId = await User.findOne({ email: loggedInUser.email }).select(
    "_id"
  );

  try {
    const project = await projectService.createProject(name, userId);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllProjectsController = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userId = loggedInUser.userId;

    const allUserProjects = await projectService.getAllProjectsByUserId(userId);
    res.status(200).json(allUserProjects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProjectByIdController = async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  try {
    const project = await projectService.getProjectById(projectId);
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addUsersToProjectController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { members } = req.body;
  const { projectId } = req.params;

  try {
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return res.status(400).json({ message: "Invalid member IDs" });
    }
    const project = await projectService.addUsersToProject(
      projectId,
      validMembers
    );
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};