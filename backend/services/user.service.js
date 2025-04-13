import userModel from "../models/user.model.js";

export const createUser = async (email, username, password) => {
  if (!email || !username || !password) {
    throw new Error("All fields are required");
  }

  try {
    const hashedPassword = await userModel.hashPassword(password);
    const user = await userModel.create({
      email,
      username,
      password: hashedPassword,
    });

    return user;
  } catch (error) {
    throw new Error(error);
  }
};
