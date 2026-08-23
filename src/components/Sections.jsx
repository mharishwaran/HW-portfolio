import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Mail, MapPin, ExternalLink, 
  Briefcase, GraduationCap, Award, Code2, Database, Layers, 
  CheckCircle2, ChevronRight, ChevronLeft, FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Github = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Slide motion variants for transitions
const sectionVariants = {
  initial: { opacity: 0, scale: 0.95, y: 15, filter: 'blur(8px)' },
  animate: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 1.05, y: -15, filter: 'blur(8px)', transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
};

const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

// 1. HERO SECTION
export function HeroSection({ onNavigate }) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-start justify-center min-h-[80vh] max-w-xl md:max-w-2xl px-6 md:px-12 pointer-events-auto"
    >
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
        <div className="space-y-2">
          <motion.h1 variants={staggerItem} className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none font-sans">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Harishwaran</span>
          </motion.h1>
          <motion.p variants={staggerItem} className="text-xl sm:text-2xl font-semibold tracking-wide text-slate-300 font-sans">
            Full Stack Developer
          </motion.p>
        </div>

        <motion.p variants={staggerItem} className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg">
          Passionate Full Stack Developer focused on building modern, scalable web applications with the MERN stack. I enjoy turning ideas into clean, functional, and user-friendly digital experiences.
        </motion.p>

        <motion.div variants={staggerItem} className="flex flex-wrap gap-4 pt-2">
          <button
            id="hero-cta-projects"
            onClick={() => onNavigate('projects')}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white font-semibold rounded-full shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
          >
            <span>Explore My Work</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            id="hero-cta-contact"
            onClick={() => onNavigate('contact')}
            className="flex items-center gap-2 px-6 py-3.5 glass-panel hover:bg-white/5 text-slate-200 border border-white/10 font-semibold rounded-full transition-all active:scale-[0.98]"
          >
            <span>Get In Touch</span>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// 2. ABOUT SECTION
