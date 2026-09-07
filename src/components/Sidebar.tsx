// sidebar.tsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, CalendarDays, User, Disc, Ticket, Image as ImageIcon, Bell, BarChart3, Astroid, Diamond, FileText, Settings, Wrench, CornerDownLeft } from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: <LayoutGrid size={18} /> },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { label: "Bookings",              path: "/bookings",    icon: <CalendarDays size={18} className="text-sky-400" /> },
      { label: "Customers",             path: "/customers",   icon: <User size={18} className="text-purple-300" /> },
      { label: "Therapists & Roster",   path: "/therapist",   icon: <Astroid size={18} className="text-white"/> },
      { label: "Packages",              path: "/packages",    icon: <Diamond size={18} /> },
      { label: "Membership",            path: "/memberships", icon: <Disc size={18} /> },
    ],
  },
  {
    title: "MARKETING",
    items: [
      { label: "Vouchers",      path: "/vouchers",      icon: <Ticket size={18} /> },
      { label: "Banners",       path: "/banners",       icon: <ImageIcon size={18} /> },
      { label: "Notifications", path: "/notifications", icon: <Bell size={18} className="text-amber-400" /> },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      { label: "Reports", path: "/reports", icon: <BarChart3 size={18} className="text-emerald-400" /> },
      { label: "Documents", path: "/documents", icon: <FileText size={18} /> },
    ],
  },
  {
    title: "ADMIN",
    items: [
      { label: "User Management", path: "/user", icon: <Settings size={18} /> },
      { label: "System Settings", path: "/setting", icon: <Wrench size={18} /> },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // for logout only
  const logoutItem: NavItem = { label: "Sign Out", path: "/logout", icon: <CornerDownLeft size={18} /> };
  const logoutActive = location.pathname === logoutItem.path;

  return (
    <aside
      className={`${
        isOpen ? "w-56" : "w-16"
      } bg-primary flex flex-col shrink-0 transition-all duration-200`}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-3 justify-center">
        <div
          className={`${
            isOpen ? "w-18 h-10 bg-tertiary rounded-2xl" : "w-8 h-8 bg-secondary rounded-full"
          } flex items-center justify-center overflow-hidden transition-all duration-200`}
        >
          {isOpen ? (
            <span className="text-[9px] text-center leading-tight text-neutral-500 font-serif px-4">
              Serenity Spa
            </span>
          ) : (
            <span className="text-[14px] text-center leading-tight text-black font-bold">
              S
            </span>
          )}
        </div>
      </div>

      {/* Border */}
      <div className="border-t-2 border-highlighted" />

      {/* Nav */}
      <nav className="flex-1 py-5 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            {/* title - hidden when collapsed */}
            {isOpen && (
              <p className="px-4 mb-2 text-[9px] font-bold tracking-wider text-white/35">
                {section.title}
              </p>
            )}
            {/* route */}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = location.pathname === item.path;
                
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      title={!isOpen ? item.label : undefined}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 py-2.5 text-sm transition-colors relative ${
                        isOpen ? "justify-start pl-4 pr-3" : "justify-center px-1"
                      } ${
                        active
                          ? "bg-highlighted text-white font-semibold"
                          : "text-white/60 hover:text-white/90 hover:bg-white/5"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-0 h-full w-[3px] bg-amber-400 rounded-r" />
                      )}
                      <span className="shrink-0 text-white/70">{item.icon}</span>
                      {isOpen && <span className="font-semibold">{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Border */}
      <div className="border-t-2 border-highlighted" />
      
      {/* Logout */}  {/* Logout - pinned to bottom via mt-auto on the flex-col aside */}
      <div className="mt-auto py-3">
        <button
          type="button"
          title={!isOpen ? logoutItem.label : undefined}
          onClick={() => navigate(logoutItem.path)}
          className={`w-full flex items-center gap-3 py-2.5 text-sm transition-colors relative ${
            isOpen ? "justify-start pl-4 pr-3" : "justify-center px-1"
          } ${
            logoutActive
              ? "bg-highlightedd text-white font-semibold"
              : "text-white/60 hover:text-white/90 hover:bg-white/5"
          }`}
        >
          {logoutActive && (
            <span className="absolute left-0 top-0 h-full w-[3px] bg-amber-400 rounded-r" />
          )}
          <span className="shrink-0 text-white/70">{logoutItem.icon}</span>
          {isOpen && <span className="font-bold">{logoutItem.label}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;