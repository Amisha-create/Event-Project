import React, { useState } from "react";
import axios from "axios";

export default function EventDetails({ event }) {
  const [message, setMessage] = useState("");

  const handleRegister = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must login first to register.");
      return;
    }
    axios.post(`/api/events/${event._id}/register`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => setMessage("Registered successfully! Await confirmation."))
    .catch(err => {
      setMessage(err.response?.data?.error || "Registration failed.");
    });
  };

  return (
    <div className="card shadow">
      <div className="card-body">
        <h3 className="card-title">{event.title}</h3>
        <p><b>Date:</b> {event.date ? new Date(event.date).toLocaleString() : "Date TBA"}</p>
        <p><b>Location:</b> {event.location || "To be announced"}</p>
        <p>{event.description || "No description provided."}</p>
        <button className="btn btn-primary" onClick={handleRegister}>Register</button>
        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </div>
    </div>
  );
}
