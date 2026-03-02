"use client";

import QuickAction from "../../../components/dasboard Components/QuickAction";
import BalanceCard from "../../../components/dasboard Components/BalanceCard";
import AccountLimit from "../../../components/dasboard Components/AccountLimit";
import RecentTransaction from "../../../components/dasboard Components/RecentTransaction";
import { UseGetBalance } from "@/hooks/useBalance";
import { useGetTransactions } from "@/hooks/useTransactions";
import { TransactionItem } from "@/types/transaction.types";

export default function DashboardPage() {
  const { data: balanceData, isLoading: balanceLoading } = UseGetBalance();

  const { data: transactionData, isLoading: trxLoading } = useGetTransactions();

  const balance = balanceData?.data?.balance ?? 0;

  const transactions: TransactionItem[] = transactionData?.data?.transactions ?? [];

  return (
    <div className="space-y-8">
      <BalanceCard balance={String(balance)} loading={balanceLoading} />

      <QuickAction />

      <AccountLimit transactions={transactions} />

      <RecentTransaction transactions={transactions} loading={trxLoading} />
    </div>
  );
}