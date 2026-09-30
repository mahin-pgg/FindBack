import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";

const fetchMyMatches = async () => {
  const token = Cookies.get("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}matches/my`,
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
    throw new Error(err.message || "Failed to fetch matches");
  }

  return res.json();
};

export const useGetMyMatches = () => {
  return useQuery({
    queryKey: ["myMatches"],
    queryFn: fetchMyMatches,
  });
};