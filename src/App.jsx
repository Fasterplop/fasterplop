import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, Github, Twitter, Linkedin, Mail, Code2, Cpu, Globe, Zap, Layout, Search, Send, ChevronRight, BarChart3, Lock, Smartphone } from 'lucide-react';
import emailjs from '@emailjs/browser';

// --- Componente SEO (Dinámico) ---
const SEO = () => {
  useEffect(() => {
    // Título de la pestaña
    document.title = "Fasterplop | Desarrollo Web de Alto Rendimiento";
    
    // Metaetiquetas críticas para redes sociales (Open Graph y Twitter)
    const metaTags = [
      { name: 'description', content: "Ayudo a empresas a escalar ventas mediante desarrollo web optimizado. Especialista en React, SEO técnico y Accesibilidad web." },
      { property: 'og:title', content: "Fasterplop | Desarrollo Web & SEO" },
      { property: 'og:description', content: "Desarrollo web de alto rendimiento para empresas que buscan escalar." },
      { property: 'og:image', content: "https://fasterplop.com/og-image-main.jpg" }, // ¡Asegúrate de crear y subir esta imagen!
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'robots', content: 'index, follow' }
    ];

    metaTags.forEach(({ name, property, content }) => {
      let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        if (name) element.setAttribute('name', name);
        if (property) element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    });

    // Definir idioma español
    document.documentElement.lang = 'es';
  }, []);

  return null;
};

// --- Estilos Globales & Animaciones CSS ---
const GlobalStyles = () => (
  <style>{`
    html {
      scroll-behavior: smooth;
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
  `}</style>
);

// --- Hooks y Utilidades ---

// Hook para revelar elementos al hacer scroll
const RevealOnScroll = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Solo animar una vez
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

