import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails } from "@/lib/api/get-user-details";


export const UseGetUserDetails = (enabled: boolean = true) => {
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("access_token");
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUserDetails,
    enabled: enabled && hasToken,
    staleTime: 20 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};
