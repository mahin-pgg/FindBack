import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";

const runMatch = async ({ itemId, body }) => {
  const token = Cookies.get("token");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}matches/run/${itemId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body || {}), // optional body
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to run match");
  }

  return data;
};

export function useRunMatch() {
  return useMutation({
    mutationFn: runMatch,
  });
}