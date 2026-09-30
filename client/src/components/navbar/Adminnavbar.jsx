import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Settings, Menu, X, LayoutDashboard, Search,
         Compass, Link as LinkIcon, FileText, User,
         UsersRound, LogOut } from "lucide-react";
import Cookies from "js-cookie";

const menuItems = [
  { name: "Dashboard",          path: "/admin",                    icon: LayoutDashboard },
  { name: "Analytics",          path: "/admin/analytics",          icon: Search          },
  { name: "Claims",             path: "/admin/claims",             icon: FileText        },
  { name: "Items Verification", path: "/admin/items-verification", icon: Compass         },
  { name: "SignUp",             path: "/admin/signup",             icon: User            },
  { name: "Users",              path: "/admin/users",              icon: UsersRound      },
  { name: "Profile",            path: "/admin/profile",            icon: User            },
];

const AdminNavbar = () => {
  const [open, setOpen] = useState(false);
  const navigate        = useNavigate();
  const location        = useLocation();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ── Top bar — mobile only (md:hidden) ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2 text-lg font-bold">
            <Settings size={22} />
            <span>Campus L&F</span>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="p-2 rounded-lg hover:bg-white/20 transition"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── Dropdown ── */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="px-4 pb-4 pt-3 space-y-1 border-t border-white/20">
            {menuItems.map((item) => {
              const Icon   = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium ${
                    active
                      ? "bg-white/25 text-white"
                      : "hover:bg-white/15 text-white/80"
                  }`}
                >
                  <Icon size={17} />
                  {item.name}
                </Link>
              );
            })}

            {/* Logout */}
            <button
              onClick={() => { setOpen(false); handleLogout(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/15 text-white/80 transition text-sm font-medium"
            >
              <LogOut size={17} />
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Spacer for fixed navbar */}
      <div className="md:hidden h-[52px]" />
    </>
  );
};

export default AdminNavbar;