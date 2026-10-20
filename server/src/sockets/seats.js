// Live seat counts (SPEC.md FR-7.1). Each event has its own Socket.IO "room": a browser showing an
// event joins that room, and after every registration change the server tells only that room.
import { Server } from 'socket.io';
import mongoose from 'mongoose';

let io = null; // stays null in tests that never start a server, so emitting is simply skipped

export function attachSockets(httpServer, clientUrl) {
  io = new Server(httpServer, { cors: { origin: [clientUrl], credentials: true } });

  io.on('connection', (socket) => {
    // The optional callback lets a client wait until it is really in the room.
    socket.on('event:join', (eventId, done) => {
      // Never trust what a client sends: only join rooms named after a real-looking id.
      if (mongoose.isValidObjectId(eventId)) socket.join(`event:${eventId}`);
      if (typeof done === 'function') done();
    });
    socket.on('event:leave', (eventId) => socket.leave(`event:${eventId}`));
  });
  return io;
}

export function emitSeats(eventId, seatsLeft) {
  io?.to(`event:${eventId}`).emit('event:seats', { eventId: String(eventId), seatsLeft });
}
