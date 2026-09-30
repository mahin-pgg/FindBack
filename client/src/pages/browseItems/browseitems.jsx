import React, { useState, useMemo } from "react";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import { useFetchItems } from "../../hooks/itemsHook/useGetItems.hook";
import { useNavigate } from "react-router";
import Navbar from "../../components/navbar/navbar.jsx";

// schema enum: "wallet" | "phone" | "bag" | "id" | "electronics" | "others"
const CATEGORY_EMOJI = {
  wallet:      "👛",
  phone:       "📱",
  bag:         "🎒",
  id:          "💳",
  electronics: "💻",
  others:      "📦",
};

const TYPE_STYLES = {
  lost:  { badge: "bg-red-100 text-red-500",   label: "Lost" },
  found: { badge: "bg-green-100 text-green-600", label: "Found" },
};

// ─── Item Card ────────────────────────────────────────────────────────
function ItemCard({ item, navigate }) {
  const type    = TYPE_STYLES[item.type] ?? TYPE_STYLES.lost;
  const emoji   = CATEGORY_EMOJI[item.category] ?? "📦";
  const itemDate = item.date
    ? new Date(item.date).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "—";

  return (
    <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow hover:shadow-lg transition flex flex-col gap-3">

      {/* Image or emoji placeholder */}
      {item.imageURL ? (
        <img
          src={item.imageURL?.replace(/\\/g, "/")}
          alt={item.title}
          className="w-full h-40 object-cover rounded-xl"
        />
      ) : (
        <div className="w-full h-40 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-5xl">
          {emoji}
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-800 leading-snug">
          {item.title}
        </h2>
        <span className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${type.badge}`}>
          {type.label}
        </span>
      </div>

      <p className="text-sm text-gray-500 line-clamp-2">
        {item.description}
      </p>

      <div className="text-sm text-gray-400 space-y-0.5">
        {item.location && <p>📍 {item.location}</p>}
        <p>🗓 {itemDate}</p>
        <p className="capitalize">🏷 {item.category}</p>
      </div>

      {/* Keywords */}
      {Array.isArray(item.keywords) && item.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.keywords.map((kw) => (
            <span
              key={kw}
              className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full"
            >
              #{kw}
            </span>
          ))}
        </div>
      )}

      <button className="mt-auto w-full py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition text-sm font-medium"
      onClick={() => navigate(`/items/${item._id}`)}>
        View Details
      </button>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white/60 p-5 rounded-2xl shadow animate-pulse space-y-3">
      <div className="w-full h-40 bg-gray-200 rounded-xl" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
const BrowseItems = () => {
  const navigate = useNavigate();
  const [page, setPage]           = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword]     = useState("");
  const [category, setCategory]   = useState("");
  const [type, setType]           = useState("");

  const params = useMemo(
    () => ({
      page,
      limit:    12,
      order:    "desc",
      keyword:  keyword  || undefined,
      category: category || undefined,
      type:     type     || undefined,
    }),
    [page, keyword, category, type]
  );

  const { data, isLoading, isError, isFetching, error } = useFetchItems(params);

  // responseFormatter shape: { data: Item[], pagination: { total, page, limit, totalPages } }
  const items      = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.pagination ?? {};

  const handleSearch = () => {
    setKeyword(searchInput.trim());
    setPage(1);
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
  };

  const handleTypeChange = (val) => {
    setType(val);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar />
      <Sidebar />

      <main className="flex-1 p-6 mt-10 lg:mt-0">

        <h1 className="text-3xl font-bold text-gray-700 mb-6">
          🧭 Browse Items
        </h1>

        {/* ── Search + Filters ── */}
        <div className="bg-white/80 backdrop-blur-lg p-4 rounded-2xl shadow mb-6 flex flex-col md:flex-row gap-3 flex-wrap">

          {/* Keyword search */}
          <div className="flex flex-1 gap-2 min-w-[200px]">
            <input
              type="text"
              value={searchInput}
              placeholder="🔍 Search by title, description..."
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
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
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

          {/* Type */}
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          >
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

        </div>

        {/* ── Active filters indicator ── */}
        {(keyword || category || type) && (
          <div className="flex gap-2 flex-wrap mb-4">
            {keyword && (
              <span className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                🔍 "{keyword}"
                <button onClick={() => { setKeyword(""); setSearchInput(""); setPage(1); }}>✕</button>
              </span>
            )}
            {category && (
              <span className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full capitalize">
                🏷 {category}
                <button onClick={() => { setCategory(""); setPage(1); }}>✕</button>
              </span>
            )}
            {type && (
              <span className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full capitalize">
                📌 {type}
                <button onClick={() => { setType(""); setPage(1); }}>✕</button>
              </span>
            )}
          </div>
        )}

        {/* ── Error ── */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6 text-sm">
            ⚠️ {error?.message || "Failed to load items. Please try again."}
          </div>
        )}

        {/* ── Results count ── */}
        {!isLoading && !isError && (
          <p className="text-sm text-gray-400 mb-4">
            {isFetching ? "Refreshing…" : `Showing ${items.length} of ${pagination.total ?? 0} items`}
          </p>
        )}

        {/* ── Grid ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? [1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)
            : items.length > 0
              ? items.map((item) => <ItemCard key={item._id} item={item} navigate={navigate} />)
              : (
                <div className="col-span-full text-center py-16 text-gray-400">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="font-medium">No items found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filters</p>
                </div>
              )
          }
        </div>

        {/* ── Pagination ── */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-4">
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

export default BrowseItems;