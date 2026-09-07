// header.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/bookings": "Bookings",
  "/customers": "Customers",
  "/therapist": "Therapists & Roster",
  "/packages": "Packages",
  "/memberships": "Membership",
  "/vouchers": "Vouchers",
  "/banners": "Banners",
  "/notifications": "Notifications",
  "/reports": "Reports",
  "/documents": "Documents",
  "/user": "User Management",
  "/setting": "System Settings",
  "/logout": "Logout",
};

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "";

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

      <h1 className="text-lg text-neutral-950 font-medium font-serif">{title}</h1>
    </header>
  );
};

export default Header;