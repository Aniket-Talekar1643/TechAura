"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/projects";

export default function Projects({ setPage, setProjectId }) {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadProjects = async () => {
    const res = await axios.get(API, { withCredentials: true });
    setProjects(res.data.projects);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async () => {
    if (title.trim().length < 20) {
      alert("Title must be at least 20 characters");
      return;
    }

    const res = await axios.post(
      API,
      { title, description },
      { withCredentials: true }
    );

    const newProjectId = res.data.project._id;

   
    setProjectId(newProjectId);
    setPage("tasks");

    setTitle("");
    setDescription("");
  };

  return (
    <div>
      <h2>Projects</h2>

      <input
        placeholder="Project title (20+ chars)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={createProject}>Create Project</button>

      <hr />

      {projects.map((p) => (
        <div key={p._id}>
          {p.title}
          <button
            onClick={() => {
              setProjectId(p._id);
              setPage("tasks");
            }}
          >
            Open Tasks
          </button>
        </div>
      ))}
    </div>
  );
}
