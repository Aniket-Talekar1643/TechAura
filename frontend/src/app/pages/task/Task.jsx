"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function Tasks({ projectId, setPage }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");


  useEffect(() => {
    if (!projectId) return;

    axios
      .get(`${API}/projects/${projectId}/tasks`, {
        withCredentials: true,
      })
      .then((res) => setTasks(res.data.tasks))
      .catch(() => alert("Failed to load tasks"));
  }, [projectId]);

  const createTask = async () => {
    if (!title.trim()) return;

    await axios.post(
      `${API}/projects/${projectId}/tasks`,
      { title },
      { withCredentials: true }
    );

    setTitle("");
    const res = await axios.get(`${API}/projects/${projectId}/tasks`, {
      withCredentials: true,
    });
    setTasks(res.data.tasks);
  };

  if (!projectId) {
    return <div>Loading project...</div>;
  }

  return (
    <div>
      <h2>Tasks</h2>

      <button onClick={() => setPage("projects")}>⬅ Back</button>

      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={createTask}>Add Task</button>

      <hr />

      {tasks.map((t) => (
        <div key={t._id}>{t.title}</div>
      ))}
    </div>
  );
}
