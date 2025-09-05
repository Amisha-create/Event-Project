import React, { useEffect, useState } from "react";
import EventDetails from "./EventDetail";
import axios from "axios";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Fetch all events on mount
    axios.get("/api/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error("Failed to fetch events:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Available Events</h2>
      <div className="row">
        <div className="col-md-5">
          <ul className="list-group">
            {events.length === 0 && <li className="list-group-item">No events available.</li>}
            {events.map(event => (
              <li
                key={event._id}
                className={"list-group-item list-group-item-action" + (selectedEvent && selectedEvent._id === event._id ? " active" : "")}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedEvent(event)}
              >
                {event.title} <br />
                <small>{event.date ? new Date(event.date).toLocaleString() : "Date TBA"}</small>
                <span className="badge bg-info float-end">{event.attendeeCount} Attendees</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-7">
          {selectedEvent ? (
            <EventDetails event={selectedEvent} />
          ) : (
            <div>Select an event to see details</div>
          )}
        </div>
      </div>
    </div>
  );
}
