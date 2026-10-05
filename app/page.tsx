"use client";

import Modal from "@/components/Modal/Modal";
import CustomSelect from "@/components/Select/Select";
import Tabs from "@/components/Tab/Tab";
import Tooltip from "@/components/Tooltip/Tooltip";
import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
const options = [
  { label: "React.js", value: "react" },
  { label: "Next.js", value: "next" },
  { label: "Vue.js", value: "vue" },
  { label: "Nuxt.js", value: "nuxt" },
];
export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  return (
    <div className="p-6">
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        Open Modal
      </button>
      <div className="w-64 mt-4">
        <CustomSelect
          options={options}
          value={value}
          onChange={setValue}
          placeholder="Select framework"
        />
      </div>
      <div className="mt-4">
        <Tooltip content="This is a tooltip" position="top">
          <button className=" rounded-lg bg-blue-500 px-4 py-2 text-white ">
            Hover me for tooltip
          </button>
        </Tooltip>
      </div>

      <div>
        <Tabs
          tabs={[
            { id: "tab1", label: "Tab 1" },
            { id: "tab2", label: "Tab 2" },
            { id: "tab3", label: "Tab 3" },
          ]}
          defaultTab="tab1"
          onChange={(tabId) => console.log("Active Tab:", tabId)}
          className="mt-4"
        />
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Announcement"
        size="lg"
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
        {/* Your form/content */}
        <div className="space-y-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
          quia eveniet cupiditate nisi, illo ea earum enim voluptatum nam
          expedita.
        </div>
      </Modal>
    </div>
  );
}
