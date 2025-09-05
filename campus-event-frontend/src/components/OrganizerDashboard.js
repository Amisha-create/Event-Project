import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [message, setMessage] = useState("");
  const [newEvent, setNewEvent] = useState({ title: "", description: "", date: "", location: "" });

  const token = localStorage.getItem("token");

  // Fetch events by organizer
  useEffect(() => {
    axios.get("/api/events", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]));
  }, [token]);

  // Fetch registrations when event selected
  useEffect(() => {
    if (!selectedEventId) return;
    axios.get("/api/events/registrations", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const regsForEvent = res.data.filter(reg => reg.event._id === selectedEventId);
        setRegistrations(regsForEvent);
      })
      .catch(() => setRegistrations([]));
  }, [selectedEventId, token]);

  // Handle approve/reject
  const handleAction = (regId, status) => {
    axios.post(`/api/events/registrations/${regId}`, { status }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setMessage(`Registration ${status}`);
        setRegistrations(regs => regs.map(r => (r._id === res.data._id ? res.data : r)));
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => setMessage("Failed to update registration"));
  };

  // Handle form change
  const handleNewEventChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Submit new event
  const handleAddEvent = (e) => {
    e.preventDefault();
    axios.post("/api/events", newEvent, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setEvents([res.data, ...events]);
        setMessage("Event created successfully!");
        setNewEvent({ title: "", description: "", date: "", location: "" });
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(err => {
        setMessage(err.response?.data?.error || "Failed to create event");
        setTimeout(() => setMessage(""), 4000);
      });
  };

  return (
    <div className="container mt-4">
      <h2>Organizer Dashboard</h2>

      {/* Add Event Form */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5>Create New Event</h5>
        <form onSubmit={handleAddEvent}>
          <div className="mb-2">
            <input
              name="title"
              placeholder="Event Title"
              type="text"
              className="form-control"
              value={newEvent.title}
              onChange={handleNewEventChange}
              required
            />
          </div>
          <div className="mb-2">
            <textarea
              name="description"
              placeholder="Description"
              className="form-control"
              value={newEvent.description}
              onChange={handleNewEventChange}
            />
          </div>
          <div className="mb-2">
            <input
              name="date"
              type="datetime-local"
              className="form-control"
              value={newEvent.date}
              onChange={handleNewEventChange}
              required
            />
          </div>
          <div className="mb-2">
            <input
              name="location"
              placeholder="Location"
              className="form-control"
              value={newEvent.location}
              onChange={handleNewEventChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Event</button>
        </form>
      </div>

      {/* Messages */}
      {message && <div className="alert alert-info">{message}</div>}

      {/* Events and Registrations */}
      <div className="row">
        <div className="col-md-4">
          <h5>Your Events</h5>
          <ul className="list-group">
            {events.length === 0 && <li className="list-group-item">No events found.</li>}
            {events.map(event => (
              <li
                key={event._id}
                className={"list-group-item list-group-item-action" + (selectedEventId === event._id ? " active" : "")}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedEventId(event._id)}
              >
                {event.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-8">
          <h5>Participant Registrations</h5>
          {!selectedEventId && <p>Select an event to view registrations.</p>}
          {selectedEventId && registrations.length === 0 && <p>No registrations yet.</p>}
          {selectedEventId && registrations.length > 0 && (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map(reg => (
                  <tr key={reg._id}>
                    <td>{reg.user.name}</td>
                    <td>{reg.status}</td>
                    <td>
                      {reg.status === "pending" ? (
                        <>
                          <button className="btn btn-success btn-sm me-2" onClick={() => handleAction(reg._id, "approved")}>Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleAction(reg._id, "rejected")}>Reject</button>
                        </>
                      ) : (
                        <em>No actions available</em>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
