import React, { useState, useMemo } from "react";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import { useGetMyItems } from "../../hooks/itemsHook/useGetMyItems.hook";
import { useNavigate } from "react-router";
import Navbar from "../../components/navbar/navbar.jsx";

const CATEGORY_EMOJI = {
  wallet: "👛", phone: "📱", bag: "🎒",
  id: "💳", electronics: "💻", others: "📦",
};

const STATUS_STYLES = {
  pending:  { label: "Pending",  cls: "bg-yellow-500" },
  approved: { label: "Approved", cls: "bg-green-500"  },
  rejected: { label: "Rejected", cls: "bg-red-500"    },
  claimed:  { label: "Claimed",  cls: "bg-blue-500"   },
  closed:   { label: "Closed",   cls: "bg-gray-400"   },
};

// ─── Skeleton card ────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
      <div className="w-full h-40 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-9 bg-gray-200 rounded-lg mt-4" />
      </div>
    </div>
  );
}

// ─── Item card ────────────────────────────────────────────────────────
function ItemCard({ item, navigate }) {
  const status  = STATUS_STYLES[item.status] ?? STATUS_STYLES.pending;
  const emoji   = CATEGORY_EMOJI[item.category] ?? "📦";
  const itemDate = item.date
    ? new Date(item.date).toLocaleDateString("en-IN", {
        day: "numeric", month: "short",
      })
    : "—";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
      <div className="relative">
        {item.imageURL ? (
          <img
            src={item.imageURL}
            alt={item.title}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-5xl">
            {emoji}
          </div>
        )}
        <span className={`absolute top-2 right-2 ${status.cls} text-white px-3 py-1 text-xs rounded-full shadow`}>
          {status.label}
        </span>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 truncate">
          {item.title}
        </h2>
        {item.description && (
          <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">
            {item.description}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-2">📍 {item.location}</p>
        <p className="text-sm text-gray-400">📅 {itemDate}</p>

        {/* Keywords */}
        {Array.isArray(item.keywords) && item.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.keywords.slice(0, 3).map((kw) => (
              <span key={kw} className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                #{kw}
              </span>
            ))}
          </div>
        )}

        <button
          className="mt-4 w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:opacity-90 text-sm font-medium transition"
          onClick={() => navigate(`/items/${item._id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
const FoundItems = () => {
  const navigate = useNavigate();
  const [page, setPage]               = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword]         = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter]     = useState("");

  const params = useMemo(() => ({
    page,
    limit:    9,
    order:    "desc",
    type:     "found",   // only found items — backend scopes to req.user.sub
    keyword:   keyword         || undefined,
    category:  categoryFilter  || undefined,
    status:    statusFilter    || undefined,
  }), [page, keyword, categoryFilter, statusFilter]);

  const { data, isLoading, isError, isFetching, error } = useGetMyItems(params);

  const items      = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.pagination ?? {};

  const handleSearch = () => {
    setKeyword(searchInput.trim());
    setPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar />
      <Sidebar />

      <main className="flex-1 p-6 mt-10 lg:mt-0">

        <h1 className="text-3xl font-bold text-gray-700 mb-6">
          📦 Found Items
        </h1>

        {/* ── Search + Filters ── */}
        <div className="bg-white/80 backdrop-blur-lg p-4 rounded-2xl shadow mb-6 flex flex-col md:flex-row gap-3 flex-wrap">
          <div className="flex flex-1 gap-2 min-w-[200px]">
            <input
              type="text"
              value={searchInput}
              placeholder="🔍 Search found items..."
              className="flex-1 px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition text-sm font-medium"
            >
              Search
            </button>
          </div>

          {/* Category — schema enum */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          >
            <option value="">All Categories</option>
            <option value="wallet">Wallet</option>
            <option value="phone">Phone</option>
            <option value="bag">Bag</option>
            <option value="id">ID Card</option>
            <option value="electronics">Electronics</option>
            <option value="others">Others</option>
          </select>

          {/* Status — schema enum */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="claimed">Claimed</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* ── Error ── */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6 text-sm">
            ⚠️ {error?.message || "Failed to load items. Please try again."}
          </div>
        )}

        {/* ── Results count ── */}
        {!isLoading && !isError && (
          <p className="text-sm text-gray-400 mb-4">
            {isFetching
              ? "Refreshing…"
              : `${pagination.total ?? 0} found item${pagination.total !== 1 ? "s" : ""}`}
          </p>
        )}

        {/* ── Grid ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [1, 2, 3].map((n) => <SkeletonCard key={n} />)
          ) : items.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📦</p>
              <p className="font-medium">No found items yet</p>
              <p className="text-sm mt-1">Items you report as found will appear here</p>
            </div>
          ) : (
            items.map((item) => <ItemCard key={item._id} item={item} navigate={navigate} />)
          )}
        </div>

        {/* ── Pagination ── */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
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

export default FoundItems;