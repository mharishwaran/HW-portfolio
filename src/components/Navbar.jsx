import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal, Cpu } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ activeSection, onSectionChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 py-4 md:py-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Logo / Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex items-center gap-2 cursor-pointer glass-panel px-4 py-2 rounded-full border border-indigo-500/20"
          onClick={() => onSectionChange('home')}
        >
          <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
          <span className="text-sm font-bold tracking-widest font-mono uppercase bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
            HW.DEV
          </span>
        </motion.div>

        {/* Desktop Navigation Pill */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="hidden md:flex items-center glass-panel p-1.5 rounded-full border border-white/5 relative"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onSectionChange(item.id)}
                className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors duration-300 z-10 ${
                  isActive ? 'text-indigo-100' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-indigo-500/20 border border-indigo-500/30 rounded-full -z-10"
                  />
                )}
                {item.label}
              </button>
            );
          })}
        </motion.nav>

        {/* Action Button (e.g. Quick Resume or Contact Trigger) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="hidden md:block"
        >
          <button
            id="nav-cta-contact"
            onClick={() => onSectionChange('contact')}
            className="glass-panel hover:bg-indigo-500/10 px-5 py-2.5 rounded-full border border-indigo-500/20 text-xs uppercase font-semibold tracking-wider text-indigo-300 hover:text-indigo-200 transition-all duration-300 active:scale-95"
          >
            Hire Me
          </button>
        </motion.div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <button
            id="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="glass-panel p-2.5 rounded-full border border-white/5 text-slate-300 focus:outline-none hover:text-indigo-400 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden mt-3 w-full glass-panel rounded-3xl border border-white/5 overflow-hidden pointer-events-auto shadow-2xl"
          >
            <div className="px-6 py-8 flex flex-col gap-4">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => {
                      onSectionChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-4 py-3 rounded-xl transition-all duration-200 uppercase tracking-widest text-xs font-bold flex items-center justify-between ${
                      isActive
                        ? 'bg-indigo-500/15 text-indigo-300 border-l-4 border-indigo-500'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    <Terminal className="w-4 h-4 opacity-50" />
                  </button>
                );
              })}

              <button
                id="mobile-nav-cta"
                onClick={() => {
                  onSectionChange('contact');
                  setMobileMenuOpen(false);
                }}
                className="mt-4 w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-500/20"
              >
                Hire Me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
