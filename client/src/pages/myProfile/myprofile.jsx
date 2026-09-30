import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Navbar from "../../components/navbar/navbar.jsx";
import { UserRound, Pencil, Lock, CheckCircle, XCircle } from "lucide-react";
import { useGetProfile, useUpdateProfile, useUpdatePassword } from "../../hooks/usersHook/useProfile.js";

// ─── Toast notification ───────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg text-white text-sm font-medium transition-all ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}>
      {type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
      {message}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}

// ─── Main Page ────────────────────────────────────────────────────────
const MyProfile = () => {
  const { data, isLoading, isError } = useGetProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: updatePassword, isPending: isChangingPw } = useUpdatePassword();

  // responseFormatter: { data: { profile, stats } }
  const profile = data?.data?.profile ?? data?.data ?? null;
  const stats   = data?.data?.stats   ?? {};

  // ── Profile form state ─────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    firstname: "", lastname: "", phone: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile]       = useState(null);
  const [editMode, setEditMode]         = useState(false);

  // ── Password form state ────────────────────────────────────────
  const [pwForm, setPwForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);

  // ── Toast state ────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setProfileForm({
        firstname: profile.firstname ?? "",
        lastname:  profile.lastname  ?? "",
        phone:     profile.phone     ?? "",
      });
    }
  }, [profile]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(
      { ...profileForm, file: imageFile || undefined },
      {
        onSuccess: () => {
          showToast("Profile updated successfully!");
          setEditMode(false);
          setImageFile(null);
        },
        onError: (err) => showToast(err.message, "error"),
      }
    );
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    updatePassword(
      {
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
        confirmPassword: pwForm.confirmPassword,
      },
      {
        onSuccess: () => {
          showToast("Password changed successfully!");
          setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        },
        onError: (err) => showToast(err.message, "error"),
      }
    );
  };

  const avatarSrc = previewImage || profile?.profileImage || null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar />
      <Sidebar />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className="flex-1 p-6 mt-10 lg:mt-0">
        <h1 className="text-3xl font-bold text-gray-700 mb-6 flex items-center gap-2">
          <UserRound size={28} /> My Profile
        </h1>

        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── Profile Card ── */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6">

            {/* Top section */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {isLoading ? (
                <Skeleton className="w-28 h-28 rounded-full" />
              ) : (
                <div className="relative">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="profile"
                      className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow object-cover"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow bg-indigo-500 text-white flex items-center justify-center text-4xl font-bold">
                      {profile?.firstname?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  {editMode && (
                    <label className="absolute bottom-0 right-0 bg-indigo-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-indigo-600 shadow">
                      <Pencil size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              )}

              <div className="text-center md:text-left">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {profile?.firstname} {profile?.lastname}
                    </h2>
                    <p className="text-gray-500">{profile?.email}</p>
                    <p className="text-sm text-gray-400 capitalize mt-1">
                      {profile?.role}
                    </p>
                  </>
                )}
                <button
                  onClick={() => setEditMode((e) => !e)}
                  className="mt-3 px-4 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm transition"
                >
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>

            <hr className="my-6" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Lost Items",  value: stats.lostItems,  bg: "bg-indigo-100", color: "text-indigo-600" },
                { label: "Found Items", value: stats.foundItems, bg: "bg-green-100",  color: "text-green-600"  },
                { label: "Claims",      value: stats.claims,     bg: "bg-yellow-100", color: "text-yellow-600" },
              ].map(({ label, value, bg, color }) => (
                <div key={label} className={`${bg} p-4 rounded-xl`}>
                  {isLoading
                    ? <Skeleton className="h-7 w-10 mx-auto" />
                    : <h3 className={`text-xl font-bold ${color}`}>{value ?? 0}</h3>
                  }
                  <p className="text-sm text-gray-600 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <hr className="my-6" />

            {/* Additional info */}
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-36" />
              </div>
            ) : (
              <div className="space-y-2 text-gray-600 text-sm">
                <p>
                  <strong>Phone:</strong>{" "}
                  {profile?.phone ?? <span className="text-gray-400">Not provided</span>}
                </p>
                <p>
                  <strong>Joined:</strong>{" "}
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                        month: "long", year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            )}
          </div>

          {/* ── Edit Profile Form ── */}
          {editMode && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-5">
                <Pencil size={20} className="text-indigo-500" />
                <h2 className="text-xl font-semibold text-gray-700">Edit Profile</h2>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.firstname}
                      onChange={(e) => setProfileForm((f) => ({ ...f, firstname: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.lastname}
                      onChange={(e) => setProfileForm((f) => ({ ...f, lastname: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Change Password Form ── */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Lock size={20} className="text-indigo-500" />
                <h2 className="text-xl font-semibold text-gray-700">Change Password</h2>
              </div>
              <button
                onClick={() => setShowPw((s) => !s)}
                className="text-sm text-indigo-500 hover:underline"
              >
                {showPw ? "Hide" : "Show form"}
              </button>
            </div>

            {showPw && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {[
                  { label: "Current Password",  key: "currentPassword",  placeholder: "Enter current password"  },
                  { label: "New Password",       key: "newPassword",      placeholder: "Min 8 chars, 1 uppercase, 1 number, 1 special" },
                  { label: "Confirm Password",   key: "confirmPassword",  placeholder: "Re-enter new password"   },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {label}
                    </label>
                    <input
                      type="password"
                      value={pwForm[key]}
                      onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                    />
                  </div>
                ))}

                {/* Password strength hint */}
                {pwForm.newPassword && (
                  <ul className="text-xs space-y-0.5 text-gray-400">
                    {[
                      { rule: pwForm.newPassword.length >= 8,        text: "At least 8 characters"    },
                      { rule: /[A-Z]/.test(pwForm.newPassword),       text: "One uppercase letter"     },
                      { rule: /[0-9]/.test(pwForm.newPassword),       text: "One number"               },
                      { rule: /[^A-Za-z0-9]/.test(pwForm.newPassword), text: "One special character"   },
                    ].map(({ rule, text }) => (
                      <li key={text} className={rule ? "text-green-500" : "text-gray-400"}>
                        {rule ? "✓" : "○"} {text}
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="submit"
                  disabled={isChangingPw}
                  className="w-full py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingPw ? "Updating…" : "Update Password"}
                </button>
              </form>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default MyProfile;