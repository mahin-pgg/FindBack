import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import { useGetItemById } from "../../hooks/itemsHook/useGetItemById.hook";
import {
  ArrowLeft, MapPin, Calendar, Tag, User,
  Shield, Flag, CheckCircle, Clock, XCircle,
  Layers, ChevronRight
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────
const CATEGORY_EMOJI = {
  wallet: "👛", phone: "📱", bag: "🎒",
  id: "💳", electronics: "💻", others: "📦",
};

const STATUS_CONFIG = {
  pending:  { label: "Pending Review", color: "text-amber-600",  bg: "bg-amber-50  border-amber-200",  icon: Clock        },
  approved: { label: "Approved",       color: "text-emerald-600",bg: "bg-emerald-50 border-emerald-200",icon: CheckCircle  },
  rejected: { label: "Rejected",       color: "text-red-600",    bg: "bg-red-50    border-red-200",    icon: XCircle      },
  claimed:  { label: "Claimed",        color: "text-blue-600",   bg: "bg-blue-50   border-blue-200",   icon: CheckCircle  },
  closed:   { label: "Closed",         color: "text-gray-500",   bg: "bg-gray-50   border-gray-200",   icon: XCircle      },
};

const MATCH_STATUS = {
  suggested: { label: "Suggested", cls: "bg-purple-100 text-purple-600" },
  accepted:  { label: "Accepted",  cls: "bg-green-100  text-green-600"  },
  rejected:  { label: "Rejected",  cls: "bg-red-100    text-red-500"    },
};

// ─── Skeleton ─────────────────────────────────────────────────────────
function SkeletonDetail() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-72 bg-gray-200 rounded-3xl" />
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, color = "text-gray-600" }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 p-2 bg-indigo-50 rounded-lg shrink-0">
        <Icon size={16} className="text-indigo-500" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 ${color}`}>{value}</p>
      </div>
    </div>
  );
}

// ─── Match Card ───────────────────────────────────────────────────────
function MatchCard({ match, currentItemId }) {
  const navigate   = useNavigate();
  // Show the OTHER item in the match pair
  const isLost     = match.lostItemId?._id === currentItemId;
  const otherItem  = isLost ? match.foundItemId : match.lostItemId;
  const statusCls  = MATCH_STATUS[match.status]?.cls ?? "bg-gray-100 text-gray-500";
  const statusLbl  = MATCH_STATUS[match.status]?.label ?? match.status;

  if (!otherItem) return null;

  return (
    <div
      onClick={() => navigate(`/items/${otherItem._id}`)}
      className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-indigo-300 hover:shadow-md transition cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">
          {CATEGORY_EMOJI[otherItem.category] ?? "📦"}
        </div>
        <div>
          <p className="font-semibold text-gray-700 text-sm">{otherItem.title}</p>
          <p className="text-xs text-gray-400">📍 {otherItem.location}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="text-right">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
            {match.matchScore}%
          </span>
          <div className="mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCls}`}>
              {statusLbl}
            </span>
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-400 transition" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
const ItemDetail = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [imgError, setImgError] = useState(false);

  const { data, isLoading, isError, error } = useGetItemById(id);

  // responseFormatter: { data: { item, matches } }
  const item    = data?.data?.item    ?? null;
  const matches = Array.isArray(data?.data?.matches) ? data.data.matches : [];

  const status     = STATUS_CONFIG[item?.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = status.icon;
  const emoji      = CATEGORY_EMOJI[item?.category] ?? "📦";

  const postedDate = item?.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "—";

  const itemDate = item?.date
    ? new Date(item.date).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "—";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Sidebar />

      <main className="flex-1 p-6 max-w-5xl">

        {/* ── Back button ── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {isLoading ? (
          <SkeletonDetail />
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-3xl text-sm">
            ⚠️ {error?.message || "Failed to load item. Please try again."}
          </div>
        ) : !item ? null : (
          <div className="space-y-6">

            {/* ── Hero Section ── */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg overflow-hidden">
              <div className="flex flex-col lg:flex-row">

                {/* Image / Emoji */}
                <div className="lg:w-2/5 shrink-0">
                  {item.imageURL && !imgError ? (
                    <img
                      src={item.imageURL?.replace(/\\/g, "/")}
                      alt={item.title}
                      onError={() => setImgError(true)}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-64 lg:h-full min-h-64 flex items-center justify-center text-8xl ${
                      item.type === "lost"
                        ? "bg-gradient-to-br from-red-50 to-rose-100"
                        : "bg-gradient-to-br from-green-50 to-emerald-100"
                    }`}>
                      {emoji}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                  <div>
                    {/* Type + Status badges */}
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                        item.type === "lost"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}>
                        {item.type}
                      </span>
                      <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border ${status.bg} ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                      {item.isFlagged && (
                        <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-600 border border-orange-200">
                          <Flag size={12} /> Flagged
                        </span>
                      )}
                      {item.verifiedByAdmin && (
                        <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 border border-indigo-200">
                          <Shield size={12} /> Verified
                        </span>
                      )}
                    </div>

                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                      {item.title}
                    </h1>

                    {item.description && (
                      <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {/* Info grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <InfoRow icon={MapPin}   label="Location"  value={item.location} />
                      <InfoRow icon={Calendar} label="Item Date" value={itemDate} />
                      <InfoRow
                        icon={Tag}
                        label="Category"
                        value={`${emoji} ${item.category}`}
                        color="capitalize text-gray-700"
                      />
                      <InfoRow
                        icon={Calendar}
                        label="Reported On"
                        value={postedDate}
                        color="text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Reporter */}
                  {item.postedBy && (
                    <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
                      {item.postedBy.profileImage ? (
                        <img
                          src={item.postedBy.profileImage}
                          alt={item.postedBy.firstname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                          {item.postedBy.firstname?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-400">Reported by</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {item.postedBy.firstname} {item.postedBy.lastname}
                        </p>
                      </div>
                      {item.verifiedBy && (
                        <div className="ml-auto text-right">
                          <p className="text-xs text-gray-400">Verified by</p>
                          <p className="text-sm font-semibold text-indigo-600">
                            {item.verifiedBy.firstname} {item.verifiedBy.lastname}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Keywords ── */}
            {Array.isArray(item.keywords) && item.keywords.length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={18} className="text-indigo-500" />
                  <h2 className="font-semibold text-gray-700">Keywords</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-full border border-indigo-100 hover:bg-indigo-100 transition"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Coordinates ── */}
            {item.coordinates?.lat && item.coordinates?.lng && (
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow p-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} className="text-indigo-500" />
                  <h2 className="font-semibold text-gray-700">Coordinates</h2>
                </div>
                <p className="text-sm text-gray-500">
                  {item.coordinates.lat}, {item.coordinates.lng}
                </p>
              </div>
            )}

            {/* ── Matches ── */}
            {matches.length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Layers size={18} className="text-indigo-500" />
                  <h2 className="font-semibold text-gray-700">
                    Potential Matches
                  </h2>
                  <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
                    {matches.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {matches.map((match) => (
                    <MatchCard
                      key={match._id}
                      match={match}
                      currentItemId={id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Action Buttons ── */}
            <div className="flex flex-wrap gap-3 pb-6">
              {item.status === "approved" && item.type === "lost" && (
                <button className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-semibold hover:opacity-90 transition shadow-lg shadow-indigo-200 text-sm">
                  🙋 Claim This Item
                </button>
              )}
              <button
                onClick={() => navigate(-1)}
                className="flex-1 sm:flex-none px-6 py-3 bg-white text-gray-600 rounded-2xl font-semibold hover:bg-gray-50 transition border border-gray-200 text-sm"
              >
                ← Go Back
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default ItemDetail;