import React, { useState, useMemo } from "react";
import AdminSidebar from "../../components/sidebar/adminsidebar";
import AdminNavbar from "../../components/navbar/Adminnavbar";
import { useFetchUsers } from "../../hooks/adminHook/useFetchUsers";
import { useBlockUser } from "../../hooks/useBlockUser.hook.js";

// ─── Helpers ──────────────────────────────────────────────────────────
function Avatar({ user }) {
  if (user.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={user.firstname}
        className="w-8 h-8 rounded-full object-cover shrink-0"
      />
    );
  }
  const initials = `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
      {initials}
    </div>
  );
}

function RoleBadge({ role }) {
  return role === "admin" ? (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 border border-indigo-200 whitespace-nowrap">
      🛡 Admin
    </span>
  ) : (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 whitespace-nowrap">
      👤 User
    </span>
  );
}

function StatusBadge({ isBlocked }) {
  return isBlocked ? (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200 whitespace-nowrap">
      🚫 Blocked
    </span>
  ) : (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-600 border border-green-200 whitespace-nowrap">
      ✅ Active
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b animate-pulse">
      {[1, 2, 3, 4, 5].map((n) => (
        <td key={n} className="p-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function Paginator({ page, totalPages, onPrev, onNext }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <button
        disabled={page <= 1}
        onClick={onPrev}
        className="px-4 py-2 bg-white rounded-xl shadow text-sm font-medium text-gray-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Prev
      </button>
      <span className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={onNext}
        className="px-4 py-2 bg-white rounded-xl shadow text-sm font-medium text-gray-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
const UsersPage = () => {
  const [page, setPage]                   = useState(1);
  const [searchInput, setSearchInput]     = useState("");
  const [keyword, setKeyword]             = useState("");
  const [roleFilter, setRoleFilter]       = useState("");
  const [blockedFilter, setBlockedFilter] = useState("");
  const [blockingId, setBlockingId]       = useState(null);

  const params = useMemo(() => ({
    page,
    limit:     10,
    order:     "desc",
    keyword:   keyword      || undefined,
    role:      roleFilter   || undefined,
    isBlocked: blockedFilter !== "" ? blockedFilter === "true" : undefined,
  }), [page, keyword, roleFilter, blockedFilter]);

  const { data, isLoading, isError, isFetching, error } = useFetchUsers(params);
  const { mutate: toggleBlock } = useBlockUser();

  const users      = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.pagination ?? {};
  const summary    = data?.summary    ?? {};

  const handleSearch = () => { setKeyword(searchInput.trim()); setPage(1); };

  const handleFilterChange = (key, value) => {
    if (key === "role")      setRoleFilter(value);
    if (key === "isBlocked") setBlockedFilter(value);
    setPage(1);
  };

  const handleBlockToggle = (userId) => {
    setBlockingId(userId);
    toggleBlock(userId, { onSettled: () => setBlockingId(null) });
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    }) : "—";

  const timeAgo = (dateStr) => {
    const diff  = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(hours / 24);
    if (days > 0)  return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <AdminNavbar />
      <AdminSidebar />

      <main className="flex-1 min-w-0 p-4 md:p-6 space-y-6">

        <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
          👥 Users Management
        </h1>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: "Total Users",   value: summary.total,   color: "text-indigo-600" },
            { label: "Active Users",  value: summary.active,  color: "text-green-500"  },
            { label: "Blocked Users", value: summary.blocked, color: "text-red-500"    },
            { label: "Admins",        value: summary.admins,  color: "text-yellow-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/80 backdrop-blur-lg p-4 md:p-5 rounded-2xl shadow text-center">
              {isLoading
                ? <div className="h-8 w-14 bg-gray-200 rounded animate-pulse mx-auto" />
                : <h2 className={`text-2xl md:text-3xl font-bold ${color}`}>{value ?? "—"}</h2>
              }
              <p className="text-gray-500 mt-1 text-xs md:text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Search + Filters ── */}
        <div className="bg-white/80 backdrop-blur-lg p-4 md:p-5 rounded-2xl shadow flex flex-col gap-3">
          {/* Search row */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              placeholder="🔍 Search by name or email..."
              className="flex-1 px-3 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition text-sm font-medium shrink-0"
            >
              Search
            </button>
          </div>

          {/* Filters row */}
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={blockedFilter}
              onChange={(e) => handleFilterChange("isBlocked", e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="false">Active</option>
              <option value="true">Blocked</option>
            </select>
          </div>
        </div>

        {/* ── Error ── */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm">
            ⚠️ {error?.message || "Failed to load users. Please try again."}
          </div>
        )}

        {/* ── Users Table ── */}
        <div className="bg-white/80 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold">📋 User List</h2>
            <p className="text-xs md:text-sm text-gray-400">
              {isFetching && !isLoading ? "Refreshing…" : `${pagination.total ?? 0} users`}
            </p>
          </div>

          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <table className="w-full text-left text-sm min-w-[540px]">
              <thead>
                <tr className="border-b text-gray-500 text-xs uppercase tracking-wide">
                  <th className="p-3">User</th>
                  <th className="p-3 hidden md:table-cell">Email</th>
                  <th className="p-3 hidden lg:table-cell">Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 hidden sm:table-cell">Joined</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((n) => <SkeletonRow key={n} />)
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                      No users found matching your filters.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const isActioning = blockingId === user._id;
                    const isAdmin     = user.role === "admin";
                    return (
                      <tr key={user._id} className="border-b hover:bg-gray-50 transition">

                        {/* Name + avatar */}
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar user={user} />
                            <span className="font-medium text-gray-700 text-xs md:text-sm truncate max-w-[80px] md:max-w-[120px]">
                              {user.firstname} {user.lastname}
                            </span>
                          </div>
                        </td>

                        {/* Email — hidden on mobile */}
                        <td className="p-3 text-gray-500 text-xs hidden md:table-cell truncate max-w-[140px]">
                          {user.email}
                        </td>

                        {/* Phone — hidden below lg */}
                        <td className="p-3 text-gray-500 text-xs hidden lg:table-cell">
                          {user.phone ?? <span className="text-gray-300">—</span>}
                        </td>

                        <td className="p-3"><RoleBadge role={user.role} /></td>

                        <td className="p-3"><StatusBadge isBlocked={user.isBlocked} /></td>

                        {/* Joined — hidden on xs */}
                        <td className="p-3 text-gray-400 text-xs hidden sm:table-cell whitespace-nowrap">
                          {formatDate(user.createdAt)}
                        </td>

                        {/* Action */}
                        <td className="p-3">
                          {isAdmin ? (
                            <span className="text-xs text-gray-400 italic">N/A</span>
                          ) : (
                            <button
                              disabled={isActioning}
                              onClick={() => handleBlockToggle(user._id)}
                              className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
                                user.isBlocked
                                  ? "bg-indigo-500 hover:bg-indigo-600"
                                  : "bg-red-500 hover:bg-red-600"
                              }`}
                            >
                              {isActioning ? "…" : user.isBlocked ? "Unblock" : "Block"}
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <Paginator
            page={page}
            totalPages={pagination.totalPages}
            onPrev={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
          />
        </div>

        {/* ── Recent Registrations ── */}
        <div className="bg-white/80 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow">
          <h2 className="text-lg md:text-xl font-semibold mb-4">🆕 Recent Registrations</h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="text-gray-400 text-sm">No recent registrations.</p>
          ) : (
            <div className="space-y-3">
              {[...users]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center bg-gray-50 p-3 md:p-4 rounded-xl hover:bg-gray-100 transition gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar user={user} />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-700 text-sm truncate">
                          {user.firstname} {user.lastname}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {timeAgo(user.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <RoleBadge role={user.role} />
                      <StatusBadge isBlocked={user.isBlocked} />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* ── Bottom Paginator ── */}
        <Paginator
          page={page}
          totalPages={pagination.totalPages}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />

      </main>
    </div>
  );
};

export default UsersPage;