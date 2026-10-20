// Live seats-left for one event over Socket.IO (SPEC.md FR-7.1).
// Fallback: until (or unless) a live message arrives, it returns the number fetched from the API,
// so the page works fine even if WebSockets are blocked.
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Unset in development: connect to the page's own origin, which Vite proxies to the API.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default function useSocketSeats(eventId, fetchedSeatsLeft) {
  const [live, setLive] = useState({ eventId: null, seatsLeft: null });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = SOCKET_URL ? io(SOCKET_URL) : io();
    // Join on every (re)connect: after a dropped connection the server has forgotten our room.
    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('event:join', eventId);
    });
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('event:seats', (message) => {
      if (message.eventId === eventId) setLive({ eventId, seatsLeft: message.seatsLeft });
    });
    // Cleanup: leave the room and close the connection when the page goes away.
    return () => socket.disconnect();
  }, [eventId]);

  const seatsLeft = live.eventId === eventId ? live.seatsLeft : fetchedSeatsLeft;
  return { seatsLeft, isConnected };
}
