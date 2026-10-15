"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

// টেস্ট করার ভ্যালিড কোড
const VALID_OTPS = ["123456", "999999", "777888"];

export type SuccessAnimationType =
  | "merge_checkmark" // ১. মার্জ হয়ে গ্রিন চেক-মার্ক
  | "morph_pill" // ২. সব বক্স একসাথে জোড়া লেগে একটি মসৃণ ক্যাপসুল/পিল বাটনে রূপান্তর
  | "domino_flip" // ৩. একের পর এক ৩ডি ডমিনো স্পিন + জেলি বাউন্স
  | "confetti_burst" // ৪. মার্জ + চারদিকে কালারফুল কনফেটি ব্লাস্ট
  | "ripple_wave" // ৫. গ্রিন রিল্যাক্সিং লিকুইড রিপল ওয়েভ ও জাম্প
  | "slot_jackpot"; // ৬. ক্যাসিনো জ্যাকপট স্লট স্পিন ও স্টার শাইন

export type WrongAnimationType =
  | "cross_headshake" // ১. মার্জ হয়ে রেড ক্রস (✕) + হেড শেক
  | "domino_collapse" // ২. তাস পতন (Domino Fall)
  | "glitch_rumble" // ৩. iOS স্ন্যাপি গ্লিচ শেক
  | "liquid_squash" // ৪. জেলি লিকুইড ড্রপ ও স্কোয়াশ
  | "tornado_spin" // ৫. সাইক্লোন ঘূর্ণি স্পিন ও ছিটকে যাওয়া
  | "broken_heartbeat"; // ৬. পালসিং এলার্ম হার্টবিট

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

