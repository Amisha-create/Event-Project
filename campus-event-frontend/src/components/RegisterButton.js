import axios from "axios";
import socket from "../utils/websocket";
function register(eventId) {
  axios.post(`/api/events/${eventId}/register`)
    .then(() => { socket.emit("register", { eventId }); });
}
