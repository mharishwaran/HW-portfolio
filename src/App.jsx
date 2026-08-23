import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeCanvas from './components/ThreeCanvas';
import Navbar from './components/Navbar';
import { 
  HeroSection, AboutSection, SkillsSection, ProjectsSection, 
  ExperienceSection, CertificationsSection, ContactSection 
} from './components/Sections';
import { ChevronDown, Cpu, ChevronUp } from 'lucide-react';

const SECTIONS = ['home', 'about', 'skills', 'projects', 'experience', 'certifications', 'contact'];

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Canvas engine...');
  const scrollLock = useRef(false);
  const touchStartY = useRef(0);

  // 1. Loader screen progress bar animation
  useEffect(() => {
    if (!loading) return;
    
    const textSequence = [
      { progress: 20, text: 'Resolving MERN stack components...' },
      { progress: 45, text: 'Compiling WebGL materials...' },
      { progress: 70, text: 'Connecting Verlet physics solver...' },
      { progress: 90, text: 'Calibrating camera parallax rigs...' },
      { progress: 100, text: 'Portfolio load complete.' }
    ];

    const timer = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 800); // smooth fade
          return 100;
        }
        
        const nextProgress = prev + Math.floor(Math.random() * 8) + 2;
        const currentProgress = Math.min(nextProgress, 100);

        // Update console load text based on progress thresholds
        const step = textSequence.find(s => currentProgress >= s.progress - 10 && currentProgress <= s.progress);
        if (step) {
          setLoadingText(step.text);
        }

        return currentProgress;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [loading]);

  // 2. Throttled scroll section switcher (presentation slide mode)
  useEffect(() => {
    if (loading) return;

    const navigate = (direction) => {
      const currentIndex = SECTIONS.indexOf(activeSection);
      let nextIndex = currentIndex;

      if (direction === 'down' && currentIndex < SECTIONS.length - 1) {
        nextIndex = currentIndex + 1;
      } else if (direction === 'up' && currentIndex > 0) {
        nextIndex = currentIndex - 1;
      }

      if (nextIndex !== currentIndex) {
        setActiveSection(SECTIONS[nextIndex]);
        // Lock scrolling temporarily to allow slide transition to complete
        scrollLock.current = true;
        setTimeout(() => {
          scrollLock.current = false;
        }, 1000);
      }
    };

    const handleWheel = (e) => {
      // Ignore tiny jitter scroll
      if (Math.abs(e.deltaY) < 15) return;
      if (scrollLock.current) return;
      if (e.target.closest && e.target.closest('#cert-carousel')) return;
      
      const direction = e.deltaY > 0 ? 'down' : 'up';
      navigate(direction);
    };

    const handleKeyDown = (e) => {
      if (scrollLock.current) return;
      if (e.key === 'ArrowDown') {
        navigate('down');
      } else if (e.key === 'ArrowUp') {
        navigate('up');
      }
    };

    // Mobile Swipe Controls
    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (scrollLock.current) return;
      if (e.target.closest && e.target.closest('#cert-carousel')) return;
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      if (Math.abs(deltaY) > 60) { // minimum swipe distance
        const direction = deltaY > 0 ? 'down' : 'up';
        navigate(direction);
        touchStartY.current = touchEndY; // reset anchor
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeSection, loading]);

  const handleSectionSelect = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleNextSection = () => {
    const currentIndex = SECTIONS.indexOf(activeSection);
    if (currentIndex < SECTIONS.length - 1) {
      setActiveSection(SECTIONS[currentIndex + 1]);
    }
  };

  const handlePrevSection = () => {
    const currentIndex = SECTIONS.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(SECTIONS[currentIndex - 1]);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* 1. Introductory Boot Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(15px)' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-6"
          >
            <div className="max-w-md w-full space-y-6">
              <div className="flex items-center justify-center gap-3">
                <Cpu className="w-8 h-8 text-indigo-400 animate-spin" />
                <span className="font-mono text-lg font-bold tracking-widest text-indigo-200 uppercase">
                  HW.PORTFOLIO
                </span>
              </div>

              {/* High-tech progress console */}
              <div className="border border-white/5 bg-slate-950 p-4 rounded-xl font-mono text-[11px] sm:text-xs text-indigo-300/80 space-y-2 h-36 flex flex-col justify-end overflow-hidden shadow-2xl">
                <div>&gt; Loading dependencies... Done.</div>
                <div>&gt; Loading canvas scripts... Done.</div>
                <div className="text-indigo-400 font-semibold">&gt; {loadingText}</div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-white/5">
                  <span>PROGRESS STATUS</span>
                  <span className="font-bold">{loadProgress}%</span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${loadProgress}%` }}
                  transition={{ ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Interactive Three.js Background Layer */}
      {!loading && <ThreeCanvas activeSection={activeSection} />}

      {/* 3. Global Navbar */}
      {!loading && (
        <Navbar activeSection={activeSection} onSectionChange={handleSectionSelect} />
      )}

      {/* 4. Active Section Content Panels (Foreground Overlay) */}
      {!loading && (
        <main className="relative z-10 w-full min-h-screen flex items-center justify-start md:pl-16 pt-24 pb-20 select-text overflow-hidden">
          <div className="w-full">
            <AnimatePresence mode="wait">
              {activeSection === 'home' && (
                <HeroSection key="home" onNavigate={handleSectionSelect} />
              )}
              {activeSection === 'about' && (
                <AboutSection key="about" onNavigate={handleSectionSelect} />
              )}
              {activeSection === 'skills' && (
                <SkillsSection key="skills" onNavigate={handleSectionSelect} />
              )}
              {activeSection === 'projects' && (
                <ProjectsSection key="projects" onNavigate={handleSectionSelect} />
              )}
              {activeSection === 'experience' && (
                <ExperienceSection key="experience" onNavigate={handleSectionSelect} />
              )}
              {activeSection === 'certifications' && (
                <CertificationsSection key="certifications" onNavigate={handleSectionSelect} />
              )}
              {activeSection === 'contact' && (
                <ContactSection key="contact" />
              )}
            </AnimatePresence>
          </div>
        </main>
      )}

      {/* 5. Navigation Dots (Right Float Desk & Bottom Float Mobile) */}
      {!loading && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3 pointer-events-auto">
          {SECTIONS.map((sec, idx) => (
            <button
              key={sec}
              onClick={() => handleSectionSelect(sec)}
              title={sec.toUpperCase()}
              className="group flex items-center justify-end gap-3 p-1.5 focus:outline-none"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-slate-500 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {sec}
              </span>
              <div
                className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                  activeSection === sec
                    ? 'bg-indigo-400 border-indigo-400 scale-125 shadow-glow'
                    : 'bg-transparent border-slate-600 hover:border-slate-400 hover:scale-110'
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* 6. Interaction Prompt (Subtle bottom footer hint) */}
      {!loading && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity select-none pointer-events-none">
          {/* Arrow indicator to indicate scrolling is possible */}
          <div className="flex gap-4 mt-2">
            {SECTIONS.indexOf(activeSection) > 0 && (
              <button 
                onClick={handlePrevSection}
                className="p-1.5 bg-slate-900/60 border border-white/5 backdrop-blur-md rounded-full text-slate-400 hover:text-indigo-400 pointer-events-auto active:scale-95 transition-all"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
            {SECTIONS.indexOf(activeSection) < SECTIONS.length - 1 && (
              <button 
                onClick={handleNextSection}
                className="p-1.5 bg-slate-900/60 border border-white/5 backdrop-blur-md rounded-full text-slate-400 hover:text-indigo-400 pointer-events-auto active:scale-95 transition-all"
              >
                <ChevronDown className="w-4 h-4 animate-pulse" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
