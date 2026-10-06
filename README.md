# 🚀 My Test App - UI Component Library & Guide

A modern, high-performance React & Next.js 16 UI component collection styled with Tailwind CSS, Lucide icons, and GSAP animations.

---

## 📑 Table of Contents
1. [Button](#1-button)
2. [GenieModal (macOS Genie Animation)](#2-geniemodal-macos-genie-effect)
3. [Modal (Standard Modal)](#3-modal-standard-dialog)
4. [CustomSelect (Single Select)](#4-customselect-single-select)
5. [MultiSelect (Searchable & Tags)](#5-multiselect-multi-select--tags)
6. [Tabs (Animated Pill Indicator)](#6-tabs-animated-sliding-pill)
7. [Tabs2 (URL Query / Next.js Router Synced)](#7-tabs2-url-query--routing-synced)
8. [Tooltip](#8-tooltip)

---

## 1. Button

Flexible button with multiple variants, loading spinner, sizing, and icon support.

### 📍 Import
```tsx
import Button from "@/components/Button/Button";
import { Plus, Trash2, ArrowRight } from "lucide-react";
```

### 💻 Usage
```tsx
// Basic variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Approve</Button>
<Button variant="danger">Delete</Button>
<Button variant="warning">Warning</Button>
<Button variant="info">View Details</Button>
<Button variant="outline">Edit</Button>
<Button variant="ghost">More</Button>
<Button variant="link">Learn more</Button>

// Sizes & Icons
<Button size="sm">Small</Button>
<Button size="lg" leftIcon={<Plus size={18} />}>Add User</Button>
<Button variant="outline" rightIcon={<ArrowRight size={17} />}>Continue</Button>

// Loading State
<Button loading loadingText="Saving...">Save</Button>

// Full width
<Button fullWidth variant="success">Submit</Button>
```

### ⚙️ Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'outline' \| 'ghost' \| 'link'` | `'primary'` | Visual style variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'icon'` | `'md'` | Button size |
| `loading` | `boolean` | `false` | Shows loading spinner and disables click |
| `loadingText`| `string` | `undefined` | Optional text shown when `loading` is true |
| `leftIcon` | `ReactNode` | `undefined` | Icon placed before text |
| `rightIcon` | `ReactNode` | `undefined` | Icon placed after text |
| `fullWidth` | `boolean` | `false` | Expands button to 100% width |

---

## 2. GenieModal (macOS Genie Effect)

A modal window that uses the classic **macOS Genie effect** (powered by GSAP). When opened, it smoothly emerges out of a target button, and when closed, it sucks back into that exact button!

### 📍 Import
```tsx
import GenieModal from "@/components/Modal/GenieModal";
import { useRef, useState } from "react";
```

### 💻 Usage
```tsx
export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      {/* 1. Origin Button with ref */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl"
      >
        Open Genie Modal
      </button>

      {/* 2. GenieModal */}
      <GenieModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        originRef={buttonRef}
        className="bg-white dark:bg-zinc-900" // Modal card styling
        backdropClassName="bg-black/50 backdrop-blur-[2px]" // Optional backdrop styling
      >
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Genie Effect Window</h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            This window springs right out of the clicked button.
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded-lg">
              Close
            </button>
          </div>
        </div>
      </GenieModal>
    </div>
  );
}
```

### ⚙️ Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isOpen` | `boolean` | **Required** | Controls open / close state |
| `onClose` | `() => void` | **Required** | Callback when backdrop / ESC is pressed |
| `originRef` | `RefObject<HTMLElement>` | `undefined` | The trigger element the modal springs from and collapses back into |
| `className` | `string` | `'bg-white dark:bg-zinc-900'` | Custom styling for the modal content box |
| `backdropClassName` | `string` | `'bg-black/50 backdrop-blur-[2px]'` | Custom backdrop overlay styles |

---

## 3. Modal (Standard Dialog)

Clean, accessible dialog with header, body, footer, smooth fade/scale transitions, and keyboard/backdrop closing.

### 📍 Import
```tsx
import Modal from "@/components/Modal/Modal";
import { useState } from "react";
```

### 💻 Usage
```tsx
export default function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Announcement"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button className="px-4 py-2 bg-black text-white rounded-lg">
              Save
            </button>
          </div>
        }
      >
        <p>Modal body content goes here.</p>
      </Modal>
    </>
  );
}
```

### ⚙️ Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isOpen` | `boolean` | **Required** | Open / close state |
| `onClose` | `() => void` | **Required** | Close handler |
| `title` | `string` | `'Modal'` | Modal title displayed in header |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Modal dialog width |
| `footer` | `ReactNode` | `undefined` | Optional footer actions component |

---

## 4. CustomSelect (Single Select)

Custom dropdown select with smart directional flip (opens up or down depending on available viewport space), search, and keyboard handling.

### 📍 Import
```tsx
import CustomSelect from "@/components/Select/Select";
import { useState } from "react";
```

### 💻 Usage
```tsx
const options = [
  { label: "React.js", value: "react" },
  { label: "Next.js", value: "next" },
  { label: "Vue.js", value: "vue" },
  { label: "Nuxt.js", value: "nuxt" },
];

export default function Example() {
  const [framework, setFramework] = useState("");

  return (
    <div className="w-64">
      <CustomSelect
        options={options}
        value={framework}
        onChange={setFramework}
        placeholder="Select framework"
      />
    </div>
  );
}
```

### ⚙️ Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `options` | `Array<{ label: string; value: string }>` | **Required** | List of selectable options |
| `value` | `string` | `undefined` | Currently selected value |
| `onChange` | `(value: string) => void` | `undefined` | Selection change callback |
| `placeholder`| `string` | `'Select an option'` | Placeholder text |
| `disabled` | `boolean` | `false` | Disables interaction |

---

## 5. MultiSelect (Multi-Select & Tags)

Feature-packed multi-selection component supporting tags, real-time search filtering, Select All, badge counters, and clear buttons.

### 📍 Import
```tsx
import MultiSelect from "@/components/Select/MultiSelect";
import { useState } from "react";
```

### 💻 Usage
```tsx
const frameworks = [
  { label: "React.js", value: "react" },
  { label: "Next.js", value: "next" },
  { label: "Vue.js", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
];

export default function Example() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="w-80">
      <MultiSelect
        options={frameworks}
        value={selected}
        onChange={setSelected}
        placeholder="Select frameworks"
        searchable={true}
        selectAll={true}
        clearable={true}
      />
    </div>
  );
}
```

### ⚙️ Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `options` | `Array<{ label: string; value: string; disabled?: boolean }>` | **Required** | Options array |
| `value` | `string[]` | `[]` | Array of selected values |
| `onChange` | `(values: string[]) => void` | `undefined` | Triggered on select/deselect |
| `searchable` | `boolean` | `true` | Enables search input inside dropdown |
| `selectAll` | `boolean` | `true` | Shows "Select All" toggle |
| `clearable` | `boolean` | `true` | Shows quick clear (X) icon |
| `maxHeight` | `number` | `240` | Max height in px for options menu |

---

## 6. Tabs (Animated Sliding Pill)

Tab bar with a smooth sliding animated background indicator that glides under the active tab.

### 📍 Import
```tsx
import Tabs from "@/components/Tab/Tab";
```

### 💻 Usage
```tsx
<Tabs
  tabs={[
    { id: "tab1", label: "Overview" },
    { id: "tab2", label: "Analytics", count: 5 },
    { id: "tab3", label: "Settings" },
  ]}
  defaultTab="tab1"
  onChange={(tabId) => console.log("Active Tab:", tabId)}
/>
```

### ⚙️ Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `tabs` | `Array<{ id: string; label: string; icon?: ElementType; count?: number }>` | **Required** | Tab definitions |
| `defaultTab`| `string` | `tabs[0].id` | Initial active tab ID |
| `activeTab` | `string` | `undefined` | Controlled active tab ID |
| `onChange` | `(tabId: string) => void` | `undefined` | Tab change callback |

---

## 7. Tabs2 (URL Query / Routing Synced)

Next.js App Router friendly tab bar. Automatically synchronizes active tab state with URL search parameters (e.g., `?tab=tab2`), enabling deep-linking and browser back/forward history support.

### 📍 Import
```tsx
import Tabs2 from "@/components/Tab/Tab2";
import { useState } from "react";
```

### 💻 Usage
```tsx
export default function Example() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <Tabs2
      items={[
        { value: "tab1", label: "Profile" },
        { value: "tab2", label: "Security" },
        { value: "tab3", label: "Billing" },
      ]}
      value={activeTab}
      onChange={setActiveTab}
      queryKey="tab" // syncs with ?tab=... in URL
    />
  );
}
```

### ⚙️ Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `Array<{ value: string; label: ReactNode }>` | **Required** | Tabs array |
| `value` | `string` | `undefined` | Controlled active value |
| `onChange` | `(value: string) => void` | `undefined` | Change callback |
| `queryKey` | `string` | `'tab'` | URL query param name |

---

## 8. Tooltip

Accessible hover and focus tooltip with configurable direction and arrow pointer.

### 📍 Import
```tsx
import Tooltip from "@/components/Tooltip/Tooltip";
```

### 💻 Usage
```tsx
<Tooltip content="Edit profile settings" position="top">
  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
    Hover Me
  </button>
</Tooltip>
```

### ⚙️ Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `content` | `string` | **Required** | Tooltip label text |
| `position`| `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Direction where tooltip appears |
| `children`| `ReactNode` | **Required** | Element wrapped by tooltip |

---

## 🛠️ Tech Stack & Dependencies
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [GSAP](https://gsap.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Package Manager**: [Bun](https://bun.sh/)
