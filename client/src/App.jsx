// Route table: which page component renders for which URL.
// Signed-out visitors only ever reach /login and /register (AuthLayout); every other page sits
// inside the signed-in Layout behind ProtectedRoute.
import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import Layout from './pages/Layout.jsx';
import AuthLayout from './pages/AuthLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import EventDetailsPage from './pages/EventDetailsPage.jsx';
import ClubsPage from './pages/ClubsPage.jsx';
import ClubDetailPage from './pages/ClubDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import GuestOnly from './routes/GuestOnly.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

// Loaded on demand: most visitors never open these pages, so their code stays out of the first download.
const FavoritesPage = lazy(() => import('./pages/FavoritesPage.jsx'));
const MyRegistrationsPage = lazy(() => import('./pages/MyRegistrationsPage.jsx'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage.jsx'));
const EventFormPage = lazy(() => import('./pages/dashboard/EventFormPage.jsx'));
const RegistrantsPage = lazy(() => import('./pages/dashboard/RegistrantsPage.jsx'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage.jsx'));

const STAFF = ['clubAdmin', 'admin'];
const only = (roles, page) => <ProtectedRoute roles={roles}>{page}</ProtectedRoute>;

export default function App() {
  return (
    <Routes>
      <Route
        element={
          <GuestOnly>
            <AuthLayout />
          </GuestOnly>
        }
      >
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailsPage />} />
        <Route path="clubs" element={<ClubsPage />} />
        <Route path="clubs/:slug" element={<ClubDetailPage />} />
        <Route
          path="me/registrations"
          element={only(['student'], <MyRegistrationsPage />)}
        />
        <Route path="me/favorites" element={only(['student'], <FavoritesPage />)} />
        <Route path="dashboard" element={only(STAFF, <DashboardPage />)} />
        <Route path="dashboard/events/new" element={only(STAFF, <EventFormPage />)} />
        <Route
          path="dashboard/events/:id/edit"
          element={only(STAFF, <EventFormPage />)}
        />
        <Route
          path="dashboard/events/:id/registrations"
          element={only(STAFF, <RegistrantsPage />)}
        />
        <Route path="admin" element={only(['admin'], <AdminPage />)} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
