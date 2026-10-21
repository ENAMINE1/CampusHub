// Route table: which page component renders for which URL. Layout wraps every page.
import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import Layout from './pages/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import EventDetailsPage from './pages/EventDetailsPage.jsx';
import ClubsPage from './pages/ClubsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import GuestOnly from './routes/GuestOnly.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

// Loaded on demand: most visitors never open these pages, so their code stays out of the first download.
const MyRegistrationsPage = lazy(() => import('./pages/MyRegistrationsPage.jsx'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage.jsx'));
const EventFormPage = lazy(() => import('./pages/dashboard/EventFormPage.jsx'));
const RegistrantsPage = lazy(() => import('./pages/dashboard/RegistrantsPage.jsx'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage.jsx'));

const STAFF = ['clubAdmin', 'admin'];
const staffOnly = (page) => <ProtectedRoute roles={STAFF}>{page}</ProtectedRoute>;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailsPage />} />
        <Route path="clubs" element={<ClubsPage />} />
        <Route
          path="login"
          element={
            <GuestOnly>
              <LoginPage />
            </GuestOnly>
          }
        />
        <Route
          path="register"
          element={
            <GuestOnly>
              <RegisterPage />
            </GuestOnly>
          }
        />
        <Route
          path="me/registrations"
          element={
            <ProtectedRoute roles={['student']}>
              <MyRegistrationsPage />
            </ProtectedRoute>
          }
        />
        <Route path="dashboard" element={staffOnly(<DashboardPage />)} />
        <Route path="dashboard/events/new" element={staffOnly(<EventFormPage />)} />
        <Route path="dashboard/events/:id/edit" element={staffOnly(<EventFormPage />)} />
        <Route
          path="dashboard/events/:id/registrations"
          element={staffOnly(<RegistrantsPage />)}
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
