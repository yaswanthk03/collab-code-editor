import projectModel from "../models/projects.model.js";

export const createProject = async (name, userId) => {
  if (!name) {
    throw new Error("Project name is required");
  }
  if (!userId) {
    throw new Error("UserId is required");
  }

  try {
    const project = await projectModel.create({
      name,
      users: [userId],
    });

    return project;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllProjectsByUserId = async (userId) => {
  if (!userId) {
    throw new Error("UserId is required");
  }

  try {
    const allUserProjects = await projectModel.find({ users: userId });
    return allUserProjects;
  } catch (error) {
    throw new Error(error);
  }
};

export const getProjectById = async (projectId) => {
  if (!projectId) {
    throw new Error("ProjectId is required");
  }

  try {
    const project = await projectModel.findById(projectId).populate("users");
    return project;
  } catch (error) {
    throw new Error(error);
  }
};

export const addUsersToProject = async (projectId, members) => {
  if (!projectId) {
    throw new Error("ProjectId is required");
  }
  if (!members) {
    throw new Error("Members are required");
  }

  try {
    const project = await projectModel
      .findByIdAndUpdate(
        projectId,
        { $addToSet: { users: { $each: members } } },
        { new: true }
      )
      .populate("users");

    return project;
  } catch (error) {
    throw new Error(error);
  }
};