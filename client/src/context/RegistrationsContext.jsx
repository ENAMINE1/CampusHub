// Shares the registrations list and its dispatch function. useReducer keeps every change in one place.
import { createContext, useContext, useReducer } from 'react';
import {
  initialRegistrations,
  registrationsReducer,
} from '../features/registrations/registrationsReducer.js';

const RegistrationsContext = createContext(null);

export function RegistrationsProvider({ children }) {
  const [registrations, dispatch] = useReducer(
    registrationsReducer,
    initialRegistrations,
  );

  function isRegistered(eventId) {
    return registrations.some((r) => r.eventId === eventId && r.status === 'registered');
  }

  return (
    <RegistrationsContext value={{ registrations, dispatch, isRegistered }}>
      {children}
    </RegistrationsContext>
  );
}

export function useRegistrations() {
  return useContext(RegistrationsContext);
}
