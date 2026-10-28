// header.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import type { User_type } from "../interface/user";

interface HeaderProps {
  onMenuClick?: () => void;
}

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/bookings": "Bookings",
  "/customers": "Customers",
  "/therapist": "Duty Roster",
  "/schedule": "Schedule",
  "/packages": "Treatment",
  "/memberships": "Membership",
  "/vouchers": "Vouchers",
  "/banners": "Banners",
  "/reviews": "Reviews",
  "/notifications": "Notifications",
  "/reports": "Reports",
  "/documents": "Documents",
  "/user": "User Management",
  "/settings": "System Settings",
  "/logout": "Logout",
};

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "";
  const user: User_type = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="w-full h-14 bg-white border-b border-border flex items-center gap-4 px-6 shrink-0">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
        className="text-neutral-800 hover:text-neutral-500 transition-colors"
      >
        <Menu size={20} strokeWidth={2} />
      </button>

      <h1 className="text-lg text-neutral-950 font-extrabold font-serif">{title}</h1>


      <div className="ml-auto flex items-center gap-3 whitespace-nowrap">
          <span className="font-semibold px-3 h-6 bg-tertiary border border-border rounded-xl flex items-center justify-center text-sm capitalize">
            {user?.name || 'Administrator'}
          </span>
          <span className="font-bold w-8 h-8 bg-secondary rounded-full flex items-center justify-center capitalize">
            {user?.name?.charAt(0) || 'S'}
          </span>
      </div>
    </header>
  );
};

export default Header;