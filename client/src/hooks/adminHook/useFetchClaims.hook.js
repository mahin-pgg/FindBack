import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";

const fetchClaims = async ({ status, page = 1, limit = 10 }) => {
  const token = Cookies.get("token");

  // build query string
  const params = new URLSearchParams();

  if (status) params.append("status", status);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}claims`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    throw new Error(
      err.message || "Failed to fetch claims"
    );
  }

  return res.json();
};

export const useGetClaims = (filters = {}) => {
  return useQuery({
    queryKey: ["adminClaims", filters],
    queryFn: () => fetchClaims(filters),
    staleTime: 30 * 1000,
  });
};