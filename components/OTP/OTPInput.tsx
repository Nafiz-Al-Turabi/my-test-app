"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

export interface OTPInputProps {
  /** Number of OTP digits (Default: 6) */
  length?: number;
  /** Async or sync callback when user fills all digits */
  onComplete?: (code: string) => Promise<boolean> | boolean | void;
  /** Current verification status controlled from outside (Optional) */
  status?: "idle" | "loading" | "success" | "error";
  /** Automatically disable inputs during loading/success */
  disabled?: boolean;
  /** Auto-clear inputs on wrong OTP so user can retype immediately */
  autoClearOnError?: boolean;
  /** Optional custom container class name */
  className?: string;
  /** Allow only numbers (Default: true) */
  numericOnly?: boolean;
}

export default function OTPInput({
  length = 6,
  onComplete,
  status: controlledStatus,
  disabled = false,
  autoClearOnError = false,
  className = "",
  numericOnly = true,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [internalStatus, setInternalStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const status = controlledStatus ?? internalStatus;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const checkmarkBoxRef = useRef<HTMLDivElement>(null);
  const checkSvgPathRef = useRef<SVGPathElement>(null);
  const crossBoxRef = useRef<HTMLDivElement>(null);
  const crossPath1Ref = useRef<SVGPathElement>(null);
  const crossPath2Ref = useRef<SVGPathElement>(null);

  // Dynamically calculate merge offsets based on length, w-10 (40px) and gap-2 (8px)
  // Pitch = 48px
  const getMergeOffset = (index: number) => {
    const centerIndex = (length - 1) / 2;
    return (centerIndex - index) * 48;
  };

  // Trigger animations whenever status changes
  useEffect(() => {
    const inputs = inputRefs.current.filter(Boolean);
    const checkmarkBox = checkmarkBoxRef.current;
    const checkPath = checkSvgPathRef.current;
    const crossBox = crossBoxRef.current;
    const crossP1 = crossPath1Ref.current;
    const crossP2 = crossPath2Ref.current;

    gsap.killTweensOf([inputs, checkmarkBox, checkPath, crossBox, crossP1, crossP2]);

    if (status === "loading") {
      // Gentle pulsing while API is verifying
      gsap.to(inputs, {
        scale: 0.96,
        borderColor: "#3b82f6",
        backgroundColor: "#eff6ff",
        duration: 0.3,
        stagger: 0.04,
        ease: "power2.out",
      });
    } else if (status === "success") {
      // 🟢 SUCCESS: Merge to Green Checkmark
      const tl = gsap.timeline();

      tl.to(inputs, {
        x: (i) => getMergeOffset(i),
        scale: 0.8,
        opacity: 0,
        borderColor: "#10b981",
        duration: 0.38,
        ease: "power3.in",
      }).fromTo(
        checkmarkBox,
        { scale: 0, opacity: 0, rotate: -45 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.45,
          ease: "back.out(2)",
        },
        "-=0.08"
      );

      if (checkPath) {
        const pathLen = checkPath.getTotalLength() || 40;
        gsap.fromTo(
          checkPath,
          { strokeDasharray: pathLen, strokeDashoffset: pathLen },
          { strokeDashoffset: 0, duration: 0.3, ease: "power2.out", delay: 0.35 }
        );
      }
    } else if (status === "error") {
      // 🔴 ERROR: Merge into Red Cross (✕) + Disapproval Head Shake + Re-expand
      const tl = gsap.timeline({
        onComplete: () => {
          if (autoClearOnError) {
            setOtp(Array(length).fill(""));
            inputRefs.current[0]?.focus();
          }
        },
      });

      // Step 1: Merge into center
      tl.to(inputs, {
        x: (i) => getMergeOffset(i),
        scale: 0.8,
        opacity: 0,
        duration: 0.35,
        ease: "power3.in",
      })
        // Step 2: Red Cross Box pops up
        .fromTo(
          crossBox,
          { scale: 0, opacity: 0, rotate: 45 },
          { scale: 1, opacity: 1, rotate: 0, duration: 0.38, ease: "back.out(2)" },
          "-=0.08"
        );

      if (crossP1 && crossP2) {
        gsap.fromTo(
          [crossP1, crossP2],
          { strokeDasharray: 30, strokeDashoffset: 30 },
          { strokeDashoffset: 0, duration: 0.22, delay: 0.3 }
        );
      }

      // Step 3: Head Shake ("No")
      tl.to(crossBox, {
        x: -10,
        duration: 0.08,
        repeat: 5,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.15,
      })
        .to(crossBox, { x: 0, duration: 0.1 })
        // Step 4: Fade Cross and Re-expand 6 Boxes with red error borders
        .to(crossBox, {
          scale: 0,
          opacity: 0,
          duration: 0.22,
          ease: "back.in(1.8)",
          delay: 0.15,
        })
        .to(inputs, {
          x: 0,
          opacity: 1,
          scale: 1,
          borderColor: "#ef4444",
          backgroundColor: "#fef2f2",
          color: "#b91c1c",
          duration: 0.45,
          ease: "back.out(1.8)",
          stagger: 0.03,
        });
    } else {
      // IDLE STATE: Reset to clean standard inputs
      gsap.to(inputs, {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        color: "#111827",
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
  }, [status, length, autoClearOnError]);

  // Handle auto completion when all fields are filled
  useEffect(() => {
    const isCompleted = otp.every((digit) => digit !== "");

    if (isCompleted && onComplete) {
      const code = otp.join("");
      const result = onComplete(code);

      // If onComplete returns a Promise or Boolean, manage internal status automatically
      if (result instanceof Promise) {
        setInternalStatus("loading");
        result
          .then((isSuccess) => {
            setInternalStatus(isSuccess !== false ? "success" : "error");
          })
          .catch(() => {
            setInternalStatus("error");
          });
      } else if (typeof result === "boolean") {
        setInternalStatus(result ? "success" : "error");
      }
    } else if (!isCompleted && internalStatus !== "idle") {
      setInternalStatus("idle");
    }
  }, [otp, onComplete, internalStatus]);

  // Handle typing characters
  const handleChange = (value: string, index: number) => {
    if (numericOnly && isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Micro-spring on key press
    if (value && inputRefs.current[index]) {
      gsap.fromTo(
        inputRefs.current[index],
        { scale: 0.88 },
        { scale: 1, duration: 0.25, ease: "back.out(2)" }
      );
    }

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle pasting full OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let pasteText = e.clipboardData.getData("text");
    if (numericOnly) {
      pasteText = pasteText.replace(/\D/g, "");
    }
    const chars = pasteText.slice(0, length).split("");

    if (chars.length > 0) {
      const newOtp = [...otp];
      chars.forEach((char, idx) => {
        newOtp[idx] = char;
      });
      setOtp(newOtp);

      const nextFocus = Math.min(chars.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex gap-2 py-3 items-center justify-center min-h-[60px] overflow-visible ${className}`}
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

      {/* Dynamic OTP Input Boxes (Exact w-10 h-10) */}
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode={numericOnly ? "numeric" : "text"}
          maxLength={1}
          value={digit}
          disabled={disabled || status === "loading" || status === "success"}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-10 h-10 rounded-lg text-center text-lg font-bold bg-white border-2 border-gray-200 text-gray-900 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 will-change-transform select-none z-10 disabled:opacity-75 disabled:cursor-not-allowed"
          style={{ transformOrigin: "center center" }}
        />
      ))}
    </div>
  );
}

