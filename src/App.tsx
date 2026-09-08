// App.tsx
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import { Route, Routes } from "react-router-dom";

import Dashboard from "./pages/overview/Dashboard";
import Bookings from "./pages/operations/Bookings";
import Customers from "./pages/operations/Customers";
import Membership from "./pages/operations/Membership";
import Packages from "./pages/operations/Packages";
import Therapist from "./pages/operations/Therapist";
import Vouchers from "./pages/marketings/Vouchers";
import Documents from "./pages/analytics/Documents";
import Reports from "./pages/analytics/Reports";
import Banners from "./pages/marketings/Banners";
import Notifications from "./pages/marketings/Notifications";
import User from "./pages/admin/User";
import Settings from "./pages/admin/Settings";

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen w-screen">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto pt-6 bg-body">
        {/* <main className="pt-24 pb-20"> */}
          <Routes>
            {/* 1) Home */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 2) Operataions */}
            <Route path="/customers" element={<Customers />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/therapist" element={<Therapist />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/memberships" element={<Membership />} />

            {/* 3) Marketing */}
            <Route path="/vouchers" element={<Vouchers />} />
            <Route path="/banners" element={<Banners />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* 4) Analytics */}
            <Route path="/reports" element={<Reports />} />
            <Route path="/documents" element={<Documents />} />
            
            {/* 5) Admin */}
            <Route path="/user" element={<User />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div> 
  );
};

export default App;