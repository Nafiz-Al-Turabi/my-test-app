"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

// টেস্ট করার ভ্যালিড কোড
const VALID_OTPS = ["123456", "999999", "777888"];

type WrongAnimationType =
  | "cross_headshake"
  | "domino_collapse"
  | "glitch_rumble";

export default function OTPInput() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [selectedWrongStyle, setSelectedWrongStyle] =
    useState<WrongAnimationType>("cross_headshake");
  const [apiMessage, setApiMessage] = useState<string>("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const successBadgeRef = useRef<HTMLDivElement>(null);
  const checkmarkBoxRef = useRef<HTMLDivElement>(null);
  const checkSvgPathRef = useRef<SVGPathElement>(null);
  const crossBoxRef = useRef<HTMLDivElement>(null);
  const crossPath1Ref = useRef<SVGPathElement>(null);
  const crossPath2Ref = useRef<SVGPathElement>(null);

  // w-10 (40px) এবং gap-2 (8px) অনুযায়ী সেন্টারে মার্জ অফসেট:
  const getMergeOffset = (index: number) => {
    const offsets = [120, 72, 24, -24, -72, -120];
    return offsets[index] ?? 0;
  };

  // Real API Verification Function
  const verifyWithApi = async (code: string) => {
    setStatus("loading");
    setApiMessage("Verifying code with server...");

    try {
      // -----------------------------------------------------------------------
      // 🌐 REAL API INTEGRATION POINT:
      // Replace with your real endpoint, e.g.:
      // const res = await fetch("/api/auth/verify-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ otp: code }),
      // });
      // const data = await res.json();
      // const isSuccess = res.ok && data.success;
      // -----------------------------------------------------------------------

      // Simulated network delay (600ms)
      await new Promise((r) => setTimeout(r, 600));

      const isSuccess = VALID_OTPS.includes(code);

      if (isSuccess) {
        setStatus("success");
        setApiMessage("Code verified successfully!");
      } else {
        setStatus("error");
        setApiMessage("Invalid OTP code! Please try again.");
      }
    } catch {
      setStatus("error");
      setApiMessage("Network error verifying code.");
    }
  };

  useEffect(() => {
    const isCompleted = otp.every((digit) => digit !== "");

    if (isCompleted && status === "idle") {
      const enteredOtp = otp.join("");
      verifyWithApi(enteredOtp);
    }
  }, [otp, status]);

  // Handle GSAP animations triggered by status
  useEffect(() => {
    const inputs = inputRefs.current.filter(Boolean);
    const checkmarkBox = checkmarkBoxRef.current;
    const checkPath = checkSvgPathRef.current;
    const crossBox = crossBoxRef.current;
    const crossP1 = crossPath1Ref.current;
    const crossP2 = crossPath2Ref.current;

    gsap.killTweensOf([
      inputs,
      checkmarkBox,
      checkPath,
      crossBox,
      crossP1,
      crossP2,
    ]);

    if (status === "loading") {
      // Subtle pulsing while waiting for real API
      gsap.to(inputs, {
        scale: 0.95,
        borderColor: "#3b82f6",
        backgroundColor: "#eff6ff",
        duration: 0.25,
        stagger: 0.03,
        ease: "power2.out",
      });
    } else if (status === "success") {
      // ========================================================
      // 🟢 সঠিক OTP: সব বক্স সেন্টারে মার্জ হয়ে চেক-মার্ক (✓) হবে
      // ========================================================
      const tl = gsap.timeline();

      tl.to(inputs, {
        x: (i) => getMergeOffset(i),
        scale: 0.82,
        opacity: 0,
        borderColor: "#10b981",
        duration: 0.4,
        ease: "power3.in",
      }).fromTo(
        checkmarkBox,
        { scale: 0, opacity: 0, rotate: -45 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.5,
          ease: "back.out(2)",
        },
        "-=0.1",
      );

      if (checkPath) {
        const length = checkPath.getTotalLength() || 40;
        gsap.fromTo(
          checkPath,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 0.35,
            ease: "power2.out",
            delay: 0.4,
          },
        );
      }

      if (successBadgeRef.current) {
        gsap.fromTo(
          successBadgeRef.current,
          { opacity: 0, y: 12, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.35,
            delay: 0.6,
            ease: "back.out(1.6)",
          },
        );
      }
    } else if (status === "error") {
      // ========================================================
      // 🔴 ভুল OTP: নির্বাচিত অ্যানিমেশন স্টাইল
      // ========================================================
      if (selectedWrongStyle === "cross_headshake") {
        // স্টাইল ১: সেন্টারে মার্জ হয়ে রেড ক্রস (✕) তৈরি হবে এবং "না" বলে শেক করবে!
        const tl = gsap.timeline();

        tl.to(inputs, {
          x: (i) => getMergeOffset(i),
          scale: 0.82,
          opacity: 0,
          duration: 0.38,
          ease: "power3.in",
        }).fromTo(
          crossBox,
          { scale: 0, opacity: 0, rotate: 45 },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.4,
            ease: "back.out(2)",
          },
          "-=0.1",
        );

        if (crossP1 && crossP2) {
          gsap.fromTo(
            [crossP1, crossP2],
            { strokeDasharray: 30, strokeDashoffset: 30 },
            { strokeDashoffset: 0, duration: 0.25, delay: 0.35 },
          );
        }

        // ক্রস বক্সটি "না" বলে মাথা নাড়বে (Head Shake)
        tl.to(crossBox, {
          x: -12,
          duration: 0.08,
          repeat: 5,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.2,
        })
          .to(crossBox, { x: 0, duration: 0.1 })
          // মিলিয়ে গিয়ে আবার ৬টি বক্সে স্প্লিট হয়ে খুলে যাবে
          .to(crossBox, {
            scale: 0,
            opacity: 0,
            duration: 0.25,
            ease: "back.in(1.8)",
            delay: 0.2,
          })
          .to(inputs, {
            x: 0,
            opacity: 1,
            scale: 1,
            borderColor: "#ef4444",
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
            duration: 0.5,
            ease: "back.out(1.8)",
            stagger: 0.03,
          });
      } else if (selectedWrongStyle === "domino_collapse") {
        // স্টাইল ২: ডমিনো পতন
        const tl = gsap.timeline();

        tl.to(inputs, {
          borderColor: "#ef4444",
          backgroundColor: "#fef2f2",
          color: "#dc2626",
          duration: 0.1,
        })
          .to(inputs, {
            rotateZ: (i) => (i < 3 ? -25 : 25),
            y: 12,
            duration: 0.25,
            stagger: 0.05,
            ease: "power2.in",
          })
          .to(inputs, {
            y: 0,
            duration: 0.2,
            stagger: 0.03,
            ease: "bounce.out",
          })
          .to(inputs, {
            rotateZ: 0,
            y: 0,
            scale: 1,
            duration: 0.45,
            stagger: 0.04,
            ease: "elastic.out(1.2, 0.4)",
          });
      } else {
        // স্টাইল ৩: অ্যাপল হ্যাপটিক গ্লিচ শেক
        const tl = gsap.timeline();

        tl.to(inputs, {
          borderColor: "#ef4444",
          backgroundColor: "#fef2f2",
          color: "#b91c1c",
          boxShadow: "0 0 16px rgba(239, 68, 68, 0.35)",
          duration: 0.08,
        })
          .to(inputs, {
            x: -10,
            duration: 0.05,
            repeat: 7,
            yoyo: true,
            ease: "power1.inOut",
          })
          .to(inputs, {
            x: 0,
            duration: 0.1,
            ease: "power2.out",
          });
      }
    } else {
      // IDLE: রিসেট
      gsap.to(inputs, {
        x: 0,
        y: 0,
        rotate: 0,
        rotateZ: 0,
        scale: 1,
        opacity: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        color: "#1f2937",
        duration: 0.3,
        ease: "power2.out",
      });

      if (checkmarkBox) {
        gsap.to(checkmarkBox, { scale: 0, opacity: 0, duration: 0.2 });
      }
      if (crossBox) {
        gsap.to(crossBox, { scale: 0, opacity: 0, duration: 0.2 });
      }
    }
  }, [status, selectedWrongStyle]);

  // Handle typing numbers
  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    if (status !== "idle") {
      setStatus("idle");
      setApiMessage("");
    }

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && inputRefs.current[index]) {
      gsap.fromTo(
        inputRefs.current[index],
        { scale: 0.88 },
        { scale: 1, duration: 0.25, ease: "back.out(2)" },
      );
    }

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");

    if (pasteData.length > 0) {
      if (status !== "idle") {
        setStatus("idle");
        setApiMessage("");
      }

      const newOtp = [...otp];
      pasteData.forEach((char, idx) => {
        newOtp[idx] = char;
      });
      setOtp(newOtp);

      const nextFocusIndex = Math.min(pasteData.length, 5);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  const fillOtp = (code: string) => {
    setStatus("idle");
    setApiMessage("");
    setOtp(code.split(""));
    inputRefs.current[5]?.focus();
  };

  const handleReset = () => {
    setOtp(Array(6).fill(""));
    setStatus("idle");
    setApiMessage("");
    const inputs = inputRefs.current.filter(Boolean);
    const checkmarkBox = checkmarkBoxRef.current;
    const crossBox = crossBoxRef.current;

    gsap.to(inputs, {
      x: 0,
      y: 0,
      rotate: 0,
      rotateZ: 0,
      scale: 1,
      opacity: 1,
      borderColor: "#e5e7eb",
      backgroundColor: "#ffffff",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
      color: "#1f2937",
      duration: 0.3,
    });

    if (checkmarkBox) {
      gsap.to(checkmarkBox, { scale: 0, opacity: 0, duration: 0.2 });
    }
    if (crossBox) {
      gsap.to(crossBox, { scale: 0, opacity: 0, duration: 0.2 });
    }

    inputRefs.current[0]?.focus();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="flex flex-col items-center gap-7 bg-white border border-gray-200 shadow-sm rounded-3xl p-8 max-w-lg w-full">
        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Verification Code
          </h1>
          <p className="text-sm text-gray-500">
            Enter the 6-digit OTP code below
          </p>
        </div>

        {/* OTP Input Fields Container */}
        <div
          ref={containerRef}
          className="relative flex gap-2 py-4 items-center justify-center min-h-[70px] w-full overflow-visible"
        >
          {/* Centered Green Checkmark Box (Success) */}
          <div
            ref={checkmarkBoxRef}
            className="absolute z-20 flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500 text-white shadow-md shadow-emerald-500/30 opacity-0 pointer-events-none"
            style={{ transformOrigin: "center center" }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path ref={checkSvgPathRef} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Centered Red Cross Box (Wrong Style 1: Merge to Cross + Head Shake) */}
          <div
            ref={crossBoxRef}
            className="absolute z-20 flex items-center justify-center w-10 h-10 rounded-lg bg-red-500 text-white shadow-md shadow-red-500/30 opacity-0 pointer-events-none"
            style={{ transformOrigin: "center center" }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path ref={crossPath1Ref} d="M6 18L18 6" />
              <path ref={crossPath2Ref} d="M6 6l12 12" />
            </svg>
          </div>

          {/* 6 OTP Input Boxes (Exact w-10 h-10) */}
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={status === "loading" || status === "success"}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-10 h-10 rounded-lg text-center text-lg font-bold bg-white border-2 border-gray-200 text-gray-900 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 will-change-transform select-none z-10 disabled:opacity-80"
              style={{ transformOrigin: "center center" }}
            />
          ))}
        </div>

        {/* Dynamic Status / Feedback Message */}
        <div className="min-h-8 flex items-center justify-center">
          {status === "loading" && (
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>{apiMessage}</span>
            </div>
          )}
          {status === "success" && (
            <div
              ref={successBadgeRef}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold border border-emerald-300 opacity-0"
            >
              <span>{apiMessage || "Code Verified Successfully!"}</span>
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-1.5 text-sm font-semibold text-red-500 animate-pulse">
              <span>✕</span>{" "}
              {apiMessage || "Invalid OTP! Please check and re-enter."}
            </div>
          )}
        </div>

        {/* Select Wrong Animation Style Switcher */}
        <div className="w-full flex flex-col items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Choose Wrong Animation Style:
          </span>
          <div className="flex flex-wrap gap-1.5 justify-center">
            <button
              type="button"
              onClick={() => {
                setSelectedWrongStyle("cross_headshake");
                handleReset();
              }}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                selectedWrongStyle === "cross_headshake"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              1. Merge to Red Cross (✕)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedWrongStyle("domino_collapse");
                handleReset();
              }}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                selectedWrongStyle === "domino_collapse"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              2. Domino Collapse (তাস পতন)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedWrongStyle("glitch_rumble");
                handleReset();
              }}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                selectedWrongStyle === "glitch_rumble"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              3. iOS Snappy Glitch Shake
            </button>
          </div>
        </div>

        {/* Quick Test Buttons */}
        <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => fillOtp("123456")}
            className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition"
          >
            ✓ Correct (123456)
          </button>
          <button
            type="button"
            onClick={() => fillOtp("000000")}
            className="px-3.5 py-1.5 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition"
          >
            ✕ Wrong (000000)
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-1.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
