
import React, { useState } from "react";
import EventList from "./components/EventList";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import OrganizerDashboard from "./components/OrganizerDashboard";

function App() {
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [showRegister, setShowRegister] = useState(false);

  // Use a special background only for login/register
  const bgStyle = !role ? {
    minHeight: '100vh',
    background: "url('https://whataftercollege.com/wp-content/uploads/2019/03/Cover-image-10-scaled.jpg') no-repeat center center fixed",
    backgroundSize: 'cover',
    position: 'relative',
  } : {};

  return (
    <div className={"app-bg"} style={bgStyle}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold fs-3">Campus Event Platform</span>
          <div className="d-flex">
            {!role && (
              <button className="btn btn-success me-2" onClick={() => setShowRegister(true)}>
                Register
              </button>
            )}
            {role && (
              <button className="btn btn-outline-light" onClick={() => { localStorage.clear(); setRole(null); }}>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
        {!role && (
          <div className="card p-4 shadow-lg mt-5" style={{ minWidth: 350, maxWidth: 400, width: '100%' }}>
            <h3 className="mb-4 text-center text-primary">Login</h3>
            <Login onLogin={setRole} />
            <div className="text-center mt-3">
              <span>Don't have an account? </span>
              <button className="btn btn-link p-0 align-baseline" style={{ color: '#198754' }} onClick={() => setShowRegister(true)}>
                Register here
              </button>
            </div>
          </div>
        )}

        {/* Register Modal */}
        {showRegister && !role && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Register</h5>
                  <button type="button" className="btn-close" onClick={() => setShowRegister(false)}></button>
                </div>
                <div className="modal-body">
                  <Register />
                </div>
              </div>
            </div>
          </div>
        )}

        {role && (
          <div className="w-100 mt-5">
            <EventList />
            {role === "organizer" && <OrganizerDashboard />}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
