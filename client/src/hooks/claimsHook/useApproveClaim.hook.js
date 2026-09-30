import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const approveClaim = async ({ id, reviewNote }) => {
  const token = Cookies.get("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}claims/${id}/approve`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        reviewNote,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    throw new Error(err.message || "Failed to approve claim");
  }

  return res.json();
};

export const useApproveClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveClaim,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myClaims"],
      });
    },
  });
};