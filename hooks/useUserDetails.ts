import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails } from "@/lib/api/get-user-details";


export const UseGetUserDetails = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUserDetails,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 20 * 60 * 1000, // 20 minutes,
    gcTime: 20 * 60 * 1000,
  });
};
