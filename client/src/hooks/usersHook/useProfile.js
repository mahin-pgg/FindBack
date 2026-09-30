import Cookies from "js-cookie";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ── GET /users/profile ────────────────────────────────────────────────
const fetchProfile = async () => {
  const token = Cookies.get("token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}users/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch profile");
  }

  return res.json();
  // shape: { data: { profile: User, stats: { lostItems, foundItems, claims } } }
};

export function useGetProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn:  fetchProfile,
    staleTime: 60 * 1000,
  });
}

// ── PATCH /users/profile ──────────────────────────────────────────────
const updateProfile = async (payload) => {
  const token = Cookies.get("token");

  // Use FormData if a file is included
  let body;
  let headers = { Authorization: `Bearer ${token}` };

  if (payload.file) {
    const form = new FormData();
    // multer is configured as upload.single("image") — field name must match
    form.append("image", payload.file);
    if (payload.firstname) form.append("firstname", payload.firstname);
    if (payload.lastname)  form.append("lastname",  payload.lastname);
    if (payload.phone !== undefined) form.append("phone", payload.phone ?? "");
    body = form;
  } else {
    headers["Content-Type"] = "application/json";
    const { file, ...rest } = payload;
    body = JSON.stringify(rest);
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}users/profile`, {
    method: "PATCH",
    headers,
    body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update profile");
  }

  return res.json();
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["userDashboard"] });
    },
  });
}

// ── PATCH /users/password ─────────────────────────────────────────────
const updatePassword = async (payload) => {
  const token = Cookies.get("token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}users/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update password");
  }

  return res.json();
};

export function useUpdatePassword() {
  return useMutation({
    mutationFn: updatePassword,
  });
}