import React from "react";
import AdminSidebar from "../../components/sidebar/adminsidebar";
import AdminNavbar from "../../components/navbar/Adminnavbar.jsx";

import { useAnalyticsOverview } from "../../hooks/adminHook/useAnalyticsOverview";

const AnalyticsOverview = () => {
  const { data, isLoading, error } = useAnalyticsOverview();

  const analytics = data?.data?.analytics;
  const stats = data?.data?.stats;

  if (isLoading) {
    return <p className="p-6">Loading analytics...</p>;
  }

  if (error) {
    return (
      <p className="p-6 text-red-500">
        {error.message || "Failed to load analytics"}
      </p>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Navbar */}
      <AdminNavbar />
      
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main */}
      <main className="flex-1 p-6">

        <h1 className="text-3xl font-bold text-gray-700 mb-6">
          📈 Analytics Overview
        </h1>

        {/* ================= TOP CARDS ================= */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow text-center">
            <h2 className="text-3xl font-bold text-red-500">
              {stats?.lostItems || 0}
            </h2>
            <p className="text-gray-500 mt-2">Lost Items</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow text-center">
            <h2 className="text-3xl font-bold text-green-500">
              {stats?.foundItems || 0}
            </h2>
            <p className="text-gray-500 mt-2">Found Items</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow text-center">
            <h2 className="text-3xl font-bold text-indigo-500">
              {stats?.approvedClaims || 0}
            </h2>
            <p className="text-gray-500 mt-2">Claims Approved</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow text-center">
            <h2 className="text-3xl font-bold text-yellow-500">
              {analytics?.recoveryRate || 0}%
            </h2>
            <p className="text-gray-500 mt-2">Recovery Rate</p>
          </div>

        </div>

        {/* ================= PERFORMANCE BARS ================= */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow mb-8">

          <h2 className="text-xl font-semibold mb-6">
            📊 Monthly Performance
          </h2>

          <div className="space-y-5">

            {/* Lost Reports */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Lost Reports</span>
                <span className="font-semibold">
                  {analytics?.lostPercent || 0}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full"
                  style={{
                    width: `${analytics?.lostPercent || 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Found Reports */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Found Reports</span>
                <span className="font-semibold">
                  {analytics?.foundPercent || 0}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{
                    width: `${analytics?.foundPercent || 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Claim Success */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Claim Success</span>
                <span className="font-semibold">
                  {analytics?.claimPercent || 0}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-indigo-500 h-3 rounded-full"
                  style={{
                    width: `${analytics?.claimPercent || 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* User Satisfaction */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">User Satisfaction</span>
                <span className="font-semibold">
                  {analytics?.userSatisfaction || 0}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full"
                  style={{
                    width: `${analytics?.userSatisfaction || 0}%`,
                  }}
                ></div>
              </div>
            </div>

          </div>
        </div>

        {/* ================= RECENT ANALYTICS ================= */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* Most Lost Items */}
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow">

            <h2 className="text-xl font-semibold mb-4">
              🏆 Most Lost Items
            </h2>

            <ul className="space-y-3 text-gray-600">

              {analytics?.mostLostItems?.length > 0 ? (
                analytics.mostLostItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between"
                  >
                    <span>{item.name}</span>
                    <span className="font-bold">{item.count}</span>
                  </li>
                ))
              ) : (
                <p>No lost item analytics available.</p>
              )}

            </ul>
          </div>

          {/* Hotspot Locations */}
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow">

            <h2 className="text-xl font-semibold mb-4">
              📍 Hotspot Locations
            </h2>

            <ul className="space-y-3 text-gray-600">

              {analytics?.hotspotLocations?.length > 0 ? (
                analytics.hotspotLocations.map((location, index) => (
                  <li
                    key={index}
                    className="flex justify-between"
                  >
                    <span>{location.name}</span>
                    <span className="font-bold">
                      {location.count}
                    </span>
                  </li>
                ))
              ) : (
                <p>No hotspot data available.</p>
              )}

            </ul>
          </div>

        </div>

        {/* ================= INSIGHTS SUMMARY ================= */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            📌 Insights Summary
          </h2>

          <div className="space-y-3 text-gray-600">

            {analytics?.insights?.length > 0 ? (
              analytics.insights.map((insight, index) => (
                <p key={index}>✔ {insight}</p>
              ))
            ) : (
              <p>No insights available.</p>
            )}

          </div>
        </div>

      </main>
    </div>
  );
};

export default AnalyticsOverview;