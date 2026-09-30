import React, { useState, useEffect } from "react";
import { UserRound, Pencil, Lock, CheckCircle, XCircle } from "lucide-react";
import AdminSidebar from "../../components/sidebar/adminsidebar.jsx";
import AdminNavbar from "../../components/navbar/Adminnavbar.jsx";
import {
  useGetProfile,
  useUpdateProfile,
  useUpdatePassword,
} from "../../hooks/usersHook/useProfile.js";

// ─── Toast ────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg text-white text-sm font-medium transition-all ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
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
const AdminProfile = () => {
  const { data, isLoading, isError } = useGetProfile();
  const { mutate: updateProfile,  isPending: isUpdating   } = useUpdateProfile();
  const { mutate: updatePassword, isPending: isChangingPw } = useUpdatePassword();

  // responseFormatter: { data: { profile, stats } }
  const profile = data?.data?.profile ?? data?.data ?? null;
  const stats   = data?.data?.stats   ?? {};

  // ── Profile form ───────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    firstname: "", lastname: "", phone: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile]       = useState(null);

  // ── Password form ──────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });

  // ── Toast ──────────────────────────────────────────────────────
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
        onSuccess: () => showToast("Profile updated successfully!"),
        onError:   (err) => showToast(err.message, "error"),
      }
    );
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    updatePassword(pwForm, {
      onSuccess: () => {
        showToast("Password updated successfully!");
        setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      },
      onError: (err) => showToast(err.message, "error"),
    });
  };

  const avatarSrc      = previewImage || profile?.profileImage || null;
  const initials       = `${profile?.firstname?.[0] ?? ""}${profile?.lastname?.[0] ?? ""}`.toUpperCase();

  // member since — years of experience
  const memberSince    = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";
  const yearsActive    = profile?.createdAt
    ? Math.max(1, new Date().getFullYear() - new Date(profile.createdAt).getFullYear())
    : "—";

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-100 to-gray-200">
      {/* Navbar */}
      <AdminNavbar />
      
      {/* Sidebar */}
      <AdminSidebar />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <main className="flex-1 p-6">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-700 mb-6">
          <UserRound size={28} /> Admin Profile
        </h1>

        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── Profile Card ── */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">

              {/* Avatar */}
              {isLoading ? (
                <Skeleton className="w-36 h-36 rounded-full shrink-0" />
              ) : (
                <div className="relative shrink-0">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="admin"
                      className="w-36 h-36 rounded-full object-cover shadow-lg border-4 border-indigo-500"
                    />
                  ) : (
                    <div className="w-36 h-36 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                      {initials || "A"}
                    </div>
                  )}
                  {/* Image upload trigger */}
                  <label className="absolute bottom-1 right-1 bg-indigo-500 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-600 shadow transition">
                    <Pencil size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}

              {/* Details */}
              <div className="flex-1 text-center md:text-left">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-700">
                      {profile?.firstname} {profile?.lastname}
                    </h2>
                    <p className="text-gray-500 mt-1">{profile?.email}</p>
                    {profile?.phone && (
                      <p className="text-gray-400 text-sm mt-0.5">📞 {profile.phone}</p>
                    )}
                    <p className="text-sm text-indigo-500 font-medium mt-1 capitalize">
                      🛡 {profile?.role}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Member since {memberSince}
                    </p>
                  </>
                )}

                {/* Admin stats */}
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {isLoading ? (
                    [1, 2, 3].map((n) => (
                      <Skeleton key={n} className="h-20 rounded-xl" />
                    ))
                  ) : (
                    <>
                      <div className="bg-indigo-50 p-4 rounded-xl text-center">
                        <h3 className="text-xl font-bold text-indigo-600">
                          {stats.managedItems ?? 0}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Managed Items</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-xl text-center">
                        <h3 className="text-xl font-bold text-green-600">
                          {stats.approvedClaims ?? 0}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Approved Claims</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-xl text-center">
                        <h3 className="text-xl font-bold text-yellow-500">
                          {yearsActive} yr{yearsActive > 1 ? "s" : ""}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Experience</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Edit Profile Form ── */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow p-8">
            <div className="flex items-center gap-2 mb-6">
              <Pencil size={20} className="text-indigo-500" />
              <h2 className="text-xl font-semibold text-gray-700">Edit Profile</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.firstname}
                    onChange={(e) => setProfileForm((f) => ({ ...f, firstname: e.target.value }))}
                    placeholder="First name"
                    className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
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
                    placeholder="Last name"
                    className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
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
                  placeholder="+91 9876543210"
                  className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>

              {/* Role is read-only — never editable */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value="Administrator"
                  readOnly
                  className="w-full p-3 rounded-xl border bg-gray-100 text-gray-400 cursor-not-allowed text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm font-medium"
              >
                {isUpdating ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>

          {/* ── Security / Password ── */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow p-8">
            <div className="flex items-center gap-2 mb-6">
              <Lock size={20} className="text-red-500" />
              <h2 className="text-xl font-semibold text-gray-700">Security Settings</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {[
                { label: "Current Password",  key: "currentPassword",  placeholder: "Enter current password"                          },
                { label: "New Password",       key: "newPassword",      placeholder: "Min 8 chars, 1 uppercase, 1 number, 1 special"    },
                { label: "Confirm Password",   key: "confirmPassword",  placeholder: "Re-enter new password"                           },
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
                    className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                  />
                </div>
              ))}

              {/* Live strength checklist */}
              {pwForm.newPassword && (
                <ul className="text-xs space-y-0.5">
                  {[
                    { rule: pwForm.newPassword.length >= 8,         text: "At least 8 characters"  },
                    { rule: /[A-Z]/.test(pwForm.newPassword),        text: "One uppercase letter"   },
                    { rule: /[0-9]/.test(pwForm.newPassword),        text: "One number"             },
                    { rule: /[^A-Za-z0-9]/.test(pwForm.newPassword), text: "One special character"  },
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
                className="px-6 py-3 bg-red-500 text-white rounded-xl shadow hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isChangingPw ? "Updating…" : "Update Password"}
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminProfile;