import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minLength: [3, "Project name must be at least 3 characters long"],
    maxLength: [50, "Project name must not be longer than 50 characters"],
    required: [true, "Project name is required"],
    unique: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("project", projectSchema);

export default Project;
