"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Loader from "@/components/shared/Loader";
import SuccessModal from "@/components/shared/SuccessModal";
import BuyDataPinModal from "../../../../features/data/components/BuyDataPinModal";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { UseGetBalance } from "@/hooks/useBalance";
import { UseGetCableSubscriptions } from "@/features/cable/hooks/useCable";
import { CableSubscriptionData } from "@/types/bill.types";
import { useRef } from "react";
import { BuyCable } from "@/app/actions/bills/cable/buy-cable.action";
import AddMoneyDialog from "@/components/dialog/addMoney";
import { verifyCable } from "@/app/actions/bills/cable/verify-cable.action";
import ConfirmTransferModal from "@/features/cable/components/confirmBuyCableModal";
import TransferPinModal from "@/features/cable/components/subscribePinModal";

const cable_tv_providers = [
  { value: "gotv", label: "Gotv", image: "/assets/images/cables/gotv.png" },
  { value: "startimes", label: "Startimes", image: "/assets/images/cables/startimes.png" },
  { value: "dstv", label: "Dstv", image: "/assets/images/cables/dstv.png" },
  { value: "showmax", label: "Showmax", image: "/assets/images/cables/showmax.png" },
];

export default function CablePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [smartNumber, setSmartNumber] = useState("");
  const [cable, setCable] = useState<string>("");
  const [CablesPlan, setCablesPlan] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [dataAmount, setDataAmount] = useState<number>(0);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [errors, setErrors] = useState("");

  const [CablePlan, setCablePlan] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const { data: balanceData } = UseGetBalance();
  const balance = balanceData?.data?.balance ?? 0;

  const { data: cablePlans } = UseGetCableSubscriptions(cable);
  const cablePlansData = cablePlans?.data ?? [];
  console.log(cablePlansData);

  // Reset bundle when cable changes
  useEffect(() => {
    setSelectedPlan("");
    setCablesPlan("");
    setCablePlan(false);
  }, [cable]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCablePlan(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        const { name, type } = res.data;

        setName(name);
        setType(type);
        toast.success(res.message);
        setShowConfirmModal(true);
        return;
      }

      setErrors(res?.message || "Verification failed");
      toast.error(res?.message || "Verification failed");
    } catch {
      toast.error("Network error. Try again.");
      setShowConfirmModal(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleCablePayment(pin: string) {
    const payload = {
      subscription_plan: CablesPlan,
      smartcard_number: smartNumber,
      phone_number: phoneNumber,
      cable_type: cable,
      amount: String(dataAmount),
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

        setPhoneNumber("");
        setCable("");
        setCablesPlan("");
        setSelectedPlan("");

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

  const isValid = phoneNumber.length === 11 && cable !== "" && CablesPlan !== "";

  return (
    <>
      <ConfirmTransferModal
        isOpen={showConfirmModal}
        
        bankName={bankName}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={(amount, narration) => {
          setTransferAmount(amount);
          setNarration(narration || "");
          setShowPinModal(true);
        }}
      />

      <TransferPinModal
        isOpen={showPinModal}
        onCancel={() => {
          setShowPinModal(false);
          setTransferAmount(null);
        }}
        onConfirm={(pin) => handleTransfer(pin)}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />

      <Loader show={loading} />

      <div className="min-h-screen h-fit bg-muted">
        <div className="max-w-5xl mx-auto p-0 md:p-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-secondary hover:opacity-70">
            <span className="text-lg">←</span>
            Back
          </button>

          <div className="space-y-8 ">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-primary">Buy Cable</h1>
              <button
                className="text-sm font-medium text-green-600 hover:underline"
                onClick={() => router.push("/transactions")}>
                History
              </button>
            </div>

            {/* BALANCE CARD */}
            <div className="rounded-2xl bg-linear-to-r from-primary to-secondary text-white px-8 py-6 flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Subscribe to Cable</p>
                <p className="font-semibold mt-1">Use your balance to subscribe to cable tv</p>
                <button
                  className="mt-4 bg-black text-white text-sm px-4 py-2 rounded-lg"
                  onClick={() => {
                    setOpen(true);
                  }}>
                  Add Money
                </button>
              </div>
              <div className="text-3xl font-bold">₦{balance.toLocaleString()}</div>
            </div>

            {/* FORM CARD */}
            <div className="bg-background border border-border rounded-3xl md:p-10 p-5">
              <h2 className="text-lg font-semibold text-primary mb-6">Recipient Details</h2>

              <div className="space-y-6">
                {/* Cable */}
                <div>
                  <label className="text-sm font-medium text-secondary">Cable Operator</label>
                  <div className="flex gap-6 mt-3">
                    {cable_tv_providers.map((provider) => (
                      <button
                        type="button"
                        key={provider.value}
                        onClick={() => setCable(provider.value)}
                        className={`p-2 rounded-xl ${
                          cable === provider.value ? "bg-gray-100" : ""
                        }`}>
                        <Image
                          src={provider.image}
                          alt={provider.label}
                          width={100}
                          height={100}
                          className={`${cable === provider.value ? "opacity-100" : "opacity-50"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary">Smart Card Number</label>
                  <input
                    value={smartNumber}
                    maxLength={20}
                    onChange={(e) => setSmartNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter smart card number"
                    className="w-full h-12 px-4 rounded-xl border border-border mt-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                {/* PHONE NUMBER */}
                <div>
                  <label className="text-sm font-medium text-secondary">Phone Number</label>
                  <input
                    value={phoneNumber}
                    maxLength={11}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter phone number"
                    className="w-full h-12 px-4 rounded-xl border border-border mt-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                {/* DATA BUNDLES */}
                <div>
                  <label className="text-sm font-medium text-secondary">Cable Plan</label>

                  <div ref={dropdownRef} className="mt-2">
                    <button
                      type="button"
                      onClick={() => setCablePlan((prev) => !prev)}
                      className="w-full bg-white p-3 rounded-xl border border-border text-left"
                      disabled={!cable}>
                      {selectedPlan || "Select a Cable Plan"}
                    </button>

                    {CablePlan && (
                      <div className="mt-2 bg-white border border-border rounded-xl max-h-60 overflow-y-auto shadow-sm">
                        {cablePlansData.length === 0 ? (
                          <p className="p-4 text-sm text-secondary/50">No Cable Plan available</p>
                        ) : (
                          cablePlansData.map((bundle: CableSubscriptionData) => (
                            <button
                              key={bundle.name}
                              type="button"
                              onClick={() => {
                                setSelectedPlan(bundle.name);
                                setCablesPlan(bundle.code);
                                setCablePlan(false);
                                setDataAmount(parseInt(bundle.amount));
                              }}
                              className="flex justify-between items-center text-left w-full px-4 py-3 hover:bg-gray-100 text-sm">
                              <span>{bundle.name}</span>
                              <span className="text-primary">
                                ₦{parseInt(bundle.amount).toLocaleString()}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* NEXT BUTTON */}
                <button
                  onClick={() => setShowPinModal(true)}
                  disabled={!isValid}
                  className={`w-full h-14 rounded-xl font-semibold transition ${
                    isValid
                      ? "bg-primary text-white hover:opacity-90"
                      : "bg-primary/60 text-white cursor-not-allowed"
                  }`}>
                  Next
                </button>
              </div>
            </div>
          </div>

          <AddMoneyDialog onClose={() => setOpen(false)} open={open} />
        </div>
      </div>
    </>
  );
}
