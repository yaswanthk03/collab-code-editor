import React, { useState } from "react";

import { useEffect } from "react";
import axiosInstance from "../config/axios";

const AddUsersToProject = ({ project, setProject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (isModalOpen) {
      axiosInstance
        .get("/users/all")
        .then((response) => {
          const availableUsers = response.data.filter(
            (user) => !project.users.some((member) => member._id === user._id)
          );
          setUsers(availableUsers);
        })
        .catch((error) => console.error("Error fetching users:", error));
    }
  }, [isModalOpen, project.members]);

  const addUserToProject = () => {
    const userIds = selectedUsers.map((user) => user._id);
    axiosInstance
      .put(`/projects/add-users/${project._id}`, { members: userIds })
      .then((res) => {
        console.log(res.data);
        setProject(res.data);
      })
      .catch((error) => console.error("Error adding users to project:", error));
  };

  return (
    <>
      {isModalOpen && (
        <div className="modal w-svw fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Add Collaborators</h2>
            <ul className="user-list max-h-60 overflow-y-auto">
              {users.map((user) => (
                <li
                  key={user.id}
                  onClick={() => {
                    if (
                      selectedUsers.some(
                        (selected) => selected._id === user._id
                      )
                    ) {
                      setSelectedUsers((prevSelected) =>
                        prevSelected.filter(
                          (selected) => selected._id !== user._id
                        )
                      );
                    } else {
                      setSelectedUsers((prevSelected) => [
                        ...prevSelected,
                        user,
                      ]);
                    }
                  }}
                  className={`flex justify-start  p-2 mb-1 rounded-lg hover:cursor-pointer ${
                    selectedUsers.some((selected) => selected._id === user._id)
                      ? "bg-blue-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="avatar h-8 w-8 rounded-full bg-gray-500 mr-2"></div>
                  <span>{user.username}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  addUserToProject();
                }}
                type="submit"
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="membersListInput h-12 bg-gray-200 flex justify-center items-center p-2 shadow-md">
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-2 bg-green-600 flex gap-2 text-white p-2 rounded-lg hover:bg-green-700"
        >
          <p>Add Collaborators </p>
          <i className="ri-user-add-line text-lg"></i>
        </button>
      </div>
    </>
  );
};

export default AddUsersToProject;
