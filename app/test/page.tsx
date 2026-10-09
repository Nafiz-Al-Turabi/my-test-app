"use client";
import React, { useState } from "react";
import Modal from "react-nat-modal";

export default function TestPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-black px-5 py-3 text-white"
      >
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Welcome to react-nat-modal"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>
            <button className="rounded-lg bg-black px-4 py-2 text-white">
              Create
            </button>
          </div>
        }
      >
        <p>This is the modal body content.</p>
      </Modal>
    </div>
  );
}
