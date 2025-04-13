import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../config/axios";

// Create a context for the user
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    //console.log("UserProvider useEffect");
    const token = localStorage.getItem("token");
    if (token) {
      axiosInstance
        .post(
          "/users/auth",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          //console.log("UserProvider useEffect res", res.data.user);
          setUser(res.data.user);
        })
        .catch((error) => {
          console.error(error);
          localStorage.removeItem("token");
        });
    }
    //console.log("user", token);
  }, []);

  useEffect(() => {
    if (user) {
      //console.log("UserProvider useEffect user", user);
      const newSocket = new WebSocket("ws://localhost:3000", [
        "Sec-WebSocket-Protocol",
        localStorage.getItem("token"),
      ]);
      newSocket.onopen = () => {
        console.log("WebSocket connection opened");
      };
      newSocket.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
      };
      newSocket.onclose = () => {
        console.log("WebSocket connection closed");
      };
      setSocket(newSocket);
    }
  }, [user]);
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
