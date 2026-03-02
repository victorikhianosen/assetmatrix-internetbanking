"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/shared/Loader";
import { toast } from "react-toastify";
import { walletNameEnquiry } from "@/app/actions/wallet-transfer/name-enquiry.action";
import { serverLogout } from "@/app/actions/auth/login/logout.action";
import { walletTransfers } from "@/app/actions/wallet-transfer/transfer.action";
import ConfirmTransferModal from "@/features/wallet/components/ConfirmTransferModal";
import TransferPinModal from "@/features/wallet/components/TransferPinModal";
import SuccessModal from "@/components/shared/SuccessModal";
import { UseGetBalance } from "@/hooks/useBalance";
import { useQueryClient } from "@tanstack/react-query";

export default function WalletTransferPage() {
  const router = useRouter();

  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");

  const [accountNumber, setAccountNumber] = useState("");
  const bankName = "Pakasso Credit Capital Ltd";

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState<number | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const queryClient = useQueryClient();

  const { data: balanceData } = UseGetBalance();
  const balance = balanceData?.data?.balance ?? 0;

  async function handleNameEnquiry(e: React.FormEvent) {
    e.preventDefault();

    if (!account)
      return (setError("Account number is required"), toast.error("Account number is required"));

    if (account.length !== 10)
      return (
        setError("Account number must be 11 digits"),
        toast.error("Account number must be 11 digits")
      );

    const payload = {
      account_number: account,
    };

    setLoading(true);

    try {
      const res = await walletNameEnquiry(payload);

      if (res?.responseCode === "000") {
        const { first_name, last_name, account_number } = res.data;

        const name = `${first_name ?? ""} ${last_name ?? ""}`.trim();
        setFullName(name);
        setAccountNumber(account_number);
        toast.success(res.message);
        setShowConfirmModal(true);
        return;
      }

      if (res?.responseCode === "400") {
        toast.error(res.message || "Session expired");

        await serverLogout();

        router.replace("/login");
        return;
      }

      if (res?.responseCode === "401") {
        toast.error(res.message || "Session expired");

        await serverLogout();

        router.replace("/login");
        return;
      }
      setLoading(false);

      if (res?.responseCode === "422") {
        const msg = res?.errors?.account_number?.[0] || res?.message || "Invalid account number";

        setError(msg);
        toast.error(msg);
        return;
      }
      toast.error(res?.message || "Account verification failed");
      setError(res?.message);
      return;
    } catch  {
      toast.error("Unable to verify account. Try again.");
      setShowConfirmModal(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleTransfer(pin: string) {
    const payload = {
      amount: transferAmount,
      destination_account: accountNumber,
      receipient_name: fullName,
      transaction_pin: pin,
      platform: "web",
    };

    try {
      setLoading(true);
      const result = await walletTransfers(payload);
      if (result.responseCode === "000") {

        toast.info(result.message);

        setShowPinModal(false);
        setSuccessMessage(result.message);
        setShowConfirmModal(false);
        setShowSuccessModal(true);

        //invalidate queries to force a refetch
        queryClient.invalidateQueries({ queryKey: ["balance"] });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });

        return;
      }

      if (result.responseCode == "30") {
        toast.error(result.message);
        setError(result.message);
        setShowPinModal(true);
        setLoading(false);
        return;
      }
      setLoading(false);
      toast.error(result.message);
      return;
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ConfirmTransferModal
        isOpen={showConfirmModal}
        fullName={fullName}
        accountNumber={accountNumber}
        bankName={bankName}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={(amount) => {
          setTransferAmount(amount);
          setShowPinModal(true);
        }}
      />

      <TransferPinModal
        isOpen={showPinModal}
        onCancel={() => {
          setShowPinModal(false);
          setTransferAmount(null);
          setError("");
        }}
        onConfirm={(pin) => {
          handleTransfer(pin);
          setShowPinModal(false);
        }}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />

      <Loader show={loading} />
      <div className="min-h-screen bg-muted">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex cursor-pointer justify-center items-center gap-2 text-sm font-medium text-primary hover:opacity-70 w-fit">
            <span className="text-lg">←</span>
            Back
          </button>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-primary">Transfer To Pakasso Account</h1>
              <button className="text-sm font-medium text-green-600 hover:underline" onClick={() => router.push("/transactions")}>
                History
              </button>
            </div>

            {/* PROMO BANNER */}
            <div className="rounded-2xl bg-linear-to-r from-yellow-600 to-primary text-white px-8 lg:py-6 py-4 lg:flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Transfer to Other Banks</p>
                <p className="font-semibold mt-1">Use your balance to send money instantly</p>
                <div className="text-4xl font-bold lg:hidden mt-4">₦{balance.toLocaleString()}</div>
                <button className="mt-4 bg-black text-white text-sm px-4 py-2 rounded-lg">
                  Top up Now
                </button>
              </div>

              <div className="text-4xl font-bold hidden lg:block">₦{balance.toLocaleString()}</div>
            </div>

            {/* FREE TRANSFERS */}
            <div className="bg-purple-50 text-purple-700 px-4 py-3 rounded-xl text-sm font-medium w-fit">
              ⚡ Free transfers for the day: <strong>3</strong>
            </div>

            {/* FORM CARD */}
            <form
              onSubmit={handleNameEnquiry}
              className="bg-background border border-border rounded-3xl p-5 lg:p-10 max-w-6xl">
              <h2 className="text-lg font-semibold text-primary mb-6">Recipient Account</h2>

              <div className="space-y-5">
                {/* ACCOUNT NUMBER */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-primary">Account Number</label>
                  <input
                    value={account}
                    maxLength={10}
                    onChange={(e) => setAccount(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 10-digit account number"
                    className="w-full h-12 px-4 rounded-xl border border-border
                focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                </div>

                {/* {fullName} */}

                {/* NEXT BUTTON */}
                <button
                  className={`w-full cursor-pointer h-14 rounded-full font-semibold transition bg-primary text-white
                `}>
                  Next
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}
