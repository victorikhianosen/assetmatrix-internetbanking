import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@/lib/api/get-transaction";

/**
 * TRANSACTION QUERY
 * - No polling
 * - Refetch only on focus
 */

export const useGetTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000, // 5 minutes,
  });
};
