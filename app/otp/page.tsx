"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

// টেস্ট করার ভ্যালিড কোড
const VALID_OTPS = ["123456", "999999", "777888"];

type WrongAnimationType = "cross_headshake" | "domino_collapse" | "glitch_rumble";

export default function OTPPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [selectedWrongStyle, setSelectedWrongStyle] =
    useState<WrongAnimationType>("cross_headshake");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const successBadgeRef = useRef<HTMLDivElement>(null);
  const checkmarkBoxRef = useRef<HTMLDivElement>(null);
  const checkSvgPathRef = useRef<SVGPathElement>(null);
  const crossBoxRef = useRef<HTMLDivElement>(null);
  const crossPath1Ref = useRef<SVGPathElement>(null);
  const crossPath2Ref = useRef<SVGPathElement>(null);

  // w-10 (40px) এবং gap-2 (8px) অনুযায়ী সেন্টারে মার্জ অফসেট:
  // পিচ = 48px
  // 6টি বক্সের সেন্টারের দূরত্ব: index 0: +120px, 1: +72px, 2: +24px, 3: -24px, 4: -72px, 5: -120px
  const getMergeOffset = (index: number) => {
    const offsets = [120, 72, 24, -24, -72, -120];
    return offsets[index] ?? 0;
  };

  useEffect(() => {
    const isCompleted = otp.every((digit) => digit !== "");

    if (isCompleted) {
      const enteredOtp = otp.join("");
      const inputs = inputRefs.current.filter(Boolean);
      const isSuccess = VALID_OTPS.includes(enteredOtp);
      const checkmarkBox = checkmarkBoxRef.current;
      const checkPath = checkSvgPathRef.current;
      const crossBox = crossBoxRef.current;
      const crossP1 = crossPath1Ref.current;
      const crossP2 = crossPath2Ref.current;

      gsap.killTweensOf([inputs, checkmarkBox, checkPath, crossBox, crossP1, crossP2]);

      if (isSuccess) {
        // ========================================================
        // 🟢 সঠিক OTP:
        // সব বক্স একসাথে সেন্টারে মার্জ হয়ে গ্রিন চেক-মার্ক (✓) হবে
        // ========================================================
        setStatus("success");

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
          "-=0.1"
        );

        if (checkPath) {
          const length = checkPath.getTotalLength() || 40;
          gsap.fromTo(
            checkPath,
            { strokeDasharray: length, strokeDashoffset: length },
            { strokeDashoffset: 0, duration: 0.35, ease: "power2.out", delay: 0.4 }
          );
        }

        if (successBadgeRef.current) {
          gsap.fromTo(
            successBadgeRef.current,
            { opacity: 0, y: 12, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.35, delay: 0.6, ease: "back.out(1.6)" }
          );
        }
      } else {
        // ========================================================
        // 🔴 ভুল OTP (৩টি ভিন্ন প্রিমিয়াম অ্যানিমেশন স্টাইল)
        // ========================================================
        setStatus("error");

        if (selectedWrongStyle === "cross_headshake") {
          // ----------------------------------------------------
          // স্টাইল ১: মার্জ হয়ে লাল ক্রস (✕) তৈরি হবে এবং "না" বলে শেক করবে!
          // তারপর আবার ৬টি বক্সে স্প্লিট হয়ে ফিরে আসবে
          // ----------------------------------------------------
          const tl = gsap.timeline();

          // Step 1: সব বক্স সেন্টারে মার্জ হয়ে যাবে
          tl.to(inputs, {
            x: (i) => getMergeOffset(i),
            scale: 0.82,
            opacity: 0,
            duration: 0.38,
            ease: "power3.in",
          })
            // Step 2: সেন্টারে রেড ক্রস (✕) বক্স পপ-আপ হবে
            .fromTo(
              crossBox,
              { scale: 0, opacity: 0, rotate: 45 },
              { scale: 1, opacity: 1, rotate: 0, duration: 0.4, ease: "back.out(2)" },
              "-=0.1"
            );

          // ক্রস দাগ দুটি ড্র হবে
          if (crossP1 && crossP2) {
            gsap.fromTo([crossP1, crossP2], { strokeDasharray: 30, strokeDashoffset: 30 }, { strokeDashoffset: 0, duration: 0.25, delay: 0.35 });
          }

          // Step 3: ক্রস বক্সটি "না" বলে ডানে-বামে ৩ বার মাথা নাড়বে (Head Shake)
          tl.to(crossBox, {
            x: -12,
            duration: 0.08,
            repeat: 5,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.2,
          })
            .to(crossBox, { x: 0, duration: 0.1 })
            // Step 4: ক্রস বক্সটি মিলিয়ে যাবে এবং আবার ৬টি বক্সে স্প্লিট হয়ে বের হবে
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
          // ----------------------------------------------------
          // স্টাইল ২: ডমিনো কোল্যাপস (তাস পড়ার মতো একের পর এক ভেঙে কাত হয়ে পড়ে যাওয়া)
          // ----------------------------------------------------
          const tl = gsap.timeline();

          tl.to(inputs, {
            borderColor: "#ef4444",
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            duration: 0.1,
          })
            // তাস পড়ার মতো একের পর এক হেলে পড়ে যাওয়া
            .to(inputs, {
              rotateZ: (i) => (i < 3 ? -25 : 25),
              y: 12,
              duration: 0.25,
              stagger: 0.05,
              ease: "power2.in",
            })
            // নিচে ড্রপ করে সামান্য বাউন্স
            .to(inputs, {
              y: 0,
              duration: 0.2,
              stagger: 0.03,
              ease: "bounce.out",
            })
            // আবার সোজা হয়ে স্প্রিং স্পিডে উঠে দাঁড়ানো
            .to(inputs, {
              rotateZ: 0,
              y: 0,
              scale: 1,
              duration: 0.45,
              stagger: 0.04,
              ease: "elastic.out(1.2, 0.4)",
            });

        } else {
          // ----------------------------------------------------
          // স্টাইল ৩: আল্ট্রা-স্মুথ অ্যাপল হ্যাপটিক গ্লিচ শেক (Super Clean & Snappy)
          // ----------------------------------------------------
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
      }
    } else {
      // ইউজার কোনো সংখ্যা কাটলে বা লিখলে সবকিছু স্বাভাবিক জায়গায় রিসেট
      if (status !== "idle") {
        setStatus("idle");
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
          ease: "power2.out",
        });

        if (checkmarkBox) {
          gsap.to(checkmarkBox, { scale: 0, opacity: 0, duration: 0.2 });
        }
        if (crossBox) {
          gsap.to(crossBox, { scale: 0, opacity: 0, duration: 0.2 });
        }
      }
    }
  }, [otp, selectedWrongStyle]);

  // Handle typing numbers
  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && inputRefs.current[index]) {
      gsap.fromTo(
        inputRefs.current[index],
        { scale: 0.88 },
        { scale: 1, duration: 0.25, ease: "back.out(2)" }
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
    setOtp(code.split(""));
    inputRefs.current[5]?.focus();
  };

  const handleReset = () => {
    setOtp(Array(6).fill(""));
    setStatus("idle");
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
          <h1 className="text-2xl font-bold text-gray-900">Verification Code</h1>
          <p className="text-sm text-gray-500">
            Enter the 6-digit OTP code below
          </p>
        </div>

        {/* OTP Input Fields Container */}
        <div
          ref={containerRef}
          className="relative flex gap-2 py-4 items-center justify-center min-h-[70px] w-full overflow-visible"
        >
          {/* Centered Green Checkmark Box (w-10 h-10) */}
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

          {/* Centered Red Cross Box (w-10 h-10) */}
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
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-10 h-10 rounded-lg text-center text-lg font-bold bg-white border-2 border-gray-200 text-gray-900 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 will-change-transform select-none z-10"
              style={{ transformOrigin: "center center" }}
            />
          ))}
        </div>

        {/* Dynamic Status / Feedback Message */}
        <div className="min-h-8 flex items-center justify-center">
          {status === "success" && (
            <div
              ref={successBadgeRef}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold border border-emerald-300 opacity-0"
            >
              <span>Code Verified Successfully!</span>
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-1.5 text-sm font-semibold text-red-500 animate-pulse">
              <span>✕</span> Invalid OTP! Please check and re-enter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
