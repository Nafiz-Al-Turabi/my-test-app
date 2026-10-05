"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Check, ChevronDown, X, Search } from "lucide-react";

export interface MultiSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;

  placeholder?: string;
  searchPlaceholder?: string;

  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  selectAll?: boolean;

  maxHeight?: number;
  className?: string;
}

export default function MultiSelect({
  options,
  value = [],
  onChange,

  placeholder = "Select options",
  searchPlaceholder = "Search options...",

  disabled = false,
  searchable = true,
  clearable = true,
  selectAll = true,

  maxHeight = 240,
  className = "",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [search, setSearch] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // -----------------------------------------
  // Selected options
  // -----------------------------------------

  const selectedOptions = useMemo(() => {
    return options.filter((option) => value.includes(option.value));
  }, [options, value]);

  // -----------------------------------------
  // Filter options
  // -----------------------------------------

  const filteredOptions = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return options;

    return options.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [options, search]);

  // -----------------------------------------
  // Calculate dropdown direction
  // -----------------------------------------

  const calculateDirection = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const dropdownHeight = Math.min(maxHeight + (searchable ? 70 : 0), 320);

    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      setDirection("up");
    } else {
      setDirection("down");
    }
  };

  // -----------------------------------------
  // Toggle dropdown
  // -----------------------------------------

  const handleToggle = () => {
    if (disabled) return;

    if (!open) {
      calculateDirection();
    }

    setOpen((prev) => !prev);
  };

  // -----------------------------------------
  // Select / unselect option
  // -----------------------------------------

  const handleSelect = (option: MultiSelectOption) => {
    if (option.disabled) return;

    const exists = value.includes(option.value);

    if (exists) {
      onChange?.(value.filter((item) => item !== option.value));
    } else {
      onChange?.([...value, option.value]);
    }
  };

  // -----------------------------------------
  // Remove selected item
  // -----------------------------------------

  const handleRemove = (event: React.MouseEvent, optionValue: string) => {
    event.stopPropagation();

    onChange?.(value.filter((item) => item !== optionValue));
  };

  // -----------------------------------------
  // Clear all
  // -----------------------------------------

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();

    onChange?.([]);
  };

  // -----------------------------------------
  // Select all
  // -----------------------------------------

  const handleSelectAll = () => {
    const enabledValues = options
      .filter((option) => !option.disabled)
      .map((option) => option.value);

    const allSelected = enabledValues.every((item) => value.includes(item));

    if (allSelected) {
      onChange?.(value.filter((item) => !enabledValues.includes(item)));
    } else {
      onChange?.([...new Set([...value, ...enabledValues])]);
    }
  };

  // -----------------------------------------
  // Click outside
  // -----------------------------------------

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // -----------------------------------------
  // Escape key
  // -----------------------------------------

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // -----------------------------------------
  // Recalculate position
  // -----------------------------------------

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

  const enabledOptions = options.filter((option) => !option.disabled);

  const allSelected =
    enabledOptions.length > 0 &&
    enabledOptions.every((option) => value.includes(option.value));

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* ===================================== */}
      {/* Trigger */}
      {/* ===================================== */}

      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={` flex min-h-11.5 w-full items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-left shadow-sm transition-all duration-20 hover:border-zinc-30 focus:outline-none focus:ring-2 focus:ring-zinc-900/1 dark:border-zinc-800 dark:bg-zinc-950

          ${
            open
              ? "border-zinc-400 ring-2 ring-zinc-900/10 dark:border-zinc-600"
              : ""
          }

          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        `}
      >
        {/* Selected values */}
        <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {selectedOptions.length === 0 ? (
            <span className="px-1 text-sm text-zinc-400">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200
                "
              >
                {option.label}

                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => handleRemove(event, option.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      handleRemove(
                        event as unknown as React.MouseEvent,
                        option.value,
                      );
                    }
                  }}
                  className="cursor-pointer rounded-full p-0.5 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  <X size={12} />
                </span>
              </span>
            ))
          )}
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-1">
          {clearable && value.length > 0 && (
            <span
              role="button"
              onClick={handleClear}
              className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800
              "
            >
              <X size={15} />
            </span>
          )}

          <ChevronDown
            size={18}
            className={`
              text-zinc-400
              transition-transform
              duration-300
              ${open ? "rotate-180" : ""}
            `}
          />
        </div>
      </button>

      {/* ===================================== */}
      {/* Dropdown */}
      {/* ===================================== */}

      <div
        className={`absolute left-0 z-50 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl shadow-black/1 transition-all duration-200 ease-ou dark:border-zinc-800 dark:bg-zinc-950

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
        {/* ===================================== */}
        {/* Search */}
        {/* ===================================== */}

        {searchable && (
          <div className="border-b border-zinc-100 p-1 pb-2 dark:border-zinc-800">
            <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 dark:bg-zinc-900">
              <Search size={16} className="shrink-0 text-zinc-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onClick={(event) => event.stopPropagation()}
                placeholder={searchPlaceholder}
                className="h-9 w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* ===================================== */}
        {/* Select All */}
        {/* ===================================== */}

        {selectAll && enabledOptions.length > 0 && (
          <button
            type="button"
            onClick={handleSelectAll}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900
            "
          >
            <span>{allSelected ? "Clear all" : "Select all"}</span>

            <span className="text-xs text-zinc-400">
              {value.length}/{enabledOptions.length}
            </span>
          </button>
        )}

        {/* ===================================== */}
        {/* Options */}
        {/* ===================================== */}

        <div
          className="overflow-y-auto"
          style={{
            maxHeight: `${maxHeight}px`,
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isSelected = value.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => handleSelect(option)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-15 ${
                    option.disabled
                      ? "cursor-not-allowed opacity-40"
                      : "cursor-pointer"
                  }

                    ${
                      isSelected
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    }
                  `}
                >
                  {/* Checkbox */}
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-20 ${
                      isSelected
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                        : "border-zinc-300 dark:border-zinc-700"
                    }
                    `}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </span>

                  <span className="flex-1">{option.label}</span>
                </button>
              );
            })
          ) : (
            <div className="px-3 py-8 text-center text-sm text-zinc-400">
              No options found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
