import { useQuery } from "@tanstack/react-query";
import { fetchBalance } from "@/lib/api/get-balance";
import { GetBalance } from "@/types/transaction.types";

export const UseGetBalance = () => {
  return useQuery<GetBalance>({
    queryKey: ["balance"],
    queryFn: fetchBalance,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: 20000,
  });
};