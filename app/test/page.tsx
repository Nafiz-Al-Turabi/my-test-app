"use client";
import React, { useState } from "react";

export default function TestPage() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-black px-5 py-3 text-white"
      >
        Open Modal
      </button>
     
    </div>
  );
}