export function AboutSection({ onNavigate }) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-start justify-center min-h-[85vh] max-w-xl md:max-w-2xl px-6 md:px-12 pointer-events-auto"
    >
      <div className="space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">About Me</h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
          I am a Full Stack Developer with a strong interest in building scalable and reliable web applications. My primary focus is the MERN stack, with hands-on experience in React, Node.js, Express.js, MongoDB, REST APIs, authentication, and backend development. I enjoy solving real-world problems through software and continuously improving my skills in modern web technologies.
        </p>

        {/* Education Timeline */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-indigo-400 font-bold font-mono flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            Education Background
          </h3>
          <div className="relative pl-4 border-l border-indigo-500/30 space-y-3">
            <div>
              <div className="flex items-center justify-between flex-wrap gap-1">
                <h4 className="text-sm sm:text-base font-semibold text-white">B.E Mechanical Engineering</h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Graduation 2027</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">Hindusthan College of Engineering and Technology</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-white/5 w-fit px-2.5 py-1 rounded-lg border border-white/5">
              <span>CGPA Score:</span>
              <span className="text-emerald-400 font-bold">8.3 / 10.0</span>
            </div>
          </div>
        </div>

        <button
          id="about-cta-skills"
          onClick={() => onNavigate('skills')}
          className="group flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <span>View my skills profile</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

// 3. SKILLS SECTION
const skillsData = {
  frontend: [
    { name: 'React.js', level: 90 },
    { name: 'JavaScript', level: 85 },
    { name: 'HTML5', level: 90 },
    { name: 'CSS3', level: 85 },
    { name: 'Tailwind CSS', level: 90 }
  ],
  backend: [
    { name: 'Node.js', level: 85 },
    { name: 'Express.js', level: 85 },
    { name: 'MongoDB', level: 80 },
    { name: 'REST API', level: 80 },
    { name: 'JWT', level: 75 }
  ],
  tools_services: [
    { name: 'Git', level: 80 },
    { name: 'GitHub', level: 85 },
    { name: 'Postman', level: 75 },
    { name: 'Cloudinary', level: 45 },
    { name: 'Redis', level: 45 },
    { name: 'BullMQ', level: 40 },
    { name: 'Nodemailer', level: 60 }
  ]
};

export function SkillsSection({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('frontend');

  return (
    <motion.div
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-start justify-center min-h-[85vh] max-w-xl md:max-w-2xl px-6 md:px-12 pointer-events-auto"
    >
      <div className="space-y-6 w-full">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Skills</h2>

        {/* Tab Controls */}
        <div className="flex gap-2 p-1 bg-slate-900/60 rounded-xl border border-white/5 w-full">
          {Object.keys(skillsData).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 py-2.5 rounded-lg text-xs uppercase tracking-widest font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600/35 text-indigo-300 border-b-2 border-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'frontend' && 'FRONTEND'}
              {cat === 'backend' && 'BACKEND'}
              {cat === 'tools_services' && 'TOOLS & SERVICES'}
            </button>
          ))}
        </div>

        {/* Skills Display List */}
        <div className="space-y-4 w-full">
          {skillsData[activeCategory].map((skill) => (
            <div key={skill.name} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  {activeCategory === 'frontend' && <Code2 className="w-4 h-4 text-indigo-400" />}
                  {activeCategory === 'backend' && <Database className="w-4 h-4 text-purple-400" />}
                  {activeCategory === 'tools_services' && <Layers className="w-4 h-4 text-pink-400" />}
                  {skill.name}
                </span>
                <span className="text-xs font-semibold text-indigo-400">{skill.level}%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full border border-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${
                    activeCategory === 'frontend' 
                      ? 'from-indigo-500 to-indigo-400' 
                      : activeCategory === 'backend' 
                        ? 'from-purple-500 to-purple-400' 
                        : 'from-pink-500 to-pink-400'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          id="skills-cta-projects"
          onClick={() => onNavigate('projects')}
          className="group flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <span>See these skills in project action</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

// 4. PROJECTS SECTION
export function ProjectsSection({ onNavigate }) {
  const projects = [
    {
      id: 1,
      title: 'Blood Donor Management System',
      desc: 'A MERN-based web application designed to help users find blood donors and handle emergency blood requests efficiently.',
      stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT', 'REST API'],
      category: 'FULL STACK APP',
      link: 'https://blood-donor-management-system-v2.netlify.app/'
    }
  ];

  return (
    <motion.div
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-start justify-center min-h-[85vh] max-w-xl md:max-w-2xl px-6 md:px-12 pointer-events-auto"
    >
      <div className="space-y-6 w-full">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Projects</h2>

        <div className="space-y-4 w-full">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden transition-all duration-300 group hover:border-indigo-500/35 hover:shadow-indigo-500/5 hover:shadow-xl"
              whileHover={{ y: -3 }}
            >
              <div className="absolute inset-0 bg-radial from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-indigo-400 font-mono tracking-widest uppercase">{project.category}</span>
                <div className="flex gap-2">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Live Demo"
                    aria-label="View Live Demo"
                    className="p-1.5 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-indigo-300 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mt-2 group-hover:text-indigo-200 transition-colors">
                {project.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed font-light">
                {project.desc}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {project.stack.map((tech) => (
                  <span 
                    key={tech} 
                    className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <button
          id="projects-cta-experience"
          onClick={() => onNavigate('experience')}
          className="group flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <span>View my work experience</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

// 5. EXPERIENCE / INTERNSHIP SECTION
export function ExperienceSection({ onNavigate }) {
  const [showCertModal, setShowCertModal] = useState(false);

  return (
    <motion.div
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-start justify-center min-h-[85vh] max-w-xl md:max-w-2xl px-6 md:px-12 pointer-events-auto"
    >
      <div className="space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Work Experience</h2>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          {/* Glowing dot effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-indigo-400 font-mono tracking-widest font-bold uppercase">July 2026</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">MERN Stack Intern</h3>
              <p className="text-sm text-slate-400 font-medium">WSA (Web Stack Academy)</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed font-light">
            Completed a comprehensive industrial internship focusing on the MERN stack. Worked on the <strong>Food Genie – AI Food Ordering App</strong> project, gaining hands-on experience in full-stack web development, API design, database schemas, and modern frontend styling.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div>
              <h4 className="text-xs text-slate-500 font-mono uppercase">Role Type</h4>
              <p className="text-sm font-semibold text-slate-200 mt-1">Full Stack Development</p>
            </div>
            <div>
              <h4 className="text-xs text-slate-500 font-mono uppercase">Status</h4>
              <p className="text-sm font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
              </p>
            </div>
          </div>
        </div>

        <button
          id="experience-cta-certs"
          onClick={() => setShowCertModal(true)}
          className="group flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <span>View Internship Certificate</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {showCertModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel max-w-2xl w-full p-4 sm:p-6 rounded-3xl border border-indigo-500/30 space-y-4 shadow-2xl relative"
          >
            <div className="pt-4">
              <img 
                src="/assets/wsa_internship_certificate.png" 
                className="w-full h-auto rounded-2xl border border-indigo-500/20 shadow-2xl" 
                alt="WSA MERN Stack Internship Certificate" 
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowCertModal(false)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

// 6. CERTIFICATIONS SECTION
export function CertificationsSection({ onNavigate }) {
  const [selectedCert, setSelectedCert] = useState(null);
  const [activeCategory, setActiveCategory] = useState('INTERNSHIPS');
  
  const trackRef = useRef(null);
  const containerRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const dragDistance = useRef(0);

  const [containerWidth, setContainerWidth] = useState(1024);

  const certificates = [
    {
      id: 'wsa-mern',
      title: 'MERN Stack Internship Certificate',
      issuer: 'WSA (Web Stack Academy)',
      date: '3 June 2026 – 3 July 2026',
      desc: 'Project: Food Genie – AI Food Ordering App | Credential ID: WMSI26_007. Validates professional expertise in building scalable MERN stack web applications and full-stack architecture.',
      color: 'from-indigo-600/20 to-purple-600/20',
      image: '/assets/wsa_internship_certificate.png'
    },
    {
      id: 'udemy-webdev',
      title: 'Complete Web Development Course',
      issuer: 'Udemy',
      date: 'July 18, 2026',
      desc: '100 total hours of comprehensive training in modern frontend and backend web development technologies.',
      color: 'from-indigo-600/20 to-blue-600/20',
      image: '/assets/udemy_web_dev.png'
    },
    {
      id: 'chatgpt-masterclass',
      title: 'ChatGPT Masterclass',
      issuer: 'NoviTech R&D Private Limited',
      date: 'January 22, 2026 – February 25, 2026',
      desc: 'Comprehensive Masterclass covering advanced AI prompt engineering, chatbot development, and GPT-based solutions.',
      color: 'from-purple-600/20 to-pink-600/20',
      image: '/assets/chatgpt_masterclass.png'
    },
    {
      id: 'uniq-react',
      title: 'JavaScript with React JS',
      issuer: 'Uniq Technologies',
      date: 'February 5, 2026',
      desc: 'Professional training in advanced JavaScript concepts and React.js library for building dynamic user interfaces.',
      color: 'from-teal-600/20 to-emerald-600/20',
      image: '/assets/uniq_react.png'
    },
    {
      id: 'cil-webinar',
      title: 'Full Stack Web Development Online Webinar',
      issuer: 'Center for Innovation and Software Learning (CIL)',
      date: 'February 2, 2026',
      desc: 'Hands-on training session covering the fundamentals of full stack web development architectures.',
      color: 'from-blue-600/20 to-cyan-600/20',
      image: '/assets/cil_webinar.png'
    },
    {
      id: 'novitech-events',
      title: 'Frontend Bootcamp: Events in JavaScript',
      issuer: 'NoviTech R&D Private Limited',
      date: 'February 15, 2026',
      desc: 'Intensive boot camp focused on event-driven programming, DOM manipulation, and asynchronous JavaScript.',
      color: 'from-indigo-600/20 to-sky-600/20',
      image: '/assets/novitech_events.png'
    },
    {
      id: 'guvi-genai',
      title: 'Generative AI Engineering: Foundations, RAG & Deployment',
      issuer: 'GUVI Geek Networks / HCL',
      date: 'May 30, 2026',
      desc: 'Practical workshop covering Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), and deployment strategies.',
      color: 'from-green-600/20 to-teal-600/20',
      image: '/assets/guvi_genai.png'
    },
    {
      id: 'letsupgrade-htmlcss',
      title: 'HTML & CSS Bootcamp',
      issuer: 'LetsUpgrade',
      date: 'January 15, 2026 – January 17, 2026',
      desc: 'Practical boot camp covering semantic HTML5 structures and advanced CSS3 styling paradigms.',
      color: 'from-orange-600/20 to-amber-600/20',
      image: '/assets/letsupgrade_html_css.png'
    },
    {
      id: 'letsupgrade-python',
      title: 'Python Bootcamp',
      issuer: 'LetsUpgrade',
      date: 'January 20, 2026 – January 22, 2026',
      desc: 'Fundamental programming principles, data structures, and algorithmic logic implemented in Python.',
      color: 'from-yellow-600/20 to-orange-600/20',
      image: '/assets/letsupgrade_python.png'
    },
    {
      id: 'letsupgrade-urlparams',
      title: 'URL Search Params Essentials: Modern JS Mini Workshop',
      issuer: 'LetsUpgrade',
      date: 'January 27, 2026',
      desc: 'Focused mini-workshop covering Web APIs, URL query parameter parsing, state management, and modern JavaScript techniques.',
      color: 'from-red-600/20 to-pink-600/20',
      image: '/assets/letsupgrade_url_params.png'
    },
    {
      id: 'bolt-python',
      title: 'Python Full Stack Workshop',
      issuer: 'Bolt Academy',
      date: 'September 2025',
      desc: 'Comprehensive training in Python-based full stack technologies, databases, and deployment pipelines.',
      color: 'from-violet-600/20 to-fuchsia-600/20',
      image: '/assets/bolt_python.png'
    }
  ];

  const filteredCerts = certificates.filter(cert => {
    if (activeCategory === 'INTERNSHIPS') {
      return cert.id === 'wsa-mern';
    } else if (activeCategory === 'COURSES') {
      return cert.id === 'udemy-webdev' || cert.id === 'chatgpt-masterclass' || cert.id === 'uniq-react';
    } else if (activeCategory === 'WORKSHOPS') {
      return cert.id !== 'wsa-mern' && cert.id !== 'udemy-webdev' && cert.id !== 'chatgpt-masterclass' && cert.id !== 'uniq-react';
    }
    return true;
  });

  const cardWidth = typeof window !== 'undefined' && window.innerWidth >= 640 ? 320 : 280;
  const gap = 20;
  const step = cardWidth + gap;

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [filteredCerts]);

  const visibleCardsCount = Math.max(1, Math.floor((containerWidth + gap) / step));
  const maxIndex = Math.max(0, filteredCerts.length - visibleCardsCount);

  // Clamp current index if filtered certificates change or screen resizes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX;
    dragDistance.current = 0;
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const currentX = e.pageX;
    const diff = currentX - startX.current;
    dragDistance.current = Math.abs(diff);
    setDragOffset(diff);
  };

  const handlePointerUpOrLeave = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    const dragThreshold = 80;
    let newIndex = currentIndex;
    if (dragOffset < -dragThreshold && currentIndex < maxIndex) {
      newIndex = currentIndex + 1;
    } else if (dragOffset > dragThreshold && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    setCurrentIndex(newIndex);
    setDragOffset(0);

    // Prevent click on drag
    if (dragDistance.current > 5) {
      e.stopPropagation();
      const preventClick = (clickEvent) => {
        clickEvent.stopImmediatePropagation();
        clickEvent.preventDefault();
        if (trackRef.current) {
          trackRef.current.removeEventListener('click', preventClick, true);
        }
      };
      if (trackRef.current) {
        trackRef.current.addEventListener('click', preventClick, true);
      }
    }
  };

  const lastWheelTime = useRef(0);
  const handleCarouselWheel = (e) => {
    if (Math.abs(e.deltaY) > 10) {
      const now = performance.now();
      if (now - lastWheelTime.current < 450) return; // throttle

      if (e.deltaY > 0 && currentIndex < maxIndex) {
        setCurrentIndex(prev => prev + 1);
        lastWheelTime.current = now;
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        lastWheelTime.current = now;
      }
    }
  };

  const scroll = (direction) => {
    if (direction === 'left' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (direction === 'right' && currentIndex < maxIndex) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const showLeftArrow = currentIndex > 0;
  const showRightArrow = currentIndex < maxIndex;

  const translateX = -currentIndex * step + dragOffset;

  return (
    <motion.div
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-start justify-center min-h-[85vh] max-w-xl md:max-w-4xl lg:max-w-5xl w-full px-6 md:px-12 pointer-events-auto"
    >
      <div className="space-y-6 w-full">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Certifications</h2>

        {/* Category Navigation */}
        <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs sm:text-sm font-bold tracking-widest text-slate-400 uppercase select-none w-full">
          {['INTERNSHIPS', 'COURSES', 'WORKSHOPS'].map((cat, idx) => (
            <React.Fragment key={cat}>
              {idx > 0 && <span className="text-slate-600">|</span>}
              <button
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentIndex(0);
                }}
                className={`transition-colors duration-300 py-1 border-b-2 focus:outline-none ${
                  activeCategory === cat 
                    ? 'text-indigo-400 border-indigo-500 font-extrabold' 
                    : 'text-slate-400 hover:text-slate-200 border-transparent font-medium'
                }`}
              >
                {cat}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Carousel Container */}
        <div ref={containerRef} className="relative w-full group/carousel">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-slate-900/80 border border-white/10 hover:border-indigo-500/50 backdrop-blur-md rounded-full text-slate-400 hover:text-indigo-400 transition-all duration-300 shadow-lg focus:outline-none hidden md:block"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Viewport wrapper (with overflow-hidden, sizes itself to 1 card when only 1 exists) */}
          <div
            id="cert-carousel"
            className={`overflow-hidden pointer-events-auto ${
              filteredCerts.length === 1 ? "w-[280px] sm:w-[320px]" : "w-full"
            }`}
          >
            {/* The actual hardware-accelerated translation track */}
            <div
              ref={trackRef}
              onWheel={handleCarouselWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUpOrLeave}
              onPointerLeave={handlePointerUpOrLeave}
              style={{
                transform: `translateX(${translateX}px)`,
                transition: isDragging.current ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                touchAction: 'pan-y'
              }}
              className="flex flex-row gap-5 py-4 w-max select-none cursor-grab active:cursor-grabbing"
            >
              {filteredCerts.map((cert) => (
                <div
                  key={cert.id}
                  className={`flex-none w-[280px] sm:w-[320px] glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-indigo-500/35 hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br ${cert.color}`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="p-2 rounded-xl bg-white/5 border border-white/5 text-indigo-400">
                        <Award className="w-5 h-5" />
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">{cert.date}</span>
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-200">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-indigo-300 font-medium font-mono mt-0.5">{cert.issuer}</p>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-3">
                      {cert.desc}
                    </p>
                  </div>

                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCert(cert);
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 cursor-pointer group/link select-none w-fit"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-400 group-hover/link:text-purple-300 transition-colors" />
                    <span className="group-hover/link:underline underline-offset-2">View Certificate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-slate-900/80 border border-white/10 hover:border-indigo-500/50 backdrop-blur-md rounded-full text-slate-400 hover:text-indigo-400 transition-all duration-300 shadow-lg focus:outline-none hidden md:block"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {selectedCert && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel max-w-2xl w-full p-4 sm:p-6 rounded-3xl border border-indigo-500/30 space-y-4 shadow-2xl relative"
          >
            <div className="pt-4">
              <img 
                src={selectedCert.image} 
                className="w-full h-auto rounded-2xl border border-indigo-500/20 shadow-2xl" 
                alt={selectedCert.title} 
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <button
        id="certs-cta-contact"
        onClick={() => onNavigate('contact')}
        className="group flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors text-left mt-4"
      >
        <span>Get in touch for collaborations</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}

// 7. CONTACT SECTION
export function ContactSection() {
  return (
    <motion.div
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-start justify-center min-h-[85vh] max-w-xl md:max-w-2xl px-6 md:px-12 pointer-events-auto"
    >
      <div className="space-y-6 w-full">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Contact Me</h2>

        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6 w-full">
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
            Feel free to connect with me through the links below. I’ll get back to you as soon as possible!
          </p>

          <div className="space-y-5">
            {/* Location Card */}
            <div className="flex items-center gap-3 p-3.5 bg-white/5 border border-white/5 rounded-2xl text-slate-300 text-xs sm:text-sm w-full sm:w-fit min-w-[220px]">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">LOCATION</p>
                <p className="font-semibold mt-0.5">Tamil Nadu, India</p>
              </div>
            </div>

            {/* Social & Contact Icons */}
            <div className="space-y-2.5 pt-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold">CONNECT</p>
              <div className="flex items-center gap-3">
                <a 
                  href="mailto:harishwaranmoorthy2005@gmail.com"
                  id="social-email"
                  aria-label="Email"
                  className="p-3 rounded-full bg-white/5 hover:bg-indigo-500/15 border border-white/5 hover:border-indigo-500/30 text-slate-400 hover:text-indigo-300 transition-all hover:scale-105 active:scale-95"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a 
                  href="https://github.com/mharishwaran" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  id="social-github"
                  aria-label="GitHub"
                  className="p-3 rounded-full bg-white/5 hover:bg-indigo-500/15 border border-white/5 hover:border-indigo-500/30 text-slate-400 hover:text-indigo-300 transition-all hover:scale-105 active:scale-95"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/harishwaran-m-/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  id="social-linkedin"
                  aria-label="LinkedIn"
                  className="p-3 rounded-full bg-white/5 hover:bg-indigo-500/15 border border-white/5 hover:border-indigo-500/30 text-slate-400 hover:text-indigo-300 transition-all hover:scale-105 active:scale-95"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
