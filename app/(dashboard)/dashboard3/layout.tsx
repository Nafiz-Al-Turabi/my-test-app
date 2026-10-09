"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome, FiUsers, FiFileText, FiSettings,
  FiSearch, FiBell, FiMenu, FiX, FiCommand
} from "react-icons/fi";

export default function Dashboard2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard2", icon: <FiHome size={20} /> },
    { name: "Users & Roles", href: "/dashboard2/users", icon: <FiUsers size={20} /> },
    { name: "Reports", href: "/dashboard2/reports", icon: <FiFileText size={20} /> },
  ];

  return (
    // মূল ব্যাকগ্রাউন্ড একটু গ্রে (Gray) থাকবে, যাতে ভেতরের সাদা কার্ডগুলো ফুটে ওঠে
    <div className="h-screen w-full bg-[#f0f2f5] p-3 md:p-4 font-sans text-gray-800 flex flex-col md:flex-row gap-4 overflow-hidden">

      {/* ==========================================
          MODULAR SIDEBAR (Desktop)
      ========================================== */}
      <aside className="hidden md:flex flex-col w-64 bg-white rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden shrink-0">
        
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-gray-50 shrink-0">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-gray-900">
            <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-sm shadow-md">
              N
            </div>
            Nafiz UI
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-medium text-sm ${
                  isActive
                    ? "bg-black text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Action */}
        <div className="p-4 border-t border-gray-50 shrink-0">
          <Link 
            href="/dashboard2/settings" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-medium text-sm ${
              pathname === "/dashboard2/settings" 
              ? "bg-black text-white shadow-md" 
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <FiSettings size={20} /> Settings
          </Link>
        </div>
      </aside>

      {/* ==========================================
          RIGHT SIDE (HEADER + CONTENT AREA)
      ========================================== */}
      <div className="flex-1 flex flex-col min-w-0 gap-4">

        {/* MODULAR HEADER */}
        <header className="h-16 md:h-20 bg-white rounded-4xl md:rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between px-4 md:px-6 shrink-0">
          
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2.5 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <FiMenu size={20} />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100 w-96 focus-within:ring-2 focus-within:ring-black/5 transition-all">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
            />
            <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold bg-white px-1.5 py-0.5 rounded shadow-sm border border-gray-100">
              <FiCommand size={10} /> K
            </div>
          </div>

          <div className="md:hidden font-bold text-gray-800">Dashboard</div>

          {/* Profile & Notifications */}
          <div className="flex items-center gap-3 md:gap-4">
            <button className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-100 relative">
              <FiBell size={18} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 border border-white rounded-full"></span>
            </button>
            <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:scale-105 transition-transform">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nafiz" 
                alt="Nafiz" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </header>

        {/* MODULAR MAIN CONTENT */}
        <main className="flex-1 bg-white rounded-4xl md:rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-4 md:p-8 overflow-y-auto">
          {/* আপনার চিলড্রেন কন্টেন্ট এখানে লোড হবে */}
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </div>

      {/* ==========================================
          MOBILE MENU OVERLAY
      ========================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          
          {/* Mobile Sidebar */}
          <div className="relative w-4/5 max-w-75 bg-white h-full p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-left duration-300 rounded-r-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 font-bold text-xl text-gray-900">
                <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-sm shadow-md">N</div>
                Nafiz UI
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-medium text-sm ${
                      isActive
                        ? "bg-black text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
      
    </div>
  );
}