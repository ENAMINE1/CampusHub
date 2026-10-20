// TEACHING ONLY: not imported by the app. The same registrations logic as
// features/registrations/registrationsReducer.js, written as a Redux Toolkit slice so the two can be compared side by side.
//
// Differences to point out:
// - createSlice generates the action creators (registered, cancelled) for you.
// - Inside a slice you may "mutate" state: Immer turns those changes into a new immutable copy.
// - A Redux store lives outside React and is shared app-wide; useReducer state lives in one component tree.
import { createSlice, configureStore } from '@reduxjs/toolkit';

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: [],
  reducers: {
    registered(state, action) {
      const event = action.payload;
      const existing = state.find((r) => r.eventId === event.id);
      if (existing) {
        existing.status = 'registered';
      } else {
        const { id, title, startsAt, venue } = event;
        state.push({ eventId: id, title, startsAt, venue, status: 'registered' });
      }
    },
    cancelled(state, action) {
      const existing = state.find((r) => r.eventId === action.payload);
      if (existing) existing.status = 'cancelled';
    },
  },
});

export const { registered, cancelled } = registrationsSlice.actions;

// A store you could pass to react-redux's <Provider>. Try it in the console:
// store.dispatch(registered({ id: 'evt-101', title: 'Git', startsAt: '...', venue: 'Lab 2' }))
export const store = configureStore({
  reducer: { registrations: registrationsSlice.reducer },
});