// Tarjeta con efecto "Spotlight" (Luz seguidora)
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
      {/* Capa de luz dinámica */}
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Efecto Parallax suave en el fondo
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center pt-20" aria-label="Introducción">
      {/* Fondo Dinámico */}
      <div className="absolute inset-0 z-0 transition-transform duration-100 ease-out" style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '30px 30px', maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px) translate(-50%, -50%)` }}></div>
      </div>
      
      <div className="relative z-20 container mx-auto px-6">
        <RevealOnScroll>
          <div className="flex flex-col items-start space-y-4 select-none">
            <h1 className="sr-only">Desarrollador Web de Alto Rendimiento</h1>
            {/* Texto Sólido (Profesional y Limpio) */}
            <div className="text-[10vw] leading-[0.9] font-black text-white tracking-tighter mix-blend-difference hover:text-emerald-500 transition-colors duration-500" aria-hidden="true">
              DESARROLLO
            </div>
            <div className="text-[10vw] leading-[0.9] font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-500 via-white to-gray-500 tracking-tighter animate-gradient-x bg-[length:200%_auto]" aria-hidden="true">
               WEB
            </div>
          </div>
          
          <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-end w-full border-t border-white/20 pt-8">
            <div className="max-w-2xl">
              <p className="text-gray-300 text-xl md:text-2xl font-light leading-relaxed">
                Ayudo a empresas a escalar sus ventas y mejorar su presencia digital mediante desarrollo web de alto rendimiento, optimizado para SEO y accesibilidad.
              </p>
            </div>
            <div className="mt-8 md:mt-0 flex flex-col items-end">
              <a 
                href="#projects"
                className="group flex items-center gap-2 text-white font-mono text-sm tracking-widest hover:text-emerald-400 transition-colors focus:text-emerald-400 p-2"
                aria-label="Ver Casos de Estudio"
              >
                VER CASOS DE ESTUDIO <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

const CaseStudyCard = ({ title, category, problem, solution, result, index }) => (
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
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">El Problema</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{problem}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">La Solución</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{solution}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-400">
                <BarChart3 size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Resultado</h4>
                <p className="text-white font-bold text-sm">{result}</p>
              </div>
           </div>
        </div>
      </div>
    </SpotlightCard>
  </RevealOnScroll>
);

const Projects = () => {
  const caseStudies = [
    { 
      title: "NEXUS FINTECH", 
      category: "FINTECH / REACT",
      problem: "La plataforma anterior tardaba 4s en cargar, causando una tasa de rebote del 65%.",
      solution: "Migración a Next.js con renderizado híbrido y optimización de assets.",
      result: "Reducción del tiempo de carga a 0.8s y aumento del 25% en conversiones."
    },
    { 
      title: "AETHER COMMERCE", 
      category: "E-COMMERCE / SHOPIFY",
      problem: "Baja retención de usuarios móviles debido a una UX compleja y no responsiva.",
      solution: "Rediseño Mobile-First con arquitectura Headless y pagos en un clic.",
      result: "Aumento del 40% en ventas móviles y mejora del ticket promedio."
    },
    { 
      title: "KRONOS AI", 
      category: "SAAS / DASHBOARD",
      problem: "Los usuarios no entendían cómo visualizar sus datos complejos de IA.",
      solution: "Dashboard interactivo con D3.js y diseño de alto contraste accesible.",
      result: "Reducción del 30% en tickets de soporte y mayor satisfacción del cliente."
    },
    { 
      title: "SOLARIS ENERGY", 
      category: "IOT / REAL-TIME",
      problem: "Latencia alta en el monitoreo de paneles solares en tiempo real.",
      solution: "Implementación de WebSockets y arquitectura Serverless en AWS.",
      result: "Sincronización de datos en <100ms y escalabilidad asegurada."
    },
  ];

  return (
    <section id="projects" className="bg-black py-32 px-6 border-t border-white/5">
      <div className="container mx-auto">
        <SectionHeader number="// 02" title="CASE STUDIES" subtitle="No solo escribo código, resuelvo problemas de negocio complejos." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((p, i) => (
            <CaseStudyCard key={i} {...p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Expertise = () => {
  const skills = [
    { icon: <Layout />, title: "Arquitectura Frontend", desc: "Interfaces escalables, accesibles (WCAG 2.1) y rápidas con React y Tailwind." },
    { icon: <Lock />, title: "Seguridad & Performance", desc: "Best practices de seguridad, HTTPS, y optimización Core Web Vitals." },
    { icon: <Search />, title: "SEO Técnico", desc: "Estructura semántica, metadatos dinámicos y SSR para ranking #1 en Google." },
  ];

  const processSteps = [
    { num: "01", title: "Auditoría", desc: "Análisis profundo de métricas actuales y puntos de dolor del usuario.", icon: <Search /> },
    { num: "02", title: "Estrategia", desc: "Planificación de arquitectura técnica enfocada en ROI y escalabilidad.", icon: <Zap /> },
    { num: "03", title: "Desarrollo", desc: "Código limpio, testeado y documentado con estándares de industria.", icon: <Code2 /> },
    { num: "04", title: "Optimización", desc: "Pruebas A/B, optimización de velocidad y lanzamiento continuo.", icon: <Smartphone /> },
  ];

  return (
    <section id="expertise" className="bg-[#050505] py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto relative z-10">
            <SectionHeader number="// 03" title="EXPERTISE" subtitle="Tecnología al servicio de resultados de negocio." />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                {skills.map((s, i) => (
                    <RevealOnScroll key={i} delay={i * 100}>
                      <SpotlightCard className="group p-8 border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl h-full">
                          <div className="text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300 relative z-20">
                              {React.cloneElement(s.icon, { size: 40 })}
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-4 relative z-20">{s.title}</h3>
                          <p className="text-gray-300 leading-relaxed text-sm relative z-20">{s.desc}</p>
                      </SpotlightCard>
                    </RevealOnScroll>
                ))}
            </div>

            <div className="mt-40">
                <RevealOnScroll>
                  <header className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-white/10 pb-6">
                    <h3 className="text-3xl font-bold text-white">MI PROCESO</h3>
                    <p className="text-gray-400 font-mono text-sm mt-2 md:mt-0">METODOLOGÍA PROBADA</p>
                  </header>
                </RevealOnScroll>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {processSteps.map((step, i) => (
                        <RevealOnScroll key={i} delay={i * 150}>
                            <div className="relative group h-full">
                                {i !== processSteps.length - 1 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-[1px] bg-gradient-to-r from-emerald-500/50 to-transparent z-0" />}
                                <SpotlightCard className="p-6 bg-[#0a0a0a] border border-white/10 rounded-xl hover:border-emerald-500/50 transition-all duration-300 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-4 relative z-20">
                                        <span className="text-4xl font-black text-gray-800 group-hover:text-emerald-500/20 transition-colors">{step.num}</span>
                                        <div className="p-2 bg-white/5 rounded-lg text-emerald-400">{React.cloneElement(step.icon, { size: 20 })}</div>
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
 
  const formRef = useRef();
  const [status, setStatus] = useState("idle");

  // --- CONFIGURACIÓN DE EMAILJS ---
  // Reemplaza estos valores con los que obtuviste en tu panel de EmailJS
  const SERVICE_ID = "service_4ovvwye";      // Ej: service_x9f2k1
  const TEMPLATE_ID = "template_0kx8zqq";    // Ej: template_8a2b3c
  const PUBLIC_KEY = "gWC4t7Wtt43sff5RJ";      // Ej: user_9As8d7F6

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setStatus("sending");

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then((result) => {
        console.log('Email enviado:', result.text);
        setStatus("success");
        formRef.current.reset(); // Limpia el formulario
      }, (error) => {
        console.error('Error al enviar:', error.text);
        setStatus("error");
      });
  };
  return (
    
    
    <section id="contact" className="bg-black py-32 px-6 border-t border-white/5 flex flex-col justify-center">
      <div className="container mx-auto max-w-4xl">
        <SectionHeader number="// 04" title="CONTACTO" subtitle="¿Listo para escalar tu proyecto?" />

        {/* <RevealOnScroll>
          <SpotlightCard className="mt-12 p-[1px] rounded-2xl bg-gradient-to-b from-white/20 to-transparent">
            <div className="bg-[#050505] rounded-2xl p-8 md:p-12 relative overflow-hidden h-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>

                <div className="text-center mb-12 relative z-20">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Hablemos de negocios</h2>
                  <p className="text-gray-300">Respondo en menos de 24 horas. Consultas serias solamente.</p>
                </div>

                <form className="space-y-6 relative z-20" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs text-emerald-500 font-mono uppercase tracking-wider block">Nombre / Empresa</label>
                      <input id="name" type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all" placeholder="Tu Nombre" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs text-emerald-500 font-mono uppercase tracking-wider block">Email Corporativo</label>
                      <input id="email" type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all" placeholder="nombre@empresa.com" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs text-emerald-500 font-mono uppercase tracking-wider block">Detalles del Proyecto</label>
                    <textarea id="message" rows="4" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all resize-none" placeholder="Presupuesto, plazos y objetivos..." required></textarea>
                  </div>
                  
                  <div className="pt-4">
                    <button type="submit" className="w-full group relative px-8 py-5 bg-white text-black font-bold tracking-wider overflow-hidden rounded-lg hover:bg-emerald-400 transition-colors duration-300 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        ENVIAR MENSAJE <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                </form>
            </div>
          </SpotlightCard>
        </RevealOnScroll> */}

        <RevealOnScroll>
          <SpotlightCard className="mt-12 p-[1px] rounded-2xl bg-gradient-to-b from-white/20 to-transparent">
            <div className="bg-[#050505] rounded-2xl p-8 md:p-12 relative overflow-hidden h-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>

                <div className="text-center mb-12 relative z-20">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Hablemos de negocios</h2>
                  <p className="text-gray-300">Respondo en menos de 24 horas. Consultas serias solamente.</p>
                </div>

                {status === "success" ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-6">
                      <Send size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje Enviado!</h3>
                    <p className="text-gray-400">Gracias por contactarme. Te responderé pronto.</p>
                    <button 
                      onClick={() => setStatus("idle")}
                      className="mt-6 text-sm text-emerald-400 hover:text-emerald-300 underline"
                    >
                      Enviar otro mensaje
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
                        <label htmlFor="name" className="text-xs text-emerald-500 font-mono uppercase tracking-wider block">Nombre / Empresa</label>
                        <input id="name" name="name" type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all" placeholder="Tu Nombre" required />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-xs text-emerald-500 font-mono uppercase tracking-wider block">Email Corporativo</label>
                        <input id="email" name="email" type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all" placeholder="nombre@empresa.com" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-xs text-emerald-500 font-mono uppercase tracking-wider block">Detalles del Proyecto</label>
                      <textarea id="message" name="message" rows="4" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all resize-none" placeholder="Presupuesto, plazos y objetivos..." required></textarea>
                    </div>
                    
                    <div className="pt-4">
                      <button 
                        type="submit" 
                        disabled={status === "sending"}
                        className="w-full group relative px-8 py-5 bg-white text-black font-bold tracking-wider overflow-hidden rounded-lg hover:bg-emerald-400 transition-colors duration-300 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {status === "sending" ? "ENVIANDO..." : "ENVIAR MENSAJE"} 
                          {(status === "idle" || status === "error") && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </span>
                      </button>
                      {status === "error" && (
                        <p className="text-red-400 text-sm text-center mt-4">Hubo un error al enviar. Verifica tu configuración.</p>
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
                ].map(({ Icon, href, label }, i) => (
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

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: '#home', label: 'INICIO' },
    { id: '#projects', label: 'CASE STUDIES' },
    { id: '#expertise', label: 'EXPERTISE' },
    { id: '#contact', label: 'CONTACTO' }
  ];

  return (
    <div className="bg-black min-h-screen text-white selection:bg-emerald-500 selection:text-black font-sans">
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

          {/* Menú Escritorio */}
          <div className="hidden md:flex space-x-12 text-sm font-bold tracking-widest text-gray-400">
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
        <Expertise />
        <Contact />
      </main>
    </div>
  );
};

export default App;