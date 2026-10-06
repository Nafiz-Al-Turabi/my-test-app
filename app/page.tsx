"use client";

import Button from "@/components/Button/Button";
import GenieModal from "@/components/Modal/GenieModal";
import Modal from "@/components/Modal/Modal";
import MultiSelect from "@/components/Select/MultiSelect";
import CustomSelect from "@/components/Select/Select";
import Tabs from "@/components/Tab/Tab";
import Tabs2 from "@/components/Tab/Tab2";
import Tooltip from "@/components/Tooltip/Tooltip";
import gsap from "gsap";
import { ArrowRight, Edit, Plus, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
const options = [
  { label: "React.js", value: "react" },
  { label: "Next.js", value: "next" },
  { label: "Vue.js", value: "vue" },
  { label: "Nuxt.js", value: "nuxt" },
];
const frameworks = [
  {
    label: "React.js",
    value: "react",
  },
  {
    label: "Next.js",
    value: "next",
  },
  {
    label: "Vue.js",
    value: "vue",
  },
  {
    label: "Nuxt.js",
    value: "nuxt",
  },
  {
    label: "Angular",
    value: "angular",
  },
  {
    label: "Svelte",
    value: "svelte",
  },
];
export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [activeTab, setActiveTab] = useState("tab1");
  const [selected, setSelected] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
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
      <div className="mt-4 bg-white">
        <Tabs2
          items={[
            { value: "tab1", label: "Tab 1" },
            { value: "tab2", label: "Tab 2" },
            { value: "tab3", label: "Tab 3" },
          ]}
          value={activeTab}
          onChange={setActiveTab}
          className="mt-4"
        />
      </div>
      <div className="w-80">
        <MultiSelect
          options={frameworks}
          value={selected}
          onChange={setSelected}
          placeholder="Select frameworks"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button>Create User</Button>
        <Button variant="success">Approve</Button>
        <Button variant="danger">Delete</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="info">View Details</Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="outline">Edit</Button>
        <Button variant="ghost">More</Button>
        <Button variant="link">Learn more</Button>
        <Button leftIcon={<Plus size={18} />}>Add User</Button>
        <Button variant="danger" leftIcon={<Trash2 size={17} />}>
          Delete
        </Button>
        <Button variant="outline" rightIcon={<ArrowRight size={17} />}>
          Continue
        </Button>
        <Button size="icon" variant="ghost">
          <Edit size={18} />
        </Button>
        <Button loading loadingText="Saving...">
          Save
        </Button>
        <Button fullWidth variant="success" size="xs">
          Submit
        </Button>
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
      <div className="min-h-screen flex items-center justify-start bg-zinc-100 dark:bg-zinc-950">
      <button
        ref={buttonRef}
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg hover:bg-blue-700 transition-colors"
      >
        Open Genie Modal
      </button>

      <GenieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        originRef={buttonRef}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Genie Effect Modal
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            This modal uses the classic macOS Genie animation powered by GSAP.
            It expands from the button and sucks back into it when closed.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              Confirm
            </button>
          </div>
        </div>
      </GenieModal>
    </div>  F
    </div>
  );
}
