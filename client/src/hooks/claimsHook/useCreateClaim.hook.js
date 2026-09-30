import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createClaim = async (payload) => {
  const token = Cookies.get("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}claims`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    throw new Error(
      err.message || "Failed to create claim"
    );
  }

  return res.json();
};

export const useCreateClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClaim,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myClaims"],
      });

      queryClient.invalidateQueries({
        queryKey: ["myMatches"],
      });
    },
  });
};