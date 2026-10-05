import React from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({
  children,
  content,
  position = "top",
}: TooltipProps) {
  const positions = {
    top: {
      tooltip: "bottom-full left-1/2 mb-2 -translate-x-1/2",
      arrow:
        "left-1/2 top-full -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-gray-900",
    },

    bottom: {
      tooltip: "left-1/2 top-full mt-2 -translate-x-1/2",
      arrow:
        "bottom-full left-1/2 -translate-x-1/2 border-x-[5px] border-b-[5px] border-x-transparent border-b-gray-900",
    },

    left: {
      tooltip: "right-full top-1/2 mr-2 -translate-y-1/2",
      arrow:
        "left-full top-1/2 -translate-y-1/2 border-y-[5px] border-l-[5px] border-y-transparent border-l-gray-900",
    },

    right: {
      tooltip: "left-full top-1/2 ml-2 -translate-y-1/2",
      arrow:
        "right-full top-1/2 -translate-y-1/2 border-y-[5px] border-r-[5px] border-y-transparent border-r-gray-900",
    },
  };

  const current = positions[position];

  return (
    <div className="group relative inline-flex">
      {children}
      <div
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg opacity-0 scale-95 invisible transition-all duration-200 ease-out group-hover:visible group-hover:opacity-100 group-hover:scale-100

          ${current.tooltip}
        `}
      >
        {content}

        {/* Pointer */}
        <span
          className={`
            absolute h-0 w-0
            border-solid
            ${current.arrow}
          `}
        />
      </div>
    </div>
  );
}
