import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
 // Route,
 // Link,
} from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import History from "./components/History";
import Leaderboard from "./components/Leaderboard";
import PWC from "./components/PWC";
import PWF from "./components/PWF";
import Hwtp from "./components/Hwtp";

const router = createBrowserRouter([
  {
    path: "/",
    element: (<Home/>),
  },
  {
    path: "/signup",
    element: (<Signup/>),
  },
  {
    path: "/login",
    element: (<Login/>),
  },
  {
    path: "/dashboard",
    element: (<Dashboard/>),
  },
  {
    path: "/history",
    element: (<History/>),
  },
  {
    path: "/pwithc",
    element: (<PWC/>),
  },
  {
    path: "//game/:roomId",
    element: (<PWF/>),
  },
  {
    path: "/leaderboard",
    element: (<Leaderboard/>),
  },
  {
    path: "/hwtp",
    element: (<Hwtp/>),
  },
  
  

]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
