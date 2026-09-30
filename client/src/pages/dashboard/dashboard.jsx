import React from "react";
import { Link } from "react-router";
import Cookies from "js-cookie";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import { UserRound, Compass, BaggageClaim, Search } from "lucide-react";
import { useUserDashboard } from "../../hooks/usersHook/useUserDashboard.js";

const CATEGORY_EMOJI = {
  wallet: "👛", phone: "📱", bag: "🎒",
  id: "💳", electronics: "💻", others: "📦",
};

const STATUS_STYLES = {
  pending:      "text-yellow-500",
  approved:     "text-green-500",
  rejected:     "text-red-500",
  claimed:      "text-blue-500",
  closed:       "text-gray-400",
  under_review: "text-indigo-500",
  completed:    "text-emerald-500",
  suggested:    "text-purple-500",
  accepted:     "text-green-500",
};

function StatusText({ status }) {
  return (
    <span className={`font-medium capitalize text-sm ${STATUS_STYLES[status] ?? "text-gray-500"}`}>
      {status?.replace("_", " ") ?? "—"}
    </span>
  );
}

function Skeleton({ className = "" }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}

const Dashboard = () => {
  const cookieUser = JSON.parse(Cookies.get("user") || "{}");
  const { data, isLoading, isError } = useUserDashboard();

  const dashboard      = data?.data ?? {};
  const stats          = dashboard.stats          ?? {};
  const recentActivity = Array.isArray(dashboard.recentActivity) ? dashboard.recentActivity : [];
  const matches        = Array.isArray(dashboard.matches)        ? dashboard.matches        : [];
  const claims         = Array.isArray(dashboard.claims)         ? dashboard.claims         : [];
  const browseItems    = Array.isArray(dashboard.browseItems)    ? dashboard.browseItems    : [];
  const profile        = dashboard.profile ?? cookieUser;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* Navbar — mobile only, outside main so it doesn't inherit padding */}
      <Navbar />

      {/* Sidebar — desktop only */}
      <Sidebar />

      <main className="flex-1 min-w-0 p-4 md:p-6 space-y-6">

        {/* ── Top bar ── */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Dashboard</h1>
          <div className="flex items-center gap-3">
            {/* Search hidden on small screens — use sidebar nav instead */}
            <input
              type="text"
              placeholder="Search..."
              className="hidden sm:block px-4 py-2 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-40 md:w-52"
            />
            <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center rounded-full font-bold text-sm shrink-0">
              {profile?.firstname?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm">
            ⚠️ Failed to load dashboard. Please refresh.
          </div>
        )}

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {[
            { title: "Lost Items",  value: stats.lostItems,  color: "text-red-500"    },
            { title: "Found Items", value: stats.foundItems, color: "text-green-500"  },
            { title: "My Claims",   value: stats.claims,     color: "text-yellow-500" },
            { title: "My Matches",  value: stats.matches,    color: "text-indigo-600" },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white/70 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow hover:scale-105 transition"
            >
              <p className="text-gray-500 text-xs md:text-sm">{card.title}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-14 mt-2" />
              ) : (
                <h2 className={`text-2xl md:text-3xl font-bold mt-2 ${card.color}`}>
                  {card.value ?? 0}
                </h2>
              )}
            </div>
          ))}
        </div>

        {/* ── Recent Activity ── */}
        <div className="bg-white/80 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
            Recent Activity
          </h2>
          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <table className="w-full text-left text-sm min-w-[400px]">
              <thead>
                <tr className="text-gray-500 border-b text-xs uppercase tracking-wide">
                  <th className="py-2 pr-4">Item</th>
                  <th className="pr-4">Type</th>
                  <th className="pr-4 hidden sm:table-cell">Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [1, 2, 3].map((n) => (
                    <tr key={n} className="border-b">
                      {[1, 2, 3, 4].map((c) => (
                        <td key={c} className="py-3 pr-4">
                          <Skeleton className="h-4 w-16" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">
                      No activity yet. Start by reporting a lost or found item.
                    </td>
                  </tr>
                ) : (
                  recentActivity.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-indigo-50 transition">
                      <td className="py-3 pr-4 font-medium text-gray-700 max-w-[120px] truncate">
                        {CATEGORY_EMOJI[item.category] ?? "📦"} {item.title}
                      </td>
                      <td className="pr-4">
                        <span className={`capitalize font-medium text-xs ${item.type === "lost" ? "text-red-500" : "text-green-500"}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="pr-4 text-gray-500 hidden sm:table-cell text-xs truncate max-w-[100px]">
                        {item.location}
                      </td>
                      <td><StatusText status={item.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── My Matches ── */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="text-indigo-600 shrink-0" size={18} />
              <h2 className="text-lg md:text-xl font-semibold text-indigo-600">My Matches</h2>
            </div>
            <Link to="/mymatches" className="text-xs md:text-sm text-indigo-500 hover:underline whitespace-nowrap">
              View →
            </Link>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {[1, 2].map((n) => <Skeleton key={n} className="h-24 rounded-xl" />)}
            </div>
          ) : matches.length === 0 ? (
            <p className="text-gray-400 text-sm">No matches found yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {matches.map((match) => (
                <div key={match._id} className="border p-3 md:p-4 rounded-xl hover:shadow-md transition">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-700 text-sm truncate">
                        {CATEGORY_EMOJI[match.lostItemId?.category] ?? "📦"}{" "}
                        {match.lostItemId?.title ?? "—"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        📍 {match.lostItemId?.location ?? "—"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        Matched: {match.foundItemId?.title ?? "—"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full whitespace-nowrap">
                        {match.matchScore}%
                      </span>
                      <div className="mt-1">
                        <StatusText status={match.status} />
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-xs hover:bg-indigo-600 transition">
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── My Claims ── */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 mb-4">
              <BaggageClaim className="text-green-600 shrink-0" size={18} />
              <h2 className="text-lg md:text-xl font-semibold text-green-600">My Claims</h2>
            </div>
            <Link to="/myclaims" className="text-xs md:text-sm text-indigo-500 hover:underline whitespace-nowrap">
              View →
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => <Skeleton key={n} className="h-14 rounded-lg" />)}
            </div>
          ) : claims.length === 0 ? (
            <p className="text-gray-400 text-sm">You haven't made any claims yet.</p>
          ) : (
            <ul className="space-y-2">
              {claims.map((claim) => (
                <li
                  key={claim._id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition gap-3"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-gray-700 text-sm truncate block">
                      {CATEGORY_EMOJI[claim.itemId?.category] ?? "📦"}{" "}
                      {claim.itemId?.title ?? "Deleted item"}
                    </span>
                    {claim.itemId?.location && (
                      <p className="text-xs text-gray-400 truncate">📍 {claim.itemId.location}</p>
                    )}
                  </div>
                  <StatusText status={claim.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Browse Items ── */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="text-purple-600 shrink-0" size={18} />
              <h2 className="text-lg md:text-xl font-semibold text-purple-600">Browse Items</h2>
            </div>
            <Link to="/browseitems" className="text-xs md:text-sm text-indigo-500 hover:underline whitespace-nowrap">
              View all →
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[1, 2, 3].map((n) => <Skeleton key={n} className="h-20 rounded-xl" />)}
            </div>
          ) : browseItems.length === 0 ? (
            <p className="text-gray-400 text-sm">No items to browse right now.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {browseItems.map((item) => (
                <Link to={`/items/${item._id}`} key={item._id}>
                  <div className="border p-3 rounded-xl hover:shadow-md transition cursor-pointer h-full">
                    <p className="font-semibold text-gray-700 text-sm truncate">
                      {CATEGORY_EMOJI[item.category] ?? "📦"} {item.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 truncate">📍 {item.location}</p>
                    <span className={`text-xs font-medium capitalize mt-1 inline-block ${item.type === "lost" ? "text-red-400" : "text-green-500"}`}>
                      {item.type}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── My Profile ── */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow">
          <div className="flex items-center gap-2 mb-4">
            <UserRound className="text-pink-600 shrink-0" size={18} />
            <h2 className="text-lg md:text-xl font-semibold text-pink-600">My Profile</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="w-14 h-14 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.firstname}
                  className="w-14 h-14 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-14 h-14 bg-indigo-500 text-white flex items-center justify-center rounded-full text-xl font-bold shrink-0">
                  {profile?.firstname?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-gray-700 truncate">
                  {profile?.firstname} {profile?.lastname}
                </p>
                <p className="text-gray-500 text-sm truncate">{profile?.email}</p>
                {profile?.phone && (
                  <p className="text-gray-400 text-xs">📞 {profile.phone}</p>
                )}
                <Link to="/profile">
                  <button className="mt-2 px-4 py-1.5 bg-indigo-500 text-white rounded-lg text-xs hover:bg-indigo-600 transition">
                    Edit Profile
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;