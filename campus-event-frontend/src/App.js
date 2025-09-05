import React, { useState } from "react";
import EventList from "./components/EventList";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import OrganizerDashboard from "./components/OrganizerDashboard";

function App() {
  const [role, setRole] = useState(localStorage.getItem('role'));

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Campus Event Platform</h1>
      {!role &&
        <div className="row">
          <div className="col-md-6">
            <h4>Login</h4>
            <Login onLogin={setRole} />
          </div>
          <div className="col-md-6">
            <h4>Register</h4>
            <Register />
          </div>
        </div>
      }
      {role &&
        <div>
          <button className="btn btn-outline-secondary mb-3 float-end"
            onClick={() => { localStorage.clear(); setRole(null); }}>
            Logout
          </button>
          <EventList />
          {role === "organizer" && <OrganizerDashboard />}
        </div>
      }
    </div>
  );
}
export default App;