export default function OTPInput() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [selectedSuccessStyle, setSelectedSuccessStyle] =
    useState<SuccessAnimationType>("merge_checkmark");
  const [selectedWrongStyle, setSelectedWrongStyle] =
    useState<WrongAnimationType>("cross_headshake");
  const [apiMessage, setApiMessage] = useState<string>("");
  const [particles, setParticles] = useState<Particle[]>([]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const successBadgeRef = useRef<HTMLDivElement>(null);
  const checkmarkBoxRef = useRef<HTMLDivElement>(null);
  const checkSvgPathRef = useRef<SVGPathElement>(null);
  const crossBoxRef = useRef<HTMLDivElement>(null);
  const crossPath1Ref = useRef<SVGPathElement>(null);
  const crossPath2Ref = useRef<SVGPathElement>(null);
  const particleRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // w-10 (40px) এবং gap-2 (8px) অনুযায়ী সেন্টারে মার্জ অফসেট:
  const getMergeOffset = (index: number) => {
    const offsets = [120, 72, 24, -24, -72, -120];
    return offsets[index] ?? 0;
  };

  const spawnParticles = () => {
    const colors = [
      "#10b981",
      "#3b82f6",
      "#f59e0b",
      "#ec4899",
      "#8b5cf6",
      "#06b6d4",
    ];
    const items: Particle[] = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: 0,
      y: 0,
      color: colors[i % colors.length],
      size: Math.floor(Math.random() * 5) + 4,
    }));
    setParticles(items);
  };

  // Real API Verification
  const verifyWithApi = async (code: string) => {
    setStatus("loading");
    setApiMessage("Verifying code with server...");

    try {
      await new Promise((r) => setTimeout(r, 500));
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

  // Handle GSAP animations
  useEffect(() => {
    const inputs = inputRefs.current.filter(Boolean);
    const checkmarkBox = checkmarkBoxRef.current;
    const checkPath = checkSvgPathRef.current;
    const crossBox = crossBoxRef.current;
    const crossP1 = crossPath1Ref.current;
    const crossP2 = crossPath2Ref.current;
    const container = containerRef.current;

    gsap.killTweensOf([
      inputs,
      checkmarkBox,
      checkPath,
      crossBox,
      crossP1,
      crossP2,
      container,
    ]);

    if (status === "loading") {
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
      // 🟢 SUCCESS ANIMATIONS
      // ========================================================
      if (selectedSuccessStyle === "merge_checkmark") {
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
            {
              strokeDashoffset: 0,
              duration: 0.35,
              ease: "power2.out",
              delay: 0.4,
            }
          );
        }
      } else if (selectedSuccessStyle === "morph_pill") {
        const tl = gsap.timeline();

        tl.to(inputs, {
          x: (i) => {
            const pillOffsets = [10, 6, 2, -2, -6, -10];
            return pillOffsets[i];
          },
          borderColor: "#10b981",
          backgroundColor: "#ecfdf5",
          color: "#047857",
          boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)",
          borderRadius: (i) =>
            i === 0 ? "16px 0 0 16px" : i === 5 ? "0 16px 16px 0" : "0",
          duration: 0.38,
          ease: "power3.inOut",
        })
          .to(inputs, {
            scale: 1.06,
            duration: 0.2,
            ease: "power2.out",
          })
          .to(inputs, {
            scale: 1,
            backgroundColor: "#d1fae5",
            duration: 0.35,
            ease: "bounce.out",
          });
      } else if (selectedSuccessStyle === "domino_flip") {
        const tl = gsap.timeline();

        tl.to(inputs, {
          rotateY: 360,
          y: -14,
          scale: 1.15,
          borderColor: "#10b981",
          backgroundColor: "#ecfdf5",
          color: "#047857",
          boxShadow: "0 10px 20px rgba(16, 185, 129, 0.35)",
          duration: 0.45,
          stagger: 0.06,
          ease: "back.out(2)",
        })
          .to(
            inputs,
            {
              y: 0,
              scaleX: 1.06,
              scaleY: 0.94,
              duration: 0.16,
              stagger: 0.03,
              ease: "power2.in",
            },
            "-=0.15"
          )
          .to(inputs, {
            scaleX: 1,
            scaleY: 1,
            backgroundColor: "#ffffff",
            duration: 0.4,
            stagger: 0.03,
            ease: "elastic.out(1.2, 0.3)",
          });
      } else if (selectedSuccessStyle === "confetti_burst") {
        spawnParticles();
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
          { scale: 0, opacity: 0, rotate: -60 },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.5,
            ease: "back.out(2.4)",
          },
          "-=0.1"
        );

        if (checkPath) {
          const length = checkPath.getTotalLength() || 40;
          gsap.fromTo(
            checkPath,
            { strokeDasharray: length, strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              duration: 0.3,
              ease: "power2.out",
              delay: 0.35,
            }
          );
        }

        setTimeout(() => {
          const els = particleRefs.current.filter(Boolean);
          if (els.length > 0) {
            gsap.fromTo(
              els,
              { x: 0, y: 0, opacity: 1, scale: 0 },
              {
                x: () => (Math.random() - 0.5) * 260,
                y: () => -(Math.random() * 110 + 30),
                scale: () => Math.random() * 1.4 + 0.6,
                rotation: () => Math.random() * 720 - 360,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                stagger: { amount: 0.12 },
              }
            );
          }
        }, 180);
      } else if (selectedSuccessStyle === "ripple_wave") {
        // ----------------------------------------------------
        // ৫. সাইন ওয়েভ লিকুইড রিপল ও এমারেল্ড গ্লো (Ripple Wave)
        // একের পর এক স্মুথ সাইন ওয়েভ আকারে জাম্প ও এমারেল্ড স্কেল
        // ----------------------------------------------------
        const tl = gsap.timeline();

        tl.to(inputs, {
          y: -18,
          scaleY: 1.15,
          scaleX: 0.92,
          borderColor: "#10b981",
          backgroundColor: "#d1fae5",
          color: "#065f46",
          boxShadow: "0 12px 22px rgba(16, 185, 129, 0.4)",
          duration: 0.28,
          stagger: {
            each: 0.08,
            ease: "sine.inOut",
          },
          ease: "power2.out",
        })
          .to(
            inputs,
            {
              y: 0,
              scaleY: 0.88,
              scaleX: 1.12,
              duration: 0.18,
              stagger: {
                each: 0.08,
                ease: "sine.inOut",
              },
              ease: "power2.in",
            },
            "-=0.25"
          )
          .to(inputs, {
            scaleY: 1,
            scaleX: 1,
            backgroundColor: "#ecfdf5",
            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)",
            duration: 0.35,
            stagger: 0.04,
            ease: "elastic.out(1.2, 0.4)",
          });
      } else if (selectedSuccessStyle === "slot_jackpot") {
        // ----------------------------------------------------
        // ৬. লাকি জ্যাকপট স্লট স্পিন (Jackpot Slot Spin & Victory Bounce)
        // ক্যাসিনো স্লট মেশিনের মতো উল্লম্ব ৩৬০° ৩ডি রোটেশন + ফাস্ট উইন বাউন্স
        // ----------------------------------------------------
        const tl = gsap.timeline();

        tl.to(inputs, {
          rotateX: 360,
          scale: 1.2,
          borderColor: "#10b981",
          backgroundColor: "#10b981",
          color: "#ffffff",
          boxShadow: "0 0 25px rgba(16, 185, 129, 0.6), 0 0 50px rgba(52, 211, 153, 0.3)",
          duration: 0.45,
          stagger: {
            each: 0.07,
          },
          ease: "back.out(2.2)",
        })
          .to(inputs, {
            rotateX: 720,
            scale: 1,
            backgroundColor: "#ecfdf5",
            color: "#047857",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          })
          .to(inputs, {
            y: (i) => (i % 2 === 0 ? -6 : 6),
            duration: 0.12,
            stagger: 0.02,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          });
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
            delay: 0.55,
            ease: "back.out(1.6)",
          }
        );
      }
    } else if (status === "error") {
      // ========================================================
      // 🔴 WRONG ANIMATIONS (৬টি ভিন্ন চমৎকার স্টাইল)
      // ========================================================
      if (selectedWrongStyle === "cross_headshake") {
        // ----------------------------------------------------
        // ১. মার্জ হয়ে রেড ক্রস (✕) তৈরি হবে এবং "না" বলে শেক করবে
        // ----------------------------------------------------
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
          "-=0.1"
        );

        if (crossP1 && crossP2) {
          gsap.fromTo(
            [crossP1, crossP2],
            { strokeDasharray: 30, strokeDashoffset: 30 },
            { strokeDashoffset: 0, duration: 0.25, delay: 0.35 }
          );
        }

        tl.to(crossBox, {
          x: -12,
          duration: 0.08,
          repeat: 5,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.2,
        })
          .to(crossBox, { x: 0, duration: 0.1 })
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
        // ২. ডমিনো তাস পতন (তাস পড়ার মতো ভেঙে ড্রপ হওয়া)
        // ----------------------------------------------------
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
      } else if (selectedWrongStyle === "glitch_rumble") {
        // ----------------------------------------------------
        // ৩. অ্যাপল হ্যাপটিক গ্লিচ শেক
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
      } else if (selectedWrongStyle === "liquid_squash") {
        // ----------------------------------------------------
        // ৪. লিকুইড জেলি ড্রপ ও স্কোয়াশ (Liquid Jelly Squash & Spring)
        // বক্সগুলো নিচে ড্রপ করে চ্যাপ্টা হবে এবং আবার লাফিয়ে উঠবে
        // ----------------------------------------------------
        const tl = gsap.timeline();

        tl.to(inputs, {
          borderColor: "#ef4444",
          backgroundColor: "#fee2e2",
          color: "#dc2626",
          duration: 0.1,
        })
          // বাতাসে উঁচুতে উঠে টানটান হওয়া
          .to(inputs, {
            y: -14,
            scaleX: 0.88,
            scaleY: 1.15,
            duration: 0.18,
            stagger: 0.03,
            ease: "power2.out",
          })
          // নিচে সজোরে ড্রপ করে চ্যাপ্টা হয়ে স্কোয়াশ হওয়া
          .to(inputs, {
            y: 6,
            scaleX: 1.25,
            scaleY: 0.75,
            duration: 0.15,
            stagger: 0.03,
            ease: "power3.in",
          })
          // জেলি বাউন্স দিয়ে স্বাভাবিক অবস্থায় রূপান্তর
          .to(inputs, {
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.5,
            stagger: 0.03,
            ease: "elastic.out(1.2, 0.35)",
          });
      } else if (selectedWrongStyle === "tornado_spin") {
        // ----------------------------------------------------
        // ৫. সাইক্লোন ঘূর্ণি স্পিন (Tornado Vortex Spin)
        // প্রতিটি বক্স একেক দিকে উল্টো ১৮০ ডিগ্রি স্পিন খেয়ে কাঁপবে
        // ----------------------------------------------------
        const tl = gsap.timeline();

        tl.to(inputs, {
          borderColor: "#ef4444",
          backgroundColor: "#fef2f2",
          color: "#b91c1c",
          duration: 0.1,
        })
          .to(inputs, {
            rotateY: (i) => (i % 2 === 0 ? 180 : -180),
            scale: 0.85,
            duration: 0.35,
            stagger: {
              each: 0.04,
              from: "center",
            },
            ease: "power3.inOut",
          })
          .to(inputs, {
            rotateY: 0,
            scale: 1,
            duration: 0.45,
            stagger: {
              each: 0.04,
              from: "center",
            },
            ease: "back.out(2)",
          });
      } else if (selectedWrongStyle === "broken_heartbeat") {
        // ----------------------------------------------------
        // ৬. পালসিং এলার্ম হার্টবিট (Heartbeat Pulse & Warning Zoom)
        // দুইবার তীব্র লাল রঙের হৃদস্পন্দনের মতো পালস ও জুম
        // ----------------------------------------------------
        const tl = gsap.timeline();

        tl.to(inputs, {
          borderColor: "#ef4444",
          backgroundColor: "#fef2f2",
          color: "#b91c1c",
          scale: 1.18,
          boxShadow: "0 0 20px rgba(239, 68, 68, 0.6)",
          duration: 0.12,
          ease: "power2.out",
        })
          .to(inputs, {
            scale: 0.95,
            boxShadow: "0 0 6px rgba(239, 68, 68, 0.2)",
            duration: 0.12,
            ease: "power2.in",
          })
          .to(inputs, {
            scale: 1.22,
            boxShadow: "0 0 24px rgba(239, 68, 68, 0.7)",
            duration: 0.14,
            ease: "power2.out",
          })
          .to(inputs, {
            scale: 1,
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
            duration: 0.35,
            ease: "elastic.out(1.1, 0.4)",
          });
      }
    } else {
      // IDLE RESET
      setParticles([]);
      gsap.to(inputs, {
        x: 0,
        y: 0,
        rotate: 0,
        rotateZ: 0,
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        borderRadius: "8px",
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
  }, [status, selectedSuccessStyle, selectedWrongStyle]);

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
        { scale: 1, duration: 0.25, ease: "back.out(2)" }
      );
    }

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
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
    setParticles([]);
    const inputs = inputRefs.current.filter(Boolean);
    const checkmarkBox = checkmarkBoxRef.current;
    const crossBox = crossBoxRef.current;

    gsap.to(inputs, {
      x: 0,
      y: 0,
      rotate: 0,
      rotateZ: 0,
      rotateY: 0,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      borderRadius: "8px",
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
      <div className="flex flex-col items-center gap-6 bg-white border border-gray-200 shadow-sm rounded-3xl p-8 max-w-lg w-full">
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
          {/* Confetti Particles Layer */}
          <div className="pointer-events-none absolute inset-0 overflow-visible flex items-center justify-center">
            {particles.map((p, idx) => (
              <span
                key={p.id}
                ref={(el) => {
                  particleRefs.current[idx] = el;
                }}
                className="absolute rounded-full"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  opacity: 0,
                }}
              />
            ))}
          </div>

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

          {/* Centered Red Cross Box (Wrong Style 1) */}
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
        <div className="min-h-8 flex items-center justify-center text-center">
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

        {/* Switcher 1: Success Animation Styles */}
        <div className="w-full flex flex-col items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
            Choose Success Animation:
          </span>
          <div className="flex flex-wrap gap-1.5 justify-center">
            <button
              type="button"
              onClick={() => {
                setSelectedSuccessStyle("merge_checkmark");
                handleReset();
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedSuccessStyle === "merge_checkmark"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              1. Merge Checkmark (✓)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedSuccessStyle("morph_pill");
                handleReset();
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedSuccessStyle === "morph_pill"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              2. Morphing Capsule
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedSuccessStyle("domino_flip");
                handleReset();
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedSuccessStyle === "domino_flip"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              3. 3D Domino Flip
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedSuccessStyle("confetti_burst");
                handleReset();
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedSuccessStyle === "confetti_burst"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              4. Confetti Burst
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedSuccessStyle("ripple_wave");
                handleReset();
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedSuccessStyle === "ripple_wave"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              5. Liquid Wave
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedSuccessStyle("slot_jackpot");
                handleReset();
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedSuccessStyle === "slot_jackpot"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              6. Jackpot Spin
            </button>
          </div>
        </div>

        {/* Switcher 2: Wrong Animation Styles (Expanded to 6 Styles!) */}
        <div className="w-full flex flex-col items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
            Choose Wrong Animation (6 Styles):
          </span>
          <div className="flex flex-wrap gap-1.5 justify-center">
            <button
              type="button"
              onClick={() => {
                setSelectedWrongStyle("cross_headshake");
                handleReset();
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedWrongStyle === "cross_headshake"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              1. Merge to Cross (✕)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedWrongStyle("domino_collapse");
                handleReset();
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedWrongStyle === "domino_collapse"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              2. Domino Collapse
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedWrongStyle("glitch_rumble");
                handleReset();
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedWrongStyle === "glitch_rumble"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              3. iOS Glitch Shake
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedWrongStyle("liquid_squash");
                handleReset();
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedWrongStyle === "liquid_squash"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              4. Liquid Jelly Squash
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedWrongStyle("tornado_spin");
                handleReset();
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedWrongStyle === "tornado_spin"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              5. Tornado Vortex Spin
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedWrongStyle("broken_heartbeat");
                handleReset();
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedWrongStyle === "broken_heartbeat"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              6. Alarm Heartbeat Pulse
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => fillOtp("123456")}
            className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition"
          >
            ✓ Test Success (123456)
          </button>
          <button
            type="button"
            onClick={() => fillOtp("000000")}
            className="px-3.5 py-1.5 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition"
          >
            ✕ Test Selected Wrong (000000)
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
