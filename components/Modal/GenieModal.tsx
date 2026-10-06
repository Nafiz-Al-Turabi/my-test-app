"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

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
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Mount modal when isOpen turns true
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isVisible) return;
    if (!modalRef.current || !overlayRef.current || !contentRef.current) return;

    const modal = modalRef.current;
    const overlay = overlayRef.current;
    const content = contentRef.current;

    // Calculate origin (button center)
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight / 2;

    if (originRef?.current) {
      const rect = originRef.current.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    if (isOpen) {
      // Start tiny + distorted at button
      gsap.set(modal, {
        x: originX - centerX,
        y: originY - centerY,
        scaleX: 0.08,
        scaleY: 0.02, // very flat (genie look)
        rotation: -8,
        opacity: 0,
        transformOrigin: "center center",
        filter: "blur(4px)",
      });

      gsap.set(content, { opacity: 0, y: 20 });
      gsap.set(overlay, { opacity: 0 });

      const tl = gsap.timeline();

      // Overlay fade
      tl.to(overlay, {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });

      // Main genie expand
      tl.to(
        modal,
        {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "back.out(1.7)", // strong overshoot like genie
        },
        0,
      );

      // Content fade in slightly later
      tl.to(
        content,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        0.25,
      );
    } else {
      // Close = Genie suck-in
      const tl = gsap.timeline({
        onComplete: () => setIsVisible(false),
      });

      tl.to(content, {
        opacity: 0,
        y: 15,
        duration: 0.2,
        ease: "power2.in",
      });

      // Distorted suck-in
      tl.to(
        modal,
        {
          x: originX - centerX,
          y: originY - centerY,
          scaleX: 0.06,
          scaleY: 0.015, // becomes very flat
          rotation: 12,
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.55,
          ease: "power4.in", // strong acceleration into the point
        },
        0,
      );

      tl.to(
        overlay,
        {
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        },
        0.15,
      );
    }
  }, [isOpen, isVisible, originRef]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] pointer-events-auto"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-[92%] max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto will-change-transform"
      >
        <div ref={contentRef} className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
