import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from "./pages/overview/Dashboard";

import Bookings from "./pages/operations/Bookings";
import Customers from "./pages/operations/Customers";
import Membership from "./pages/operations/Membership";
import Packages from "./pages/operations/Packages";
import Therapist from "./pages/operations/Therapist";
import Schedule from "./pages/operations/Schedule";

import Vouchers from "./pages/marketings/Vouchers";
import Banners from "./pages/marketings/Banners";
import Notifications from "./pages/marketings/Notifications";

import Reports from "./pages/analytics/Reports";

import User from "./pages/admin/User";
import Settings from "./pages/admin/Settings";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1) Home */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 2) Operations */}
      <Route path="/customers" element={<Customers />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/therapist" element={<Therapist />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/memberships" element={<Membership />} />

      {/* 3) Marketing */}
      <Route path="/vouchers" element={<Vouchers />} />
      <Route path="/banners" element={<Banners />} />
      <Route path="/notifications" element={<Notifications />} />

      {/* 4) Analytics */}
      <Route path="/reports" element={<Reports />} />

      {/* 5) Admin */}
      <Route path="/user" element={<User />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default AppRoutes;