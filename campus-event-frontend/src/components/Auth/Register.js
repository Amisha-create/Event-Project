import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  return (
    <form onSubmit={async e => {
      e.preventDefault();
      try {
        await axios.post('/api/auth/register', form);
        alert('Registration successful. Now login.');
      } catch {
        alert("Registration error");
      }
    }}>
      <div className="mb-2">
        <input className="form-control" name="name" placeholder="Name" onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </div>
      <div className="mb-2">
        <input className="form-control" name="email" placeholder="Email" onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
      </div>
      <div className="mb-2">
        <input className="form-control" name="password" type="password" placeholder="Password" onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
      </div>
      <div className="mb-2">
        <select className="form-select" name="role" onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
          <option value="student">Student</option>
          <option value="organizer">Organizer</option>
        </select>
      </div>
      <button type="submit" className="btn btn-success">Register</button>
    </form>
  );
}
