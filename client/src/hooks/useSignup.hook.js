import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

// Simulated function to post data to an API endpoint
const createUser = async ({ user, admin = false }) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (admin) {
        const token = Cookies.get("token");
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}${admin ? "users/admin/create" : "users/create"}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export function useSignup() {
   return useMutation({
        mutationFn: ({ user, admin = false }) => createUser({ user, admin }),
         onSuccess: (response) => {
            // This callback is triggered if the mutation is successful
            console.log("User Created Successfully", response);
            },
            onError: (error) => {
            // Handle error case
            console.error("Error creating user:", error);
            },
    });
}
