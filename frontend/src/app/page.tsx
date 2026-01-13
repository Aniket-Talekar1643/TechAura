"use client";

import { useState } from "react";

import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Projects from "./pages/project/project";
import Tasks from "./pages/task/Task";

export default function App() {
  const [page, setPage] = useState("login");
  const [projectId, setProjectId] = useState(null);

  switch (page) {
    case "login":
      return <Login setPage={setPage} />;

    case "register":
      return <Register setPage={setPage} />;

    case "projects":
      return <Projects setPage={setPage} setProjectId={setProjectId} />;

    case "tasks":
      // 🔥 CRITICAL GUARD
      if (!projectId) {
        return <Projects setPage={setPage} setProjectId={setProjectId} />;
      }
      return <Tasks projectId={projectId} setPage={setPage} />;

    default:
      return <Login setPage={setPage} />;
  }
}
