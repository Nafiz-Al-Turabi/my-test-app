"use client";

import { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface TabItem {
  label: ReactNode;
  value: string;
}

interface TabsProps {
  items: TabItem[];
  value?: string;
  onChange?: (value: string) => void;
  queryKey?: string;
  className?: string;
  indicatorClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
  indicatorWidthOffset?: number;
  indicatorLeftOffset?: number;
}

export default function Tabs2({
  items,
  value,
  onChange,
  queryKey = "tab",
  className = "",
  indicatorClassName = "",
  activeTabClassName = "",
  inactiveTabClassName = "",
  indicatorWidthOffset = 8,
  indicatorLeftOffset = 4,
}: TabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isControlled = value !== undefined;
  const activeTab = isControlled
    ? value
    : searchParams.get(queryKey) || items[0]?.value;

  const handleChange = (nextValue: string) => {
    if (isControlled) {
      onChange?.(nextValue);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set(queryKey, nextValue);

    params.delete("page");
    params.delete("limit");

    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  };

  const activeIndex = items.findIndex((item) => item.value === activeTab);

  return (
    <div className={`relative flex rounded-md p-1 ${className}`}>
      <div
        className={`absolute top-1 bottom-1 rounded-[inherit] bg-red-500 transition-all duration-300 ${indicatorClassName}`}
        style={{
          width: `calc(${100 / items.length}% - ${indicatorWidthOffset}px)`,
          left: `calc(${activeIndex * (100 / items.length)}% + ${indicatorLeftOffset}px)`,
        }}
      />

      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => handleChange(item.value)}
          className={`relative z-10 flex-1 rounded-[inherit] py-2 font-medium transition-colors duration-300 cursor-pointer ${
            activeTab === item.value
              ? activeTabClassName || "text-white"
              : inactiveTabClassName || "text-gray-600"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
