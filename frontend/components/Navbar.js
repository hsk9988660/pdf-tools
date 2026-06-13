'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, FileText, ChevronDown, Moon, Sun, Combine, Scissors, Shrink, RotateCw, Droplets, Hash, ImagePlus, FileImage } from 'lucide-react';
import { Button } from './ui/button';

const navItems = [
  { href: '/merge', label: 'Merge PDF', icon: Combine },
  { href: '/split', label: 'Split PDF', icon: Scissors },
  { href: '/compress', label: 'Compress PDF', icon: Shrink },
  { href: '/rotate', label: 'Rotate PDF', icon: RotateCw },
  { href: '/watermark', label: 'Watermark', icon: Droplets },
  { href: '/page-numbers', label: 'Page Numbers', icon: Hash },
  { href: '/jpg-to-pdf', label: 'JPG to PDF', icon: ImagePlus },
  { href: '/pdf-to-jpg', label: 'PDF to JPG', icon: FileImage },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setToolsOpen(false);
  }, [pathname]);

  // Close tools dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm'
          : 'bg-white dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-800/50'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-slate-900 dark:text-white">PDF</span>
            <span className="text-primary">Tools</span>
          </span>
        </Link>

        {/* Desktop Nav - Centered with Linear-style dropdown */}
        <nav className="hidden lg:flex items-center gap-1 mx-4">
          {/* All Tools Dropdown */}
          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                ${toolsOpen || navItems.some(i => pathname === i.href)
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              All Tools
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {toolsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/20 animate-scale-in overflow-hidden">
                <div className="p-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                          ${isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                      >
                        <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${isActive ? 'bg-primary/15 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="hidden sm:flex rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu - Full width dropdown with icons */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white/95 backdrop-blur-xl dark:bg-slate-950/95">
          <nav className="flex flex-col px-4 py-3 max-w-7xl mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  <div className={`w-7 h-7 flex items-center justify-center rounded-lg ${isActive ? 'bg-primary/15' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`} />
                  </div>
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="w-full justify-start text-slate-600 dark:text-slate-300"
              >
                {darkMode ? (
                  <Sun className="h-4 w-4 mr-2 text-amber-500" />
                ) : (
                  <Moon className="h-4 w-4 mr-2" />
                )}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
