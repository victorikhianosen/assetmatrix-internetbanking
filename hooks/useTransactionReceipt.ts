import { useQuery } from "@tanstack/react-query";
import { fetchTransactionReceipt } from "@/lib/api/get-transaction-receipt";
import { TransactionReceipt } from "@/types/transaction.types";

export const UseGetTransactionReceipt = (referenceNo: string) => {
  return useQuery<TransactionReceipt>({
    queryKey: ["transaction-receipt", referenceNo],
    queryFn: () => fetchTransactionReceipt(referenceNo),
    enabled: !!referenceNo,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000, 
  });
};
