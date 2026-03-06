"use client";

import { ArrowLeft, House } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UseGetTransactionReceipt } from "@/hooks/useTransactionReceipt";
import { formatDateTime } from "@/utils/formatDateTime";
import { formatNumber } from "@/utils/formatNumber";
import successAnimation from "@/public/assets/animations/success.json";
import failedAnimation from "@/public/assets/animations/Failed.json";
import processingAnimation from "@/public/assets/animations/loading.json";
import Lottie from "lottie-react";
import { ReceiptSkeleton } from "@/components/loading components/receiptSkeleton";

export default function ReceiptPage() {
  const router = useRouter();
  const params = useParams();
  const referenceNo = params?.reference_no as string;

  const formatTransactionType = (transactionType: string) => {
  return transactionType
    .replace(/_/g, " ") // Replace underscores with spaces
    .split(" ") // Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words back into a single string
};

  if (!referenceNo) {
    router.back();
    return null;
  }
  const { data: receipt, isLoading: receiptLoading, error } = UseGetTransactionReceipt(referenceNo);

  if (error) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p className="text-red-600 text-lg ">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-muted">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-primary hover:-translate-x-1 transition">
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1">Receipt</h1>
        <p className="text-gray-700">View transaction receipt</p>
      </div>

      <section className="flex justify-center">
        <div className="md:w-[60vw] bg-white w-full animate__zoomIn animate__animated animate__delay-0.5s bg-card lg:px-10 px-3 rounded-xl py-5 overflow-hidden">
          {receiptLoading && <ReceiptSkeleton />}
          <div className="flex justify-center items-center flex-col w-full">
            <>
              {receipt?.data.status === "success" && (
                <div>
                  <Lottie
                    animationData={successAnimation}
                    loop
                    autoplay
                    style={{ width: 250, height: 250 }}
                  />
                </div>
              )}
              {receipt?.data.status === "processing" && (
                <div>
                  <Lottie
                    animationData={processingAnimation}
                    loop
                    autoplay
                    style={{ width: 250, height: 250, marginBottom: -50, marginTop: -50 }}
                  />
                </div>
              )}
              {receipt?.data.status === "Failed" && (
                <div>
                  <Lottie
                    animationData={failedAnimation}
                    loop
                    autoplay
                    style={{ width: 250, height: 250, marginBottom: -50, marginTop: -50 }}
                  />
                </div>
              )}
              <h1
                className={`text-3xl font-bold pt-3 ${receipt?.data.status === "success" && "text-green-500"} ${receipt?.data.status === "Failed" && "text-red-500"} ${receipt?.data.status === "processing" && "text-yellow-500"}`}>
                {receipt?.data.status}
              </h1>
              <p className="text-2xl font-bold pt-1 pb-5">
                {receipt?.data.type === "debit" ? "-" : "+"}{" "}
                {formatNumber(receipt?.data.amount || 0)} NGN
              </p>
            </>
            <div className="border-t border-b border-border w-full py-5 text-[15px]">
              <div className="w-full flex justify-between items-center">
                <p className="w-1/3 lg:w-1/2 font-semibold">Type</p>
                <p className="w-2/3 lg:w-1/2 text-right">{formatTransactionType(receipt?.data.type || "")}</p>
              </div>
              {receipt?.data.destination_name && (
                <div className="w-full flex justify-between items-center pt-2">
                  <p className="w-1/3 lg:w-1/2 font-semibold">Sender</p>
                  <p className="w-2/3 lg:w-1/2 text-right"> {receipt?.data.destination_name || ""} </p>
                </div>
              )}
              {receipt?.data.trnx_type && (
                <div className="w-full flex justify-between items-center pt-2">
                  <p className="w-1/3 lg:w-1/2 font-semibold">Transaction Type</p>
                  <p className="w-2/3 lg:w-1/2 text-right"> {formatTransactionType(receipt?.data.trnx_type || "")} </p>
                </div>
              )}
              {receipt?.data.destination_account && (
                <div className="w-full flex justify-between items-center pt-2">
                  <p className="w-1/3 lg:w-1/2 font-semibold">Recipient Info</p>
                  <p className="w-2/3 lg:w-1/2 text-right">{receipt?.data.destination_account}</p>
                </div>
              )}
              <div className="w-full flex justify-between items-center pt-2">
                <p className="w-1/3 lg:w-1/2 font-semibold">Transaction Reference</p>
                <p className="w-2/3 lg:w-1/2 text-right">{receipt?.data.reference_no}</p>
              </div>
              <div className="w-full flex justify-between items-center pt-2">
                <p className="w-1/3 lg:w-1/2 font-semibold">Date Created</p>
                <p className="w-2/3 lg:w-1/2 text-right">{formatDateTime(receipt?.data.created_at || "")}</p>
              </div>
              {receipt?.data.narration && (
                <div className="w-full flex justify-between items-center pt-2">
                  <p className="w-1/3 lg:w-1/2 font-semibold">Naration</p>
                  <p className="w-2/3 lg:w-1/2 text-right">{receipt?.data.narration}</p>
                </div>
              )}
              <div className="w-full flex justify-between items-center pt-2">
                <p className="w-1/3 lg:w-1/2 font-semibold">Description</p>
                <p className="w-2/3 lg:w-1/2 text-right">{receipt?.data.notes}</p>
              </div>
            </div>
            <div className="w-full flex lg:flex-row flex-col gap-5 my-5 ">
              {/* <button
                className="py-5 lg:w-1/2 w-full flex items-center gap-3 hover:bg-foreground text-white  dark:bg-[#143B50] dark:hover:bg-primary"
                onClick={() => setOpen(true)}>
                <Share2 />
                Share Receipt
              </button> */}
              <button
                className=" w-full py-3 rounded-xl flex items-center justify-center bg-primary text-white gap-3 "
                onClick={() => router.push("/dashboard")}>
                <House />
                Home
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
