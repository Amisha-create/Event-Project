import React, { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form onSubmit={async e => {
      e.preventDefault();
      try {
        const res = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('userId', res.data.userId);
        onLogin(res.data.role);
      } catch {
        alert("Login failed");
      }
    }}>
      <div className="mb-3">
        <input className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="mb-3">
        <input className="form-control" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-primary">Login</button>
    </form>
  );
}
