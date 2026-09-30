import React from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Brain, LayoutDashboard, Search, Package,
         Compass, Link as LinkIcon, FileText, User, LogOut } from "lucide-react";
import Cookies from "js-cookie";

const menuItems = [
  { name: "Dashboard",        path: "/dashboard",  icon: LayoutDashboard },
  { name: "Lost/Found Items", path: "/lostitems",  icon: Search          },
  { name: "Found Items",      path: "/founditems", icon: Package         },
  { name: "Browse Items",     path: "/browseitems",icon: Compass         },
  { name: "My Matches",       path: "/mymatches",  icon: LinkIcon        },
  { name: "My Claims",        path: "/myclaims",   icon: FileText        },
  { name: "Profile",          path: "/profile",    icon: User            },
];

const Sidebar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    // hidden on mobile — Navbar handles mobile navigation
    <aside className="w-64 bg-gradient-to-b from-indigo-700 to-purple-700 text-white hidden md:flex flex-col shadow-lg shrink-0">

      {/* Logo */}
      <div className="p-6 text-2xl font-bold border-b border-white/20 flex items-center gap-2">
        <Brain size={28} />
        <span>Campus L&F</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon   = item.icon;
          const active = isActive(item.path);

          return (
            <Link to={item.path} key={item.path}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition text-sm font-medium ${
                  active
                    ? "bg-white/25 text-white shadow-sm"
                    : "hover:bg-white/15 text-white/80"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/15 text-white/80 transition text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;