"use client";

import { Check, ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("down");

  const selectRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  // --------------------------------
  // Detect dropdown direction
  // --------------------------------
  const calculateDirection = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const dropdownHeight = Math.min(options.length * 44 + 16, 260);

    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      setDirection("up");
    } else {
      setDirection("down");
    }
  };

  // --------------------------------
  // Open / Close
  // --------------------------------
  const handleToggle = () => {
    if (disabled) return;

    if (!open) {
      calculateDirection();
    }

    setOpen((prev) => !prev);
  };

  // --------------------------------
  // Select option
  // --------------------------------
  const handleSelect = (option: SelectOption) => {
    onChange?.(option.value);
    setOpen(false);
  };

  // --------------------------------
  // Click outside
  // --------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --------------------------------
  // Escape key
  // --------------------------------
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // --------------------------------
  // Recalculate on resize / scroll
  // --------------------------------
  useEffect(() => {
    if (!open) return;

    const handlePosition = () => {
      calculateDirection();
    };

    window.addEventListener("resize", handlePosition);
    window.addEventListener("scroll", handlePosition, true);

    return () => {
      window.removeEventListener("resize", handlePosition);
      window.removeEventListener("scroll", handlePosition, true);
    };
  }, [open, options.length]);

  return (
    <div ref={selectRef} className={`relative w-full ${className}`}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={` flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-sm transition-all duration-200 hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:border-zinc-700
          ${
            open
              ? "border-zinc-400 ring-2 ring-zinc-900/10 dark:border-zinc-600"
              : ""
          }
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        `}
      >
        <span
          className={
            selectedOption ? "text-zinc-900 dark:text-white" : "text-zinc-400"
          }
        >
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`text-zinc-500 transition-transform duration-300
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute left-0 z-50 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl shadow-black/10 transition-all duration-200 ease-out dark:border-zinc-800 dark:bg-zinc-950
          ${
            direction === "down"
              ? "top-[calc(100%+8px)] origin-top"
              : "bottom-[calc(100%+8px)] origin-bottom"
          }

          ${
            open
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : direction === "down"
                ? "pointer-events-none -translate-y-2 scale-95 opacity-0"
                : "pointer-events-none translate-y-2 scale-95 opacity-0"
          }
        `}
      >
        <div className="max-h-60 overflow-y-auto">
          {options.length > 0 ? (
            options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={` flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-150
                    ${
                      isSelected
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    }
                  `}
                >
                  <span>{option.label}</span>

                  {isSelected && (
                    <Check
                      size={16}
                      className="text-zinc-900 dark:text-white"
                    />
                  )}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-6 text-center text-sm text-zinc-400">
              No options found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
