// App.tsx
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import AppRoutes from "./route";
import { useLocation } from "react-router-dom";

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex min-h-screen w-screen">
      {/* Sidebar */}
      {!isLoginPage && (<Sidebar isOpen={sidebarOpen} />)}

      <div className="flex-1 flex flex-col">
        {/* Header */}
        {!isLoginPage && ( <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />)}

        {/* Main page */}
        <main className="flex-1 overflow-y-auto pt-6 bg-tertiary">
          <AppRoutes />
        </main>
      </div>
    </div> 
  );
};

export default App;