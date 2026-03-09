"use client";

import { useState, useEffect, useRef } from "react";

import { UseGetCableSubscriptions } from "@/features/cable/hooks/useCable";
import { CableSubscriptionData } from "@/types/bill.types";
import { UseGetBalance } from "@/hooks/useBalance";

type ConfirmTransferModalProps = {
  isOpen: boolean;
  name: string;
  type: string;
  cableType: string;
  smartNumber: string;
  onCancel: () => void;
  onConfirm: (data: {
    planName: string;
    planCode: string;
    phoneNumber: string;
    amount: string;
  }) => void;
};

export default function ConfirmTransferModal({
  isOpen,
  name,
  type,
  cableType,
  smartNumber,
  onCancel,
  onConfirm,
}: ConfirmTransferModalProps) {
  const { data: balanceData } = UseGetBalance();
  const balance = Number(balanceData?.data?.balance ?? 0);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedPlan, setSelectedPlan] = useState("");
  const [planCode, setPlanCode] = useState("");
  const [amount, setAmount] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPlans, setShowPlans] = useState(false);
  const [errors, setErrors] = useState("");

  const formattedAmount = Number(amount);

  /* ---------------- FETCH PLANS ---------------- */
  const { data: cablePlans, isLoading } = UseGetCableSubscriptions(cableType);
  const cablePlansData = cablePlans?.data ?? [];

  /* ---------------- RESET WHEN CLOSED ---------------- */
  useEffect(() => {
    if (!isOpen) {
      setSelectedPlan("");
      setPlanCode("");
      setAmount("");
      setPhoneNumber("");
      setErrors("");
    }
  }, [isOpen]);

  /* ---------------- CLOSE DROPDOWN ---------------- */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPlans(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (formattedAmount) {
      setErrors("");
      return;
    }

    if (formattedAmount > balance) {
      setErrors("Insufficient balance");
    } else {
      setErrors("");
    }
  }, [formattedAmount, balance]);

  /* ---------------- VALIDATION ---------------- */
  const isValid =
    selectedPlan !== "" && phoneNumber.length === 11 && /^\d+$/.test(phoneNumber) && !errors && formattedAmount < balance;

  const handleContinue = () => {
    if (!isValid) {
      setErrors("Please select a plan and enter a valid phone number");
      return;
    }

    onConfirm({
      planName: selectedPlan,
      planCode: planCode,
      phoneNumber: phoneNumber,
      amount: amount,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8">
        <h3 className="text-lg font-semibold text-primary mb-6">Confirm Subscription</h3>

        {/* VERIFIED INFO */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-4">
          <div>
            <p className="text-xs text-gray-500">Subscriber Name</p>
            <p className="font-semibold text-green-600">{name}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Cable Type</p>
            <p className="font-mono">{type}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Smart Card</p>
            <p className="font-mono">{smartNumber}</p>
          </div>
        </div>

        {/* CABLE PLAN */}
        <div className="mb-5">
          <label className="text-sm font-medium">Select Cable Plan</label>

          <div ref={dropdownRef} className="mt-2">
            <button
              type="button"
              onClick={() => setShowPlans((prev) => !prev)}
              className="w-full bg-white p-3 rounded-xl text-left border border-secondary/50 focus:border-primary focus:ring-primary/20 focus:ring-2 outline-none">
              {selectedPlan || "Select a Cable Plan"}
            </button>

            {showPlans && (
              <div className="mt-2 bg-white border rounded-xl max-h-60 overflow-y-auto shadow-sm">
                {/* LOADING STATE */}
                {isLoading && (
                  <div className="flex justify-center items-center p-6">
                    <div className="h-6 w-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* PLANS */}
                {!isLoading && cablePlansData.length === 0 && (
                  <p className="p-4 text-sm text-gray-500">No plans available</p>
                )}

                {!isLoading &&
                  cablePlansData.map((plan: CableSubscriptionData) => (
                    <button
                      key={plan.code}
                      type="button"
                      onClick={() => {
                        setSelectedPlan(plan.name);
                        setPlanCode(plan.code);
                        setAmount(plan.amount);
                        setShowPlans(false);
                      }}
                      className="flex justify-between items-center w-full px-4 py-3 hover:bg-gray-100 text-sm">
                      <span>{plan.name}</span>
                      <span className="font-semibold">
                        ₦{parseInt(plan.amount).toLocaleString()}
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* PHONE NUMBER */}
        <div className="mb-6">
          <label className="text-sm font-medium">Phone Number</label>
          <input
            value={phoneNumber}
            maxLength={11}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter phone number"
            className="w-full h-12 px-4 rounded-xl mt-2 border border-secondary/50 focus:border-primary focus:ring-primary/20 focus:ring-2 outline-none"
          />
        </div>

        {errors && <p className="text-sm text-red-600 mb-4">{errors}</p>}

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button onClick={onCancel} className="w-1/2 border cursor-pointer rounded-xl h-12">
            Cancel
          </button>

          <button
            onClick={handleContinue}
            disabled={!isValid}
            className={`w-1/2 rounded-xl h-12 font-semibold cursor-pointer
              ${
                !isValid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white hover:opacity-90"
              }`}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
