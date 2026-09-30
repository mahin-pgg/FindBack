import React from "react";

const MatchDetailsModal = ({ match, onClose }) => {
  if (!match) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-lg relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">
          🔍 Match Details
        </h2>

        {/* MATCH SCORE */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">Match Score</p>
          <p className="text-2xl font-bold text-indigo-600">
            {match.matchScore}%
          </p>
        </div>

        {/* REASON */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">Why this match?</p>
          <p className="text-gray-700">
            {match.matchReason || "No reason provided"}
          </p>
        </div>

        <hr className="my-4" />

        {/* LOST ITEM */}
        <div className="mb-4">
          <h3 className="font-semibold text-red-500">
            Lost Item
          </h3>
          <p className="text-gray-800 font-medium">
            {match.lostItemId?.title}
          </p>
          <p className="text-sm text-gray-500">
            📍 {match.lostItemId?.location}
          </p>
          <p className="text-sm text-gray-500">
            Category: {match.lostItemId?.category}
          </p>
        </div>

        {/* FOUND ITEM */}
        <div className="mb-4">
          <h3 className="font-semibold text-green-600">
            Found Item
          </h3>
          <p className="text-gray-800 font-medium">
            {match.foundItemId?.title}
          </p>
          <p className="text-sm text-gray-500">
            📍 {match.foundItemId?.location}
          </p>
          <p className="text-sm text-gray-500">
            Category: {match.foundItemId?.category}
          </p>
        </div>

        <hr className="my-4" />

        {/* STATUS */}
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <span className="font-semibold capitalize text-indigo-600">
            {match.status}
          </span>
        </div>

      </div>
    </div>
  );
};

export default MatchDetailsModal;