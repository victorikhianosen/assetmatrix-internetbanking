"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import Loader from "@/components/shared/Loader";
import SuccessModal from "@/components/shared/SuccessModal";
import AddMoneyDialog from "@/components/dialog/addMoney";
import ConfirmTransferModal from "@/features/cable/components/confirmBuyCableModal";
import SubscribePinModal from "@/features/cable/components/subscribePinModal";

import { UseGetBalance } from "@/hooks/useBalance";
import { verifyCable } from "@/app/actions/bills/cable/verify-cable.action";
import { BuyCable } from "@/app/actions/bills/cable/buy-cable.action";

const cable_tv_providers = [
  { value: "gotv", label: "Gotv", image: "/assets/images/cables/gotv.png" },
  { value: "startimes", label: "Startimes", image: "/assets/images/cables/startimes.png" },
  { value: "dstv", label: "Dstv", image: "/assets/images/cables/dstv.png" },
  { value: "showmax", label: "Showmax", image: "/assets/images/cables/showmax.png" },
];

export default function CablePage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [smartNumber, setSmartNumber] = useState("");
  const [cable, setCable] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const { data: balanceData } = UseGetBalance();
  const balance = balanceData?.data?.balance ?? 0;

  /* ---------------- VERIFY CABLE ---------------- */
  async function handleVerifyCable() {
    const payload = {
      smartcard_number: smartNumber,
      cable_type: cable,
    };

    try {
      setLoading(true);

      const res = await verifyCable(payload);

      const isSuccess = res?.status === "success" && res?.responseCode === "000";

      if (isSuccess) {
        setName(res.data.name);
        setType(res.data.type);
        setShowConfirmModal(true);
        toast.success(res.message);
        return;
      }

      toast.error(res?.message || "Verification failed");
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- BUY CABLE ---------------- */
  async function handleCablePayment(pin: string) {
    const payload = {
      amount: amount,
      phone_number: phoneNumber,
      smartcard_number: smartNumber,
      subscription_plan: subscriptionPlan,
      cable_type: cable,
      transaction_pin: pin,
      platform: "web",
    };

    try {
      setLoading(true);

      const res = await BuyCable(payload);

      if (res.responseCode === "000") {
        setShowPinModal(false);
        setSuccessMessage(res.message);
        setShowSuccessModal(true);

        setSmartNumber("");
        setCable("");
        setSubscriptionPlan("");
        setPhoneNumber("");

        queryClient.invalidateQueries({ queryKey: ["balance"] });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });

        return;
      }

      toast.error(res.message);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setShowPinModal(false);
    } finally {
      setLoading(false);
    }
  }

  const isValid = smartNumber.length >= 10 && cable !== "";

  return (
    <>
      <Loader show={loading} />

      <ConfirmTransferModal
        isOpen={showConfirmModal}
        name={name}
        type={type}
        cableType={cable}
        smartNumber={smartNumber}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={(data) => {
          setSubscriptionPlan(data.planCode);
          setPhoneNumber(data.phoneNumber);
          setAmount(data.amount);
          setShowConfirmModal(false);
          setShowPinModal(true);
        }}
      />

      <SubscribePinModal
        isOpen={showPinModal}
        onCancel={() => setShowPinModal(false)}
        onConfirm={(pin) => handleCablePayment(pin)}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />

      <div className="min-h-screen bg-muted">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex cursor-pointer justify-center items-center gap-2 text-sm font-medium text-secondary hover:opacity-70 w-fit">
            <span className="text-lg">←</span>
            Back
          </button>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-primary">Buy Cable</h1>
              <button
                className="text-sm font-medium text-green-600 hover:underline"
                onClick={() => router.push("/transactions")}>
                History
              </button>
            </div>
          </div>

          {/* PROMO BANNER */}
          <div className="rounded-2xl bg-linear-to-r my-10 from-primary to-secondary text-white px-8 lg:py-6 py-4 lg:flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Subscribe to Cable</p>
              <p className="font-semibold mt-1">Use your balance to subscribe to cable</p>
              <div className="text-4xl font-bold lg:hidden mt-4">₦{balance}</div>
              <button
                className="mt-4 bg-black text-white text-sm px-4 py-2 rounded-lg"
                onClick={() => {
                  setOpen(true);
                }}>
                Add Money
              </button>
            </div>

            <div className="text-4xl font-bold hidden lg:block">₦{balance.toLocaleString()}</div>
          </div>

          {/* FORM */}
          <div className="bg-background border border-border rounded-3xl p-5 md:p-10 max-w-6xl ">
            <h2 className="text-lg font-semibold text-primary mb-6">Recipient Details</h2>

            {/* Cable Type */}
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium">Cable Operator</label>
                <div className="flex lg:gap-6 gap-2.5 mt-3">
                  {cable_tv_providers.map((provider) => (
                    <button
                      key={provider.value}
                      onClick={() => setCable(provider.value)}
                      className={`p-2 rounded-xl cursor-pointer ${cable === provider.value ? "bg-gray-100" : ""}`}>
                      <Image
                        src={provider.image}
                        alt={provider.label}
                        width={100}
                        height={100}
                        className={cable === provider.value ? "opacity-100" : "opacity-50"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Smart Card */}
              <div>
                <label className="text-sm font-medium">Smart Card Number</label>
                <input
                  value={smartNumber}
                  maxLength={20}
                  onChange={(e) => setSmartNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter smart card number"
                  className="w-full h-12 px-4 rounded-xl mt-2 focus:border-primary focus:ring-primary/20 focus:ring-2 outline-none border border-secondary/50"
                />
              </div>

              <button
                onClick={handleVerifyCable}
                disabled={!isValid}
                className={`w-full h-14 rounded-xl font-semibold ${
                  isValid ? "bg-primary text-white" : "bg-primary/60 text-white cursor-not-allowed"
                }`}>
                Next
              </button>
            </div>
          </div>

          <AddMoneyDialog onClose={() => setOpen(false)} open={open} />
        </div>
      </div>
    </>
  );
}
