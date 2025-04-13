import React, { useEffect, useState } from "react";
import { useUser } from "../context/user.context";
import axiosInstance from "../config/axios";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useUser();
  console.log("user", user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/projects/all")
      .then((res) => {
        console.log(res.data);
        setProjects(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const createProject = () => {
    axiosInstance
      .post("/projects/create", { name: projectName })
      .then((res) => {
        console.log(res.data);
        setProjects([...projects, res.data]);
        setProjectName("");
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!user) {
    return (
      <div>
        You are not logged in login{" "}
        <Link to="/login" className="text-indigo-500 hover:underline">
          here
        </Link>
      </div>
    );
  }
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Projects</h1>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-add-line mr-2"></i> New Project
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <Link
                to={`/project`}
                className="flex flex-col gap-2"
                state={project}
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {project.name}
                </h2>
                <div className="flex items-center text-gray-600 text-sm">
                  <i className="ri-group-line mr-2"></i>
                  <p>Collaborators: {project.users.length}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create New Project
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createProject();
              }}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="projectName"
                >
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
