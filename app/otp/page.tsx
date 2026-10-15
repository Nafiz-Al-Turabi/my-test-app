"use client";

import OTPInput from "react-nat-otp";
import 'react-nat-otp/styles.css';
export default function OTPpage() {
  // Real backend API verification function
  const verifyOtp = async (code: string) => {
    // ডেমো রেসপন্স: "123456" হলে Success (true), অন্য কিছু হলে Error (false)
    await new Promise((resolve) => setTimeout(resolve, 600));
    return code === "12345678";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col items-center gap-6 max-w-xl w-full">
        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Enter OTP</h1>
          <p className="text-xs text-gray-500">
            Enter 6-digit code (Test Success: <strong>123456</strong>, Wrong: <strong>000000</strong>)
          </p>
        </div>

        {/* Clean Reusable OTPInput Call */}
        <OTPInput
          length={8}
          boxSize={44}
          gap={10}
          radius={8}
          successAnimation="jackpot"
          errorAnimation="tornado"
          onComplete={(otp) => console.log("OTP completed:", otp)}
          onVerify={async (otp) => {
            return await verifyOtp(otp);
          }}
        />
      </div>
    </div>
  );
}
