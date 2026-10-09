"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiGrid,
  FiSettings,
  FiMenu,
  FiX,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiUsers,
  FiMessageSquare,
  FiPieChart,
  FiLogOut,
} from "react-icons/fi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname(); // Active রাউট চেক করার জন্য

  // মেন্যু আইটেমগুলোকে গ্রুপ করা হয়েছে
  const menuGroups = [
    {
      title: "Main Menu",
      items: [
        { name: "Overview", href: "/dashboard", icon: <FiHome /> },
        {
          name: "Analytics",
          href: "/dashboard/analytics",
          icon: <FiPieChart />,
        },
        { name: "Projects", href: "/dashboard/projects", icon: <FiGrid /> },
      ],
    },
    {
      title: "Workspace",
      items: [
        { name: "Team Members", href: "/dashboard/team", icon: <FiUsers /> },
        {
          name: "Messages",
          href: "/dashboard/messages",
          icon: <FiMessageSquare />,
        },
        { name: "Settings", href: "/dashboard/settings", icon: <FiSettings /> },
      ],
    },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-all lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Area */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Logo Area */}
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-indigo-600">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FiGrid size={18} />
            </div>
            NexDash
          </div>
          <button
            className="ml-auto rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
          {menuGroups.map((group, index) => (
            <div key={index}>
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span
                        className={`text-lg ${isActive ? "text-indigo-600" : "text-slate-400"}`}
                      >
                        {item.icon}
                      </span>
                      {item.name}
                      {/* Optional: Add badge for Messages */}
                      {item.name === "Messages" && (
                        <span className="ml-auto rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-600">
                          3
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Profile / Logout section in Sidebar */}
        <div className="border-t border-slate-100 p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
            <FiLogOut className="text-lg text-slate-400 group-hover:text-red-600" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          {/* Mobile Menu Button & Search */}
          <div className="flex flex-1 items-center gap-4">
            <button
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiMenu size={24} />
            </button>

            {/* Global Search Bar */}
            <div className="hidden sm:flex max-w-md flex-1 items-center relative">
              <FiSearch className="absolute left-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search anything..."
                className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 sm:gap-5 ml-4">
            {/* Search Icon for Mobile */}
            <button className="sm:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <FiSearch size={20} />
            </button>

            {/* Notification Bell with Ping */}
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <FiBell size={20} />
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
              </span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* User Profile Dropdown Toggle */}
            <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-full hover:bg-slate-50 transition-colors">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nafiz"
                alt="Nafiz"
                className="h-8 w-8 rounded-full bg-indigo-100 border border-slate-200 object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-700 leading-none">
                  Nafiz Al Turabi
                </p>
                <p className="text-xs text-slate-500 mt-1">Admin</p>
              </div>
              <FiChevronDown
                className="hidden sm:block text-slate-400"
                size={16}
              />
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <div className="mx-auto max-w-7xl">
            {/* Page header slot can go here, but rendering children directly */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
