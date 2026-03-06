import { useQuery } from "@tanstack/react-query";
import {fetchCable} from "@/features/cable/services/get-cable";
import { CableSubscription } from "@/types/bill.types";

export const UseGetCableSubscriptions = (cable: string) => {
  return useQuery<CableSubscription>({
    queryKey: ["cable-subscriptions", cable],
    queryFn: () => fetchCable(cable),
    staleTime: 10 * 60 * 1000, 
  });
};