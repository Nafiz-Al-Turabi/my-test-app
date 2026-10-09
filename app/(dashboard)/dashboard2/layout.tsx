"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiCompass,
  FiTrendingUp,
  FiFolder,
  FiMessageCircle,
  FiSettings,
  FiBell,
  FiSearch,
} from "react-icons/fi";

export default function Dashboard2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Discover", href: "/dashboard2", icon: <FiCompass size={22} /> },
    {
      name: "Analytics",
      href: "/dashboard2/analytics",
      icon: <FiTrendingUp size={22} />,
    },
    {
      name: "Projects",
      href: "/dashboard2/projects",
      icon: <FiFolder size={22} />,
    },
    {
      name: "Chats",
      href: "/dashboard2/chats",
      icon: <FiMessageCircle size={22} />,
    },
    {
      name: "Settings",
      href: "/dashboard2/settings",
      icon: <FiSettings size={22} />,
    },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {/* =======================================
          DESKTOP: FLOATING DARK SIDEBAR 
      ======================================= */}
      <aside className="hidden lg:flex flex-col my-4 ml-4 w-70 bg-slate-950 text-slate-300 rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Abstract Background Element for style */}
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-br from-indigo-600/20 to-transparent pointer-events-none" />

        {/* Brand/Logo */}
        <div className="flex h-20 items-center px-8 relative z-10">
          <span className="text-2xl font-bold text-white tracking-wide">
            Creative<span className="text-indigo-400">Dash</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-hide relative z-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span
                  className={`${isActive ? "text-white" : "text-slate-400"}`}
                >
                  {item.icon}
                </span>
                <span className="font-medium text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Mini Profile in Sidebar */}
        <div className="p-4 relative z-10">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=NafizAlTurabi"
              alt="Nafiz"
              className="h-10 w-10 rounded-full bg-slate-800 border-2 border-indigo-500/50"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                Nafiz Al Turabi
              </p>
              <p className="text-xs text-slate-400 truncate">Frontend Dev</p>
            </div>
          </div>
        </div>
      </aside>

      {/* =======================================
          MAIN CONTENT AREA 
      ======================================= */}
      <div className="flex flex-1 flex-col relative w-full h-full min-w-0 ">
        {/* Minimal Header */}
        <header className="flex h-20 items-center justify-between px-6 lg:px-10">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight hidden sm:block">
              Welcome back, Nafiz! 👋
            </h2>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight sm:hidden">
              CreativeDash
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-white px-4 py-2.5 rounded-full shadow-sm border border-slate-200/60">
              <FiSearch className="text-slate-400 mr-2" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm outline-none w-48 text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <button className="h-10 w-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-slate-200/60 text-slate-600 hover:text-indigo-600 transition-colors">
              <FiBell size={20} />
            </button>
          </div>
        </header>

        {/* Children Content */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-10 pb-28 lg:pb-8">
          <div className="">
            {children}
          </div>
        </main>
      </div>

      {/* =======================================
          MOBILE: FLOATING BOTTOM NAVIGATION 
      ======================================= */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
        <nav className="flex items-center justify-around bg-slate-950/95 backdrop-blur-xl text-slate-400 px-4 py-3.5 rounded-3xl shadow-2xl border border-slate-800/50">
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative p-2.5 rounded-2xl transition-all duration-300 ${
                  isActive ? "text-indigo-400" : "hover:text-white"
                }`}
              >
                {/* Active Indicator Dot */}
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
                {item.icon}
              </Link>
            );
          })}

          {/* Mobile Profile Trigger (Instead of Settings) */}
          <button className="p-1 rounded-full border-2 border-slate-800">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=NafizAlTurabi"
              alt="Nafiz"
              className="h-8 w-8 rounded-full"
            />
          </button>
        </nav>
      </div>
    </div>
  );
}
