"use client"
import { useState } from "react";
import api from "../../api/api";

export default function Register({ setPage }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const register = async () => {
    await api.post("/users/register", form);
    setPage("login");
  };

  return (
    <div className="box">
      <h2>Register</h2>
      <input
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <input
        placeholder="Role"
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      />
      <button onClick={register}>Register</button>
    </div>
  );
}
