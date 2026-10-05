"use client";

import { ElementType, useEffect, useRef, useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: ElementType;
  count?: number;
}

interface ReusableTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export default function Tabs({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  className = "",
}: ReusableTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id,
  );

  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
  });

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }

    onChange?.(tabId);
  };

  const updateIndicator = () => {
    const activeElement = tabRefs.current[activeTab];

    if (activeElement) {
      setIndicator({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
      });
    }
  };

  useEffect(() => {
    updateIndicator();

    const timeoutId = setTimeout(updateIndicator, 0);

    window.addEventListener("resize", updateIndicator);

    const container = containerRef.current;
    let resizeObserver: ResizeObserver | undefined;

    if (container && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateIndicator);
      resizeObserver.observe(container);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateIndicator);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [activeTab, tabs]);

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={containerRef}
        className="relative flex w-full overflow-x-auto scrollbar-hide"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`
                relative flex min-w-max items-center gap-2
                whitespace-nowrap px-4 py-4
                text-sm font-semibold
                transition-colors duration-200
                ${
                  isActive
                    ? "text-[#063B60]"
                    : "text-gray-700 hover:text-[#063B60]"
                }
              `}
            >
              {Icon && (
                <Icon
                  size={18}
                  className="transition-colors duration-200"
                  style={{ strokeWidth: 1.5 }}
                />
              )}

              <span className="tracking-wide">
                {tab.label}
                {tab.count ? ` (${tab.count})` : ""}
              </span>
            </button>
          );
        })}
        <span
          className="
            absolute bottom-0 h-0.5
            bg-[#F4C400]
            transition-all duration-300 ease-in-out
          "
          style={{
            left: indicator.left,
            width: indicator.width,
          }}
        />
      </div>
    </div>
  );
}
