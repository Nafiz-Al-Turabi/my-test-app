"use client";

import { useEffect, useState } from "react";
import { Genie } from "genie-web/react";

interface GenieModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  originRef?: React.RefObject<HTMLElement | null>;
}

export default function GenieModal({
  isOpen,
  onClose,
  children,
  originRef,
}: GenieModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    }
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0   transition-opacity duration-500 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Real macOS WebGL Mesh Warp Genie Effect */}
      {originRef?.current && (
        <Genie
          open={isOpen}
          origin={originRef.current}
          config={{
            duration: 500,
            easing: "easeInOut",
            curve: "inOut",
            columns: 24,
            rows: 50,
          }}
          className="relative z-10 w-[92%] max-w-md rounded-2xl shadow-2xl overflow-hidden p-6"
        >
          {children}
        </Genie>
      )}
    </div>
  );
}
