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
import { useGetDataBundles } from "@/features/data/hooks/useDataBundle";
import { DataBundleData } from "@/types/bill.types";
import { useRef } from "react";
import { buyData } from "@/app/actions/bills/data/buy-data.action";

const DataProviders = [
  { value: "mtn", label: "MTN", image: "/assets/images/airtime-data/mtn.png" },
  { value: "airtel", label: "Airtel", image: "/assets/images/airtime-data/airtel.png" },
  { value: "glo", label: "GLO", image: "/assets/images/airtime-data/glo.png" },
  { value: "etisalat", label: "9Mobile", image: "/assets/images/airtime-data/9mobile.png" },
];

export default function DataPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [network, setNetwork] = useState<string>("");
  const [networkBundle, setNetworkBundle] = useState<string>("");
  const [selectedBundle, setSelectedBundle] = useState("");
  const [dataAmount, setDataAmount] = useState<number>(0);

  const [showDataBundles, setShowDataBundles] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const { data: balanceData } = UseGetBalance();
  const balance = balanceData?.data?.balance ?? 0;

  const { data: dataBundlesData } = useGetDataBundles(network);
  const dataBundles = dataBundlesData?.data ?? [];

  // Reset bundle when network changes
  useEffect(() => {
    setSelectedBundle("");
    setNetworkBundle("");
    setShowDataBundles(false);
  }, [network]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDataBundles(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleTransfer(pin: string) {
    const payload = {
      data_plan: networkBundle,
      phone_number: phoneNumber,
      network_provider: network,
      amount: dataAmount,
      transaction_pin: pin,
      platform: "web",
    };


    try {
      setLoading(true);

      const res = await buyData(payload);

      if (res.responseCode === "000") {
        setShowPinModal(false);
        setSuccessMessage(res.message);
        setShowSuccessModal(true);

        setPhoneNumber("");
        setNetwork("");
        setNetworkBundle("");
        setSelectedBundle("");

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

  const isValid = phoneNumber.length === 11 && network !== "" && networkBundle !== "";

  return (
    <>
      <BuyDataPinModal
        isOpen={showPinModal}
        onCancel={() => setShowPinModal(false)}
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
            className="flex items-center gap-2 text-sm font-medium text-primary hover:opacity-70">
            <span className="text-lg">←</span>
            Back
          </button>

          <div className="space-y-8 mt-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-primary">Buy Data</h1>
              <button
                className="text-sm font-medium text-green-600 hover:underline"
                onClick={() => router.push("/transactions")}>
                History
              </button>
            </div>

            {/* BALANCE CARD */}
            <div className="rounded-2xl bg-linear-to-r from-yellow-600 to-primary text-white px-8 py-6 flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Use your balance to purchase data</p>
                <button className="mt-4 bg-black text-white text-sm px-4 py-2 rounded-lg">
                  Top up Now
                </button>
              </div>
              <div className="text-3xl font-bold">₦{balance.toLocaleString()}</div>
            </div>

            {/* FORM CARD */}
            <div className="bg-background border border-border rounded-3xl md:p-10 p-5">
              <h2 className="text-lg font-semibold text-primary mb-6">Recipient Details</h2>

              <div className="space-y-6">
                {/* NETWORK */}
                <div>
                  <label className="text-sm font-medium text-primary">Mobile Operator</label>
                  <div className="flex gap-6 mt-3">
                    {DataProviders.map((provider) => (
                      <button
                        type="button"
                        key={provider.value}
                        onClick={() => setNetwork(provider.value)}
                        className={`p-2 rounded-xl ${
                          network === provider.value ? "bg-gray-100" : ""
                        }`}>
                        <Image
                          src={provider.image}
                          alt={provider.label}
                          width={50}
                          height={50}
                          className={`${
                            network === provider.value ? "opacity-100 scale-110" : "opacity-50"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* PHONE NUMBER */}
                <div>
                  <label className="text-sm font-medium text-primary">Phone Number</label>
                  <input
                    value={phoneNumber}
                    maxLength={11}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 11-digit phone number"
                    className="w-full h-12 px-4 rounded-xl border border-border mt-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                {/* DATA BUNDLES */}
                <div>
                  <label className="text-sm font-medium text-primary">Data Bundles</label>

                  <div ref={dropdownRef} className="mt-2">
                    <button
                      type="button"
                      onClick={() => setShowDataBundles((prev) => !prev)}
                      className="w-full bg-white p-4 rounded-xl border border-border text-left"
                      disabled={!network}>
                      {selectedBundle || "Select a bundle"}
                    </button>

                    {showDataBundles && (
                      <div className="mt-2 bg-white border border-border rounded-xl max-h-60 overflow-y-auto shadow-sm">
                        {dataBundles.length === 0 ? (
                          <p className="p-4 text-sm text-gray-500">No bundles available</p>
                        ) : (
                          dataBundles.map((bundle: DataBundleData) => (
                            <button
                              key={bundle.name}
                              type="button"
                              onClick={() => {
                                setSelectedBundle(bundle.name);
                                setNetworkBundle(bundle.variation_code);
                                setShowDataBundles(false);
                                setDataAmount(parseInt(bundle.variation_amount));
                              }}
                              className="flex justify-between items-center text-left w-full px-4 py-3 hover:bg-gray-100 text-sm">
                              <span>{bundle.name}</span>
                              <span className="text-yellow-600">
                                ₦{parseInt(bundle.variation_amount).toLocaleString()}
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
                  className={`w-full h-14 rounded-full font-semibold transition ${
                    isValid
                      ? "bg-primary text-white hover:opacity-90"
                      : "bg-primary/60 text-white cursor-not-allowed"
                  }`}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
