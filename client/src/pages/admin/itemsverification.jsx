import React, { useState, useMemo } from "react";
import AdminSidebar from "../../components/sidebar/adminsidebar";
import AdminNavbar from "../../components/navbar/Adminnavbar.jsx";
import { useFetchAdminItems } from "../../hooks/adminHook/useFetchAdminItems";
import { useVerifyItem } from "../../hooks/adminHook/useVerifyItem.hook";

// ─── Category maps — schema enum exactly ─────────────────────────────
// "wallet" | "phone" | "bag" | "id" | "electronics" | "others"
const CATEGORY_EMOJI = {
  wallet:      "👛",
  phone:       "📱",
  bag:         "🎒",
  id:          "💳",
  electronics: "💻",
  others:      "📦",
};

const CATEGORY_GRADIENT = {
  wallet:      "from-pink-500 to-rose-500",
  phone:       "from-green-500 to-emerald-500",
  bag:         "from-indigo-500 to-purple-500",
  id:          "from-yellow-500 to-orange-500",
  electronics: "from-slate-500 to-gray-600",
  others:      "from-violet-500 to-indigo-500",
};

// ─── Status badge — schema enum exactly ──────────────────────────────
// "pending" | "approved" | "rejected" | "claimed" | "closed"
function StatusBadge({ status }) {
  const styles = {
    pending:  "bg-yellow-100 text-yellow-700 border-yellow-300",
    approved: "bg-green-100 text-green-700 border-green-300",
    rejected: "bg-red-100 text-red-700 border-red-300",
    claimed:  "bg-blue-100 text-blue-700 border-blue-300",
    closed:   "bg-gray-100 text-gray-500 border-gray-300",
  };
  const labels = {
    pending:  "⏳ Pending",
    approved: "✅ Approved",
    rejected: "❌ Rejected",
    claimed:  "🙌 Claimed",
    closed:   "🔒 Closed",
  };
  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full border ${
        styles[status] ?? "bg-gray-100 text-gray-500 border-gray-300"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}

// ─── Item Card ────────────────────────────────────────────────────────
function ItemCard({ item, onApprove, onReject, isApprovingId, isRejectingId }) {
  const emoji    = CATEGORY_EMOJI[item.category]    ?? "📦";
  const gradient = CATEGORY_GRADIENT[item.category] ?? "from-violet-500 to-indigo-500";
  const isLoading = isApprovingId === item._id || isRejectingId === item._id;

  // item.date = when item was lost/found (schema: Date required)
  const itemDate = item.date
    ? new Date(item.date).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  // submittedAt = when the report was created (schema: timestamps)
  const submittedAt = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  // only pending items get Verify / Reject buttons
  const canAction = item.status === "pending";

  return (
    <div
      className={`bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow hover:shadow-md transition-shadow ${
        item.isFlagged ? "border-l-4 border-orange-400" : ""
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between gap-6">

        {/* ── Left: image / icon + details ── */}
        <div className="flex gap-5">
          {item.imageURL ? (
            <img
              src={`/${item.imageURL.replace(/\\/g, "/")}`}
              alt={item.title}
              className="w-24 h-24 shrink-0 rounded-xl object-cover shadow"
            />
          ) : (
            <div
              className={`w-24 h-24 shrink-0 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-4xl shadow`}
            >
              {emoji}
            </div>
          )}

          <div className="min-w-0 space-y-0.5">
            {/* Title + flag / verifiedByAdmin badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-gray-700 truncate">
                {item.title}
              </h2>
              {item.isFlagged && (
                <span className="text-xs bg-orange-100 text-orange-600 border border-orange-300 px-2 py-0.5 rounded-full font-semibold">
                  🚩 Flagged
                </span>
              )}
              {item.verifiedByAdmin && (
                <span className="text-xs bg-indigo-100 text-indigo-600 border border-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                  🛡 Admin Verified
                </span>
              )}
            </div>

            {/* Reporter (populated postedBy) */}
            <p className="text-gray-500 text-sm">
              Reported by:{" "}
              <span className="font-medium text-gray-600">
                {item.postedBy?.name ?? "Unknown"}
              </span>
              {item.postedBy?.email && (
                <span className="text-gray-400"> · {item.postedBy.email}</span>
              )}
            </p>

            {/* Category + Type in one row */}
            <div className="flex flex-wrap gap-x-4">
              <p className="text-gray-500 text-sm">
                Category:{" "}
                <span className="capitalize font-medium text-gray-600">
                  {item.category ?? "—"}
                </span>
              </p>
              <p className="text-gray-500 text-sm">
                Type:{" "}
                <span
                  className={`capitalize font-semibold ${
                    item.type === "lost" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {item.type ?? "—"}
                </span>
              </p>
            </div>

            {/* Location */}
            {item.location && (
              <p className="text-gray-500 text-sm">📍 {item.location}</p>
            )}

            {/* Dates */}
            <div className="flex flex-wrap gap-x-4">
              {itemDate && (
                <p className="text-gray-400 text-xs">🗓 Item date: {itemDate}</p>
              )}
              {submittedAt && (
                <p className="text-gray-400 text-xs">📨 Submitted: {submittedAt}</p>
              )}
            </div>

            {/* verifiedBy admin name (schema: ObjectId ref User) */}
            {item.verifiedBy?.name && (
              <p className="text-gray-400 text-xs">
                🛡 Verified by: {item.verifiedBy.name}
              </p>
            )}

            {/* Keywords array (schema: [String]) */}
            {Array.isArray(item.keywords) && item.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {item.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-1">
              <StatusBadge status={item.status} />
            </div>
          </div>
        </div>

        {/* ── Right: actions (pending only) ── */}
        {canAction && (
          <div className="flex gap-3 items-center self-start md:self-center shrink-0">
            <button
              disabled={isLoading}
              onClick={() => onApprove(item._id)}
              className="px-5 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isApprovingId === item._id ? "Verifying…" : "Verify"}
            </button>
            <button
              disabled={isLoading}
              onClick={() => onReject(item._id)}
              className="px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isRejectingId === item._id ? "Rejecting…" : "Reject"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
const ItemsVerification = () => {
  const [page, setPage]                   = useState(1);
  const [statusFilter, setStatusFilter]   = useState("pending"); // default: show pending
  const [typeFilter, setTypeFilter]       = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [flaggedOnly, setFlaggedOnly]     = useState(false);
  const [keyword, setKeyword]             = useState("");
  const [searchInput, setSearchInput]     = useState("");
  const [approvingId, setApprovingId]     = useState(null);
  const [rejectingId, setRejectingId]     = useState(null);

  // ── Build query params for the hook ───────────────────────────
  const queryParams = useMemo(
    () => ({
      page,
      limit:    10,
      order:    "desc",
      status:   statusFilter   || undefined,
      type:     typeFilter     || undefined,
      category: categoryFilter || undefined,
      isFlagged: flaggedOnly   || undefined,
      keyword:  keyword        || undefined,
    }),
    [page, statusFilter, typeFilter, categoryFilter, flaggedOnly, keyword]
  );

  const { data, isLoading, isError, isFetching } = useFetchAdminItems(queryParams);

  // ── Safe extraction ────────────────────────────────────────────
  const items      = Array.isArray(data?.data) ? data.data : [];
  // responseFormatter exposes pagination key (not meta)
  const pagination = data?.pagination ?? {};
  // summary comes from the provider — global counts, not just current page
  const summary    = data?.summary    ?? {};

  // ── Mutations ──────────────────────────────────────────────────
  const { mutate: verifyItem } = useVerifyItem();

  const handleApprove = (itemId) => {
    setApprovingId(itemId);
    verifyItem({ itemId, action: "approved" }, { onSettled: () => setApprovingId(null) });
  };

  const handleReject = (itemId) => {
    setRejectingId(itemId);
    verifyItem({ itemId, action: "rejected" }, { onSettled: () => setRejectingId(null) });
  };

  const handleSearch = () => {
    setKeyword(searchInput.trim());
    setPage(1);
  };

  const handleFilterChange = (key, value) => {
    if (key === "status")   { setStatusFilter(value);   }
    if (key === "type")     { setTypeFilter(value);     }
    if (key === "category") { setCategoryFilter(value); }
    setPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Navbar */}
      <AdminNavbar />

      {/* Sidebar */}
      <AdminSidebar />

      <main className="flex-1 p-6">

        <h1 className="text-3xl font-bold text-gray-700 mb-6">
          📦 Items Verification
        </h1>

        {/* ── Stats row — sourced from summary (global counts) ── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Pending",  value: summary.pending,  color: "text-yellow-500" },
            { label: "Approved", value: summary.approved, color: "text-green-500"  },
            { label: "Rejected", value: summary.rejected, color: "text-red-500"    },
            { label: "Claimed",  value: summary.claimed,  color: "text-blue-500"   },
            { label: "Closed",   value: summary.closed,   color: "text-gray-400"   },
            { label: "🚩 Flagged", value: summary.flagged, color: "text-orange-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/80 backdrop-blur-lg p-4 rounded-2xl shadow text-center">
              <h2 className={`text-2xl font-bold ${color}`}>
                {value ?? "—"}
              </h2>
              <p className="text-gray-500 mt-1 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Search + Filters ── */}
        <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow mb-8 flex flex-col md:flex-row gap-4 flex-wrap">

          {/* Keyword search */}
          <div className="flex flex-1 gap-2 min-w-[200px]">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="🔍 Search title, description, keywords..."
              className="flex-1 px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition text-sm font-medium"
            >
              Search
            </button>
          </div>

          {/* Status — all 5 schema enum values */}
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="claimed">Claimed</option>
            <option value="closed">Closed</option>
          </select>

          {/* Type — "lost" | "found" */}
          <select
            value={typeFilter}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          >
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          {/* Category — exact schema enum */}
          <select
            value={categoryFilter}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          >
            <option value="">All Categories</option>
            <option value="wallet">Wallet</option>
            <option value="phone">Phone</option>
            <option value="bag">Bag</option>
            <option value="id">ID Card</option>
            <option value="electronics">Electronics</option>
            <option value="others">Others</option>
          </select>

          {/* Flagged toggle */}
          <button
            onClick={() => { setFlaggedOnly((f) => !f); setPage(1); }}
            className={`px-4 py-3 rounded-xl border text-sm font-medium transition ${
              flaggedOnly
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-600 border-gray-300 hover:bg-orange-50"
            }`}
          >
            🚩 Flagged Only
          </button>
        </div>

        {/* ── Item Cards ── */}
        {isLoading ? (
          <div className="space-y-4 mb-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white/60 p-6 rounded-2xl shadow animate-pulse h-28" />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl mb-8">
            ⚠️ Failed to load items. Please try again.
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white/80 p-10 rounded-2xl shadow text-center text-gray-400 mb-8">
            No items found matching your filters.
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {isFetching && (
              <p className="text-xs text-indigo-400 text-right animate-pulse">
                Refreshing…
              </p>
            )}
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onApprove={handleApprove}
                onReject={handleReject}
                isApprovingId={approvingId}
                isRejectingId={rejectingId}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-white rounded-xl shadow text-sm font-medium text-gray-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-white rounded-xl shadow text-sm font-medium text-gray-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default ItemsVerification;