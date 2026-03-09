"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import Loader from "@/components/shared/Loader";
import SuccessModal from "@/components/shared/SuccessModal";
import BuyAirtimePinModal from "../../../../features/data/components/BuyDataPinModal";
import { toast } from "react-toastify";
import { buyAirtime } from "@/app/actions/bills/airtime/buy-airtime.action";
import { UseGetBalance } from "@/hooks/useBalance";
import AddMoneyDialog from "@/components/dialog/addMoney";

const airtimeProviders = [
  { value: "mtn", label: "MTN", image: "/assets/images/airtime-data/mtn.png" },
  { value: "airtel", label: "Airtel", image: "/assets/images/airtime-data/airtel.png" },
  { value: "glo", label: "GLO", image: "/assets/images/airtime-data/glo.png" },
  { value: "etisalat", label: "9Mobile", image: "/assets/images/airtime-data/9mobile.png" },
];

export default function AirtimePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [open, setOpen] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [network, setNetwork] = useState<string>("");
  const [airtimeAmount, setAirtimeAmount] = useState<number | null>(null);

  const [showPinModal, setShowPinModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { data: balanceData } = UseGetBalance();
  const balance = Number(balanceData?.data?.balance ?? 0);

  /* ---------------- AMOUNT VALIDATION ---------------- */

  function handleAmountChange(value: string) {
    const amount = Number(value.replace(/\D/g, ""));

    setAirtimeAmount(amount);

    if (!amount) {
      setErrors("");
      return;
    }

    if (amount < 100) {
      setErrors("Minimum airtime purchase is ₦100");
      return;
    }

    if (amount > balance) {
      setErrors("Insufficient balance");
      return;
    }

    setErrors("");
  }

  /* ---------------- PURCHASE ---------------- */

  async function handleTransfer(pin: string) {
    if (!airtimeAmount || airtimeAmount < 100) {
      toast.error("Amount must be at least ₦100");
      return;
    }

    if (airtimeAmount > balance) {
      toast.error("Insufficient balance");
      return;
    }

    const payload = {
      amount: airtimeAmount,
      phone_number: phoneNumber,
      network_provider: network,
      transaction_pin: pin,
      platform: "web",
    };

    try {
      setLoading(true);

      const res = await buyAirtime(payload);

      if (res.responseCode === "000" && res.status === "success") {
        setShowPinModal(false);
        setSuccessMessage(res.message);
        setShowSuccessModal(true);

        setNetwork("");
        setPhoneNumber("");
        setAirtimeAmount(null);
        setErrors("");

        queryClient.invalidateQueries({ queryKey: ["balance"] });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });

        return;
      }

      toast.error(res.message);
      setShowPinModal(false);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- VALIDATION ---------------- */

  const isValid =
    network.length > 0 &&
    phoneNumber.length === 11 &&
    airtimeAmount !== null &&
    airtimeAmount >= 100 &&
    airtimeAmount <= balance &&
    !errors;

  return (
    <>
      <BuyAirtimePinModal
        isOpen={showPinModal}
        onCancel={() => {
          setShowPinModal(false);
          setAirtimeAmount(null);
          setPhoneNumber("");
          setNetwork("");
        }}
        onConfirm={(pin) => handleTransfer(pin)}
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
            className="flex cursor-pointer justify-center items-center gap-2 text-sm font-medium text-secondary hover:opacity-70 w-fit"
          >
            <span className="text-lg">←</span>
            Back
          </button>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-primary">Buy Airtime</h1>
              <button
                className="text-sm font-medium text-green-600 hover:underline"
                onClick={() => router.push("/transactions")}
              >
                History
              </button>
            </div>

            {/* BALANCE BANNER */}
            <div className="rounded-2xl bg-linear-to-r from-primary to-secondary text-white px-8 lg:py-6 py-4 lg:flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Purchase Airtime</p>
                <p className="font-semibold mt-1">
                  Use your balance to buy airtime instantly
                </p>

                <div className="text-4xl font-bold lg:hidden mt-4">
                  ₦{balance.toLocaleString()}
                </div>

                <button
                  className="mt-4 bg-black text-white text-sm px-4 py-2 rounded-lg"
                  onClick={() => setOpen(true)}
                >
                  Add Money
                </button>
              </div>

              <div className="text-4xl font-bold hidden lg:block">
                ₦{balance.toLocaleString()}
              </div>
            </div>

            {/* FORM */}
            <div className="bg-background border border-border rounded-3xl p-5 md:p-10 max-w-6xl">
              <h2 className="text-lg font-semibold text-primary mb-6">
                Recipient Details
              </h2>

              <div className="space-y-5">

                {/* NETWORK */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-secondary">
                    Mobile Operator
                  </label>

                  <div className="flex gap-7.5 mt-2">
                    {airtimeProviders.map((provider) => (
                      <button
                        key={provider.value}
                        onClick={() => setNetwork(provider.value)}
                        className={`flex items-center gap-2 text-sm font-medium text-primary cursor-pointer ${
                          network === provider.value ? "bg-gray-100" : ""
                        }`}
                      >
                        <Image
                          src={provider.image}
                          alt={provider.label}
                          width={50}
                          height={50}
                          className={`${
                            network === provider.value
                              ? "opacity-100 scale-110"
                              : "opacity-50"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* PHONE */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-secondary">
                    Phone Number
                  </label>

                  <input
                    value={phoneNumber}
                    maxLength={11}
                    onChange={(e) =>
                      setPhoneNumber(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Enter 11-digit phone number"
                    className="w-full h-12 px-4 rounded-xl mt-2 border border-secondary/50 focus:border-primary focus:ring-primary/20 focus:ring-2 outline-none"
                  />
                </div>

                {/* AMOUNT */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-secondary">
                    Amount
                  </label>

                  <input
                    value={airtimeAmount || ""}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full h-12 px-4 rounded-xl mt-2 border border-secondary/50 focus:border-primary focus:ring-primary/20 focus:ring-2 outline-none"
                  />

                  {errors && (
                    <p className="text-red-600 text-sm">{errors}</p>
                  )}
                </div>

                {/* NEXT BUTTON */}
                <button
                  onClick={() => setShowPinModal(true)}
                  disabled={!isValid}
                  className={`w-full h-14 rounded-xl font-semibold transition
                  ${
                    isValid
                      ? "bg-primary text-white hover:opacity-90 cursor-pointer"
                      : "bg-primary/60 text-white cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>

            <AddMoneyDialog onClose={() => setOpen(false)} open={open} />
          </div>
        </div>
      </div>
    </>
  );
}