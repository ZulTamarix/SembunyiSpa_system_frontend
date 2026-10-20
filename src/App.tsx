// App.tsx
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import AppRoutes from "./route";

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen w-screen">
      <Sidebar isOpen={sidebarOpen} />

      {/* <div className="flex-1 flex flex-col min-w-0"> */}
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto pt-6 bg-tertiary">
        {/* <main className="pt-24 pb-20 bg-tertiary"> */}
          <AppRoutes />
        </main>
      </div>
    </div> 
  );
};

export default App;