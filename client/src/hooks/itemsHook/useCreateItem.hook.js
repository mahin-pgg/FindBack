import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

const createItem = async (formData) => {
  const token = Cookies.get("token");

  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}items`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Accept options so callers can pass their own onSuccess / onError
export function useCreateItem(options = {}) {
  return useMutation({
    mutationFn: createItem,
    ...options, // spreads onSuccess, onError, etc. from the caller
  });
}