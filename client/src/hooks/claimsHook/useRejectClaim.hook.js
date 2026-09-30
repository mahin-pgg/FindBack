import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const rejectClaim = async ({ id, reviewNote }) => {
  const token = Cookies.get("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}claims/${id}/reject`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reviewNote }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to reject claim");
  }

  return res.json();
};

export const useRejectClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectClaim,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myClaims"],
      });
    },
  });
};