import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { Menu, X, ArrowRight, Github, Twitter, Linkedin, Mail, Code2, Cpu, Globe, Zap, Layout, Search, Send, ChevronRight, BarChart3, Lock, Smartphone, MessageSquare, Star, Monitor } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { translations } from './translations';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Text } from '@react-three/drei';

// --- Language Context ---
const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('es'); // Default to Spanish

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => useContext(LanguageContext);

// --- Componente SEO (Simulado) ---
// En un entorno real, esto actualizaría el head del documento
const SEO = () => {
  const { lang } = useLanguage();
  useEffect(() => {
    document.title = lang === 'es' ? "Fasterplop | Desarrollo Web de Alto Rendimiento" : "Fasterplop | High Performance Web Development";
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
};

// --- Estilos Globales & Animaciones CSS ---
const GlobalStyles = () => (
  <style>{`
    html {
      scroll-behavior: smooth;
    }
    
    /* Cursor personalizado solo cuando está activo */
    body.custom-cursor-active, body.custom-cursor-active a, body.custom-cursor-active button {
      cursor: none;
    }

    /* Animación suave para gradientes de texto */
    @keyframes gradient-x {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    .animate-gradient-x {
      animation: gradient-x 3s ease infinite;
      background-size: 200% 200%;
    }
    
    /* Accesibilidad: Indicador de foco visual de alto contraste */
    :focus-visible {
      outline: 2px solid #10b981; /* Emerald-500 */
      outline-offset: 4px;
      border-radius: 4px;
    }

    /* Utilitario para textos con efecto "reveal" */
    .reveal-text {
      opacity: 0;
      animation: reveal 0.8s forwards;
    }
    @keyframes reveal {
      to { opacity: 1; transform: translateY(0); }
    }

    /* Marquee Animation for Tech Stack */
    @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
    .animate-marquee {
        animation: marquee 30s linear infinite;
        width: max-content;
    }
  `}</style>
);

// --- Custom Cursor ---
const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Detectar si es un dispositivo táctil
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        // Use a small timeout or just set state - normally setting state in useEffect is fine if it only happens once on mount
        // But to be safe and avoid lint errors or strict mode double invocation issues:
        const timer = setTimeout(() => {
             setIsVisible(true);
             document.body.classList.add('custom-cursor-active');
        }, 0);

        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            document.body.classList.remove('custom-cursor-active');
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
        >
            <div
                className={`absolute -translate-x-1/2 -translate-y-1/2 border-2 border-emerald-500 rounded-full transition-all duration-300 ease-out ${isHovering ? 'w-12 h-12 bg-emerald-500/20' : 'w-6 h-6'}`}
            />
            <div
                className={`absolute -translate-x-1/2 -translate-y-1/2 bg-emerald-500 rounded-full transition-all duration-300 ease-out ${isHovering ? 'w-2 h-2' : 'w-1 h-1'}`}
            />
        </div>
    );
};

// --- Hooks y Utilidades ---

const RevealOnScroll = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
    >
      {children}
    </div>
  );
};

const SpotlightCard = ({ children, className = "", hoverColor = "rgba(16, 185, 129, 0.15)" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${hoverColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// --- 3D Scene ---

const AnimatedSphere = () => {
    const mesh = useRef(null);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if(mesh.current) {
             mesh.current.rotation.x = t * 0.1;
             mesh.current.rotation.y = t * 0.15;
        }
    });

    return (
        <Sphere args={[1, 64, 64]} scale={2.8} ref={mesh}>
            <MeshDistortMaterial
                color="#047857" // emerald-700
                attach="material"
                distort={0.4}
                speed={1.5}
                roughness={0.2}
                metalness={0.8}
                wireframe={true}
            />
        </Sphere>
    );
};

const ThreeScene = () => (
    <div className="absolute inset-0 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <AnimatedSphere />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
    </div>
);


// --- Secciones Principales ---

const SectionHeader = ({ number, title, subtitle }) => (
  <RevealOnScroll>
    <header className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
      <div className="space-y-2">
        <span className="font-mono text-emerald-400 text-sm tracking-widest bg-emerald-400/10 px-2 py-1 rounded inline-block" aria-hidden="true">{number}</span>
        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">{title}</h2>
      </div>
      <p className="text-gray-300 max-w-sm text-right mt-4 md:mt-0 border-l-2 border-emerald-500 pl-4 text-lg">{subtitle}</p>
    </header>
  </RevealOnScroll>
);

const Hero = () => {
  const { t } = useLanguage();
  const [textIndex, setTextIndex] = useState(0);
  const rotatingTexts = [t.hero.title2, "SEO", "TECH", "A11Y"];

  useEffect(() => {
    const interval = setInterval(() => {
        setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  return (
    <section id="home" className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center pt-20" aria-label="Introducción">
      {/* 3D Background */}
      <ThreeScene />

      {/* Overlay to ensure text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black z-10"></div>
      
      <div className="relative z-20 container mx-auto px-6">
        <RevealOnScroll>
          <div className="flex flex-col items-start space-y-4 select-none">
            <h1 className="sr-only">Desarrollador Web de Alto Rendimiento</h1>

            <div className="text-[10vw] leading-[0.9] font-black text-white tracking-tighter mix-blend-difference hover:text-emerald-500 transition-colors duration-500" aria-hidden="true">
              {t.hero.title1}
            </div>

            {/* Typed / Rotating Text */}
            <div className="h-[10vw] relative">
                 <div key={textIndex} className="absolute top-0 left-0 text-[10vw] leading-[0.9] font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-500 via-white to-gray-500 tracking-tighter animate-gradient-x bg-[length:200%_auto] animate-fade-in-up">
                   {rotatingTexts[textIndex]}
                 </div>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-end w-full border-t border-white/20 pt-8">
            <div className="max-w-2xl">
              <p className="text-gray-300 text-xl md:text-2xl font-light leading-relaxed">
                {t.hero.description}
              </p>
            </div>
            <div className="mt-8 md:mt-0 flex flex-col items-end">
              <a 
                href="#projects"
                className="group flex items-center gap-2 text-white font-mono text-sm tracking-widest hover:text-emerald-400 transition-colors focus:text-emerald-400 p-2"
              >
                {t.hero.cta} <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </div>
      <style>{`
          @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
              animation: fadeInUp 0.5s ease-out forwards;
          }
      `}</style>
    </section>
  );
};

const CaseStudyCard = ({ title, category, problem, solution, result, index }) => {
  const { t } = useLanguage();
  return (
    <RevealOnScroll delay={index * 100}>
        <SpotlightCard className="group h-full bg-gray-900 rounded-lg border border-white/5 hover:border-emerald-500/50 transition-all duration-500 flex flex-col">
        <div className="relative h-48 overflow-hidden bg-gray-800 border-b border-white/5">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `repeating-linear-gradient(45deg, #444 0px, #444 1px, transparent 1px, transparent 10px)` }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-black text-white/5 select-none">0{index + 1}</span>
            </div>
            <div className="absolute bottom-4 left-6">
                <span className="text-emerald-400 font-mono text-xs tracking-widest bg-emerald-950/50 px-2 py-1 rounded">{category}</span>
                <h3 className="text-2xl font-bold text-white mt-2">{title}</h3>
            </div>
        </div>

        <div className="p-6 flex-grow flex flex-col justify-between">
            <div className="space-y-4 mb-6">
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t.projects.labels.problem}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{problem}</p>
            </div>
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t.projects.labels.solution}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{solution}</p>
            </div>
            </div>

            <div className="pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-400">
                    <BarChart3 size={18} />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.projects.labels.result}</h4>
                    <p className="text-white font-bold text-sm">{result}</p>
                </div>
            </div>
            </div>
        </div>
        </SpotlightCard>
    </RevealOnScroll>
  );
};

const Projects = () => {
  const { t } = useLanguage();

  return (
    <section id="projects" className="bg-black py-32 px-6 border-t border-white/5">
      <div className="container mx-auto">
        <SectionHeader number="// 02" title={t.projects.sectionTitle} subtitle={t.projects.subtitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.projects.caseStudies.map((p, i) => (
            <CaseStudyCard key={i} {...p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
    const { t } = useLanguage(); // eslint-disable-line no-unused-vars
    // Placeholder testimonials (can be moved to translations if needed later, but keeping simple for now)
    const testimonials = [
        { name: "Sarah Connor", role: "CTO, Skynet Systems", text: "The performance improvements were immediate. Our core web vitals went from red to all green." },
        { name: "James Holden", role: "Founder, Rocinante Corp", text: "Exceptional attention to accessibility and detail. A true partner in our digital strategy." },
        { name: "Ellen Ripley", role: "Director, Weyland-Yutani", text: "The 3D integration added that premium feel we were looking for without sacrificing speed." }
    ];

    return (
        <section className="bg-black py-20 px-6 border-t border-white/5 relative overflow-hidden">
             <div className="container mx-auto">
                <div className="flex items-center justify-center mb-12">
                     <span className="text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full text-sm font-mono tracking-widest">TESTIMONIALS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((test, i) => (
                        <RevealOnScroll key={i} delay={i * 100}>
                            <SpotlightCard className="bg-[#0a0a0a] border border-white/5 p-8 rounded-xl h-full flex flex-col relative">
                                <div className="absolute top-6 right-6 text-emerald-500/20">
                                    <MessageSquare size={40} />
                                </div>
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-emerald-500 fill-emerald-500" />)}
                                </div>
                                <p className="text-gray-300 italic mb-6 flex-grow">"{test.text}"</p>
                                <div>
                                    <h4 className="text-white font-bold">{test.name}</h4>
                                    <p className="text-emerald-400 text-xs font-mono mt-1">{test.role}</p>
                                </div>
                            </SpotlightCard>
                        </RevealOnScroll>
                    ))}
                </div>
             </div>
        </section>
    );
};

const TechStack = () => {
    const techs = [
        "React", "Next.js", "Three.js", "TailwindCSS", "Node.js", "TypeScript",
        "GraphQL", "AWS", "Vite", "Figma", "PostgreSQL", "Docker", "Git", "Redis"
    ];

    return (
        <div className="w-full overflow-hidden bg-white/5 border-y border-white/5 py-8 mt-20 relative">
             <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
             <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

            <div className="flex animate-marquee">
                {/* Triple duplication for smooth infinite loop */}
                {[...techs, ...techs, ...techs].map((tech, i) => (
                    <div key={i} className="flex items-center gap-2 mx-8 min-w-max group">
                         <span className="text-emerald-500/50 group-hover:text-emerald-400 transition-colors">
                             <Monitor size={20} />
                         </span>
                         <span className="text-2xl font-bold text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest">
                             {tech}
                         </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Expertise = () => {
  const { t } = useLanguage();
  const icons = [<Layout />, <Lock />, <Search />];
  const stepIcons = [<Search />, <Zap />, <Code2 />, <Smartphone />];

  return (
    <section id="expertise" className="bg-[#050505] py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto relative z-10">
            <SectionHeader number="// 03" title={t.expertise.sectionTitle} subtitle={t.expertise.subtitle} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                {t.expertise.skills.map((s, i) => (
                    <RevealOnScroll key={i} delay={i * 100}>
                      <SpotlightCard className="group p-8 border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl h-full">
                          <div className="text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300 relative z-20">
                              {React.cloneElement(icons[i], { size: 40 })}
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-4 relative z-20">{s.title}</h3>
                          <p className="text-gray-300 leading-relaxed text-sm relative z-20">{s.desc}</p>
                      </SpotlightCard>
                    </RevealOnScroll>
                ))}
            </div>

            {/* Tech Stack Slider */}
            <RevealOnScroll>
                <TechStack />
            </RevealOnScroll>

            <div className="mt-40">
                <RevealOnScroll>
                  <header className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-white/10 pb-6">
                    <h3 className="text-3xl font-bold text-white">{t.expertise.processTitle}</h3>
                    <p className="text-gray-400 font-mono text-sm mt-2 md:mt-0">{t.expertise.processSubtitle}</p>
                  </header>
                </RevealOnScroll>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {t.expertise.processSteps.map((step, i) => (
                        <RevealOnScroll key={i} delay={i * 150}>
                            <div className="relative group h-full">
                                {i !== t.expertise.processSteps.length - 1 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-[1px] bg-gradient-to-r from-emerald-500/50 to-transparent z-0" />}
                                <SpotlightCard className="p-6 bg-[#0a0a0a] border border-white/10 rounded-xl hover:border-emerald-500/50 transition-all duration-300 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-4 relative z-20">
                                        <span className="text-4xl font-black text-gray-800 group-hover:text-emerald-500/20 transition-colors">0{i+1}</span>
                                        <div className="p-2 bg-white/5 rounded-lg text-emerald-400">{React.cloneElement(stepIcons[i], { size: 20 })}</div>
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-2 relative z-20">{step.title}</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed relative z-20">{step.desc}</p>
                                </SpotlightCard>
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
};

const Contact = () => {
  const { t } = useLanguage();
  const formRef = useRef();
  const [status, setStatus] = useState("idle");

  const SERVICE_ID = "service_4ovvwye";
  const TEMPLATE_ID = "template_0kx8zqq";
  const PUBLIC_KEY = "gWC4t7Wtt43sff5RJ";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setStatus("sending");

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then((result) => {
        console.log('Email enviado:', result.text);
        setStatus("success");
        formRef.current.reset();
      }, (error) => {
        console.error('Error al enviar:', error.text);
        setStatus("error");
      });
  };

  return (
    <section id="contact" className="bg-black py-32 px-6 border-t border-white/5 flex flex-col justify-center">
      <div className="container mx-auto max-w-4xl">
        <SectionHeader number="// 04" title={t.contact.sectionTitle} subtitle={t.contact.subtitle} />

        <RevealOnScroll>
          <SpotlightCard className="mt-12 p-[1px] rounded-2xl bg-gradient-to-b from-white/20 to-transparent">
            <div className="bg-[#050505] rounded-2xl p-8 md:p-12 relative overflow-hidden h-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>

                <div className="text-center mb-12 relative z-20">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t.contact.formTitle}</h2>
                  <p className="text-gray-300">{t.contact.formSubtitle}</p>
                </div>

                {status === "success" ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-6">
                      <Send size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{t.contact.buttons.sent}</h3>
                    <p className="text-gray-400">{t.contact.buttons.sentDesc}</p>
                    <button 
                      onClick={() => setStatus("idle")}
                      className="mt-6 text-sm text-emerald-400 hover:text-emerald-300 underline"
                    >
                      {t.contact.buttons.sendAnother}
                    </button>
                  </div>
                ) : (
                  <form 
                    ref={formRef} 
                    className="space-y-6 relative z-20" 
                    onSubmit={handleSubmit}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-xs text-emerald-500 font-mono uppercase tracking-wider block">{t.contact.labels.name}</label>
                        <input id="name" name="name" type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all" placeholder={t.contact.placeholders.name} required />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-xs text-emerald-500 font-mono uppercase tracking-wider block">{t.contact.labels.email}</label>
                        <input id="email" name="email" type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all" placeholder={t.contact.placeholders.email} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-xs text-emerald-500 font-mono uppercase tracking-wider block">{t.contact.labels.message}</label>
                      <textarea id="message" name="message" rows="4" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all resize-none" placeholder={t.contact.placeholders.message} required></textarea>
                    </div>
                    
                    <div className="pt-4">
                      <button 
                        type="submit" 
                        disabled={status === "sending"}
                        className="w-full group relative px-8 py-5 bg-white text-black font-bold tracking-wider overflow-hidden rounded-lg hover:bg-emerald-400 transition-colors duration-300 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {status === "sending" ? t.contact.buttons.sending : t.contact.buttons.send}
                          {(status === "idle" || status === "error") && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </span>
                      </button>
                      {status === "error" && (
                        <p className="text-red-400 text-sm text-center mt-4">{t.contact.buttons.error}</p>
                      )}
                    </div>
                  </form>
                )}
            </div>
          </SpotlightCard>
        </RevealOnScroll>

        <RevealOnScroll>
            <nav className="mt-24 flex justify-center space-x-12 pb-12" aria-label="Redes Sociales">
                {[
                  { Icon: Github, href: "#", label: "GitHub" },
                  { Icon: Twitter, href: "#", label: "Twitter" },
                  { Icon: Linkedin, href: "#", label: "LinkedIn" },
                  { Icon: Mail, href: "#", label: "Email" }
                ].map(({ Icon, href, label }, i) => ( // eslint-disable-line no-unused-vars
                    <a key={i} href={href} aria-label={label} className="text-gray-400 hover:text-emerald-400 hover:scale-110 transition-all duration-300 focus:text-emerald-400 focus:outline-none">
                        <Icon size={24} />
                    </a>
                ))}
            </nav>
            <footer className="text-center text-gray-500 text-sm font-mono pb-8">
                © {new Date().getFullYear()} FASTERPLOP // DESARROLLO WEB & SEO
            </footer>
        </RevealOnScroll>
      </div>
    </section>
  ); 
};

// --- App Principal (SPA) ---

const MainApp = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: '#home', label: t.nav.home },
    { id: '#projects', label: t.nav.projects },
    { id: '#expertise', label: t.nav.expertise },
    { id: '#contact', label: t.nav.contact }
  ];

  return (
    <div className="bg-black min-h-screen text-white selection:bg-emerald-500 selection:text-black font-sans">
      <CustomCursor />
      <GlobalStyles />
      <SEO />
      
      {/* Skip Link para Accesibilidad */}
      <a href="#home" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[60] bg-emerald-500 text-black px-4 py-2 font-bold rounded">
        Saltar al contenido principal
      </a>
      
      {/* Navegación */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/95 backdrop-blur-lg py-4 border-b border-white/10' : 'bg-transparent py-8'}`} role="navigation" aria-label="Menú principal">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a 
            href="#home"
            className="text-2xl font-black tracking-tighter text-white z-50 group cursor-pointer flex items-center gap-1 focus:outline-none"
            aria-label="Ir al inicio"
          >
            <span className="group-hover:text-emerald-400 transition-colors duration-300">Faster</span>
            <span className="text-gray-500 group-hover:text-white transition-colors duration-300">plop</span>
            <span className="text-emerald-500">.</span>
          </a>

          <div className="flex items-center gap-8">
                {/* Menú Escritorio */}
                <div className="hidden md:flex space-x-8 text-sm font-bold tracking-widest text-gray-400">
                    {navItems.map((item) => (
                    <a
                        key={item.id}
                        href={item.id}
                        className="hover:text-emerald-400 transition-colors duration-300 relative group overflow-hidden focus:text-emerald-400"
                    >
                        <span className="relative z-10">{item.label}</span>
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </a>
                    ))}
                </div>

                {/* Language Switch */}
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 text-sm font-bold tracking-widest text-white hover:text-emerald-400 transition-colors z-50 border border-white/10 px-3 py-1 rounded bg-white/5"
                    aria-label={lang === 'es' ? "Switch to English" : "Cambiar a Español"}
                >
                    <Globe size={16} />
                    <span>{lang === 'es' ? 'ES' : 'EN'}</span>
                </button>
          </div>

          {/* Botón Móvil */}
          <button
            className="md:hidden text-white z-50 relative p-2 focus:text-emerald-400" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X /> : <Menu />}
          </button>

          {/* Menú Móvil Overlay */}
          {isOpen && (
            <div className="fixed inset-0 bg-black/98 flex flex-col items-center justify-center space-y-8 z-40">
              {navItems.map((item, idx) => (
                <a 
                  key={item.id} 
                  href={item.id}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 hover:scale-110 transition-transform focus:outline-none focus:border-b-2 focus:border-emerald-400"
                >
                  0{idx + 1} / {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Contenido Principal */}
      <main>
        <Hero />
        <Projects />
        <Testimonials />
        <Expertise />
        <Contact />
      </main>
    </div>
  );
};

const App = () => (
    <LanguageProvider>
        <MainApp />
    </LanguageProvider>
);

export default App;