import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Heart, Bell, Shield, UserPlus, LogIn,
  Activity, Lock, Smartphone, Users, Brain, TrendingUp, TrendingDown,
  MapPin, AlertTriangle, Target, ArrowRight, Sparkles, ChevronDown,
  Zap, Globe, Eye
} from 'lucide-react';

/* ─── Custom SVG Logo ─── */
const Logo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#0d9488" />
      </linearGradient>
      <linearGradient id="heartGrad" x1="14" y1="14" x2="34" y2="36">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#ecfdf5" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="14" fill="url(#logoGrad)" />
    {/* Pulse ring */}
    <circle cx="24" cy="24" r="18" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none" />
    {/* ECG line */}
    <polyline points="8,24 14,24 17,18 20,30 23,20 26,28 29,24 32,24 34,16 36,32 38,24 42,24"
      stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* Heart */}
    <path d="M24 34 C24 34 14 27 14 21 C14 17.5 17 15 20 15 C22 15 23.5 16.5 24 17.5 C24.5 16.5 26 15 28 15 C31 15 34 17.5 34 21 C34 27 24 34 24 34Z"
      fill="url(#heartGrad)" opacity="0.95" />
    {/* Plus sign */}
    <rect x="22.5" y="20" width="3" height="10" rx="1.5" fill="#10b981" />
    <rect x="19" y="23.5" width="10" height="3" rx="1.5" fill="#10b981" />
  </svg>
);

/* ─── Reveal on scroll / mount ─── */
function Reveal({ children, delay = 0, className = "" }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── Animated counter ─── */
function AnimCounter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const num = parseFloat(target.replace(/[^0-9.]/g, ""));
        const dur = 1500;
        const steps = 40;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const progress = 1 - Math.pow(1 - step / steps, 3);
          setVal(Math.floor(num * progress));
          if (step >= steps) { setVal(num); clearInterval(timer); }
        }, dur / steps);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  const prefix = target.includes("+") ? "" : "";
  const suf = target.includes("+") ? "+" : target.includes("%") ? "%" : "";
  const isK = target.includes("K");
  return <span ref={ref}>{isK ? `${val}K` : val}{suf}{suffix}</span>;
}

const LandingPage = ({ onSignupClick, onLoginClick, setIsLoginOpen }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchParams] = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (searchParams.has("login")) setIsLoginOpen(true);
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const slides = [
    { title: "Your Health,", titleAccent: "Our Priority", description: "Comprehensive health monitoring and care coordination for migrant workers worldwide", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=600&fit=crop" },
    { title: "Connected", titleAccent: "Community Care", description: "Bringing healthcare services directly to your community with mobile health outreach", image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=600&fit=crop" },
    { title: "Always", titleAccent: "Here for You", description: "24/7 access to healthcare professionals and support services wherever you are", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&h=600&fit=crop" },
  ];

  const dashboardStats = [
    { icon: Users, value: "250K+", label: "Workers Monitored", trend: "+12% this month", trendUp: true },
    { icon: Target, value: "98.5%", label: "Health Compliance", trend: "+2.3% improvement", trendUp: true },
    { icon: AlertTriangle, value: "47", label: "Active Health Alerts", trend: "-8 from last week", trendUp: false },
    { icon: MapPin, value: "12", label: "Regions Covered", trend: "+3 new this quarter", trendUp: true },
  ];

  const healthAdvisories = [
    { title: "Seasonal Flu Advisory", description: "Increased flu activity reported in northern regions. Vaccination recommended.", date: "Feb 3, 2026", color: "amber" },
    { title: "Health Screening Drive", description: "Free health screenings available at community centers from Feb 10-15.", date: "Feb 1, 2026", color: "cyan" },
    { title: "COVID-19 Update", description: "Transmission rates continue to decline. Maintain regular health monitoring.", date: "Jan 28, 2026", color: "emerald" },
  ];

  const features = [
    { icon: Activity, title: "Health Monitoring", description: "Track vital signs, symptoms, and health trends with easy-to-use digital tools", color: "emerald" },
    { icon: Shield, title: "Data Privacy", description: "Your health data is encrypted and protected with industry-leading security", color: "blue" },
    { icon: Bell, title: "Smart Alerts", description: "Receive timely notifications about health advisories and personalized care", color: "amber" },
    { icon: Brain, title: "AI Insights", description: "Powered by AI to detect patterns and provide early health warnings", color: "violet" },
    { icon: Users, title: "Care Coordination", description: "Seamless communication between you, doctors, and health authorities", color: "cyan" },
    { icon: Smartphone, title: "Mobile First", description: "Access your health records anytime, anywhere from any device", color: "rose" },
    { icon: Lock, title: "Consent Control", description: "You decide who sees your data with granular consent management", color: "indigo" },
    { icon: Heart, title: "Wellness Support", description: "Resources and guidance for mental and physical wellbeing", color: "emerald" },
  ];

  const featureColors = {
    emerald: { bg: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-500/25", light: "bg-emerald-50", text: "text-emerald-600" },
    blue: { bg: "from-blue-500 to-cyan-600", shadow: "shadow-blue-500/25", light: "bg-blue-50", text: "text-blue-600" },
    amber: { bg: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/25", light: "bg-amber-50", text: "text-amber-600" },
    violet: { bg: "from-violet-500 to-purple-600", shadow: "shadow-violet-500/25", light: "bg-violet-50", text: "text-violet-600" },
    cyan: { bg: "from-cyan-500 to-teal-600", shadow: "shadow-cyan-500/25", light: "bg-cyan-50", text: "text-cyan-600" },
    rose: { bg: "from-rose-500 to-pink-600", shadow: "shadow-rose-500/25", light: "bg-rose-50", text: "text-rose-600" },
    indigo: { bg: "from-indigo-500 to-blue-600", shadow: "shadow-indigo-500/25", light: "bg-indigo-50", text: "text-indigo-600" },
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(p => (p + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(p => (p - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ══════ HEADER ══════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-200/50 py-2" : "bg-transparent py-3"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <Logo size={scrolled ? 36 : 42} />
              </div>
              <div>
                <span className={`text-xl font-black tracking-tight transition-colors duration-500 ${scrolled ? "text-gray-900" : "text-white"}`}>
                  NeuraCare
                </span>
                <p className={`text-[10px] font-medium -mt-0.5 transition-colors duration-500 ${scrolled ? "text-gray-400" : "text-white/60"}`}>
                  Healthcare for Everyone
                </p>
              </div>
            </div>

            <nav className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors duration-500 ${scrolled ? "text-gray-600" : "text-white/80"}`}>
              {["Features", "Dashboard", "About"].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-emerald-500 transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button onClick={onLoginClick}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${scrolled ? "text-emerald-600 border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50" : "text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10"}`}>
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
              <button onClick={onSignupClick}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300">
                <UserPlus className="w-4 h-4" />
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ══════ HERO ══════ */}
      <section className="relative h-[100vh] min-h-[600px] max-h-[900px] overflow-hidden">
        {slides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 transition-all duration-1000 ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms]"
              style={{ backgroundImage: `url(${slide.image})`, transform: index === currentSlide ? "scale(1.05)" : "scale(1)" }}>
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
            </div>
          </div>
        ))}

        {/* Hero content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl">
            <Reveal delay={200}>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> AI-Powered Healthcare
                </span>
              </div>
            </Reveal>
            <div key={currentSlide}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2 leading-[1.1] tracking-tight hero-title">
                {slides[currentSlide].title}
              </h1>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent mb-6 leading-[1.1] tracking-tight hero-title-accent">
                {slides[currentSlide].titleAccent}
              </h1>
              <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-lg leading-relaxed hero-desc">
                {slides[currentSlide].description}
              </p>
            </div>
            <Reveal delay={600}>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={onSignupClick}
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Slide navigation */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110">
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? "w-10 bg-emerald-400" : "w-3 bg-white/30 hover:bg-white/50"}`} />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2 text-white/40 animate-bounce" style={{ animationDuration: "2s" }}>
          <span className="text-[10px] uppercase tracking-widest font-medium">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ══════ TRUST BAR ══════ */}
      <Reveal>
        <section className="py-6 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {[
              { val: "250K+", label: "Workers Protected" },
              { val: "99.9%", label: "Uptime" },
              { val: "12+", label: "Regions" },
              { val: "4.9★", label: "User Rating" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-xl sm:text-2xl font-black text-gray-900">{s.val}</p>
                <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ══════ FEATURES ══════ */}
      <section id="features" className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <Zap className="w-3 h-3" /> Platform Features
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                Everything You Need for
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Better Healthcare</span>
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Monitor, manage, and protect your health data in one secure platform built for migrant workers worldwide.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => {
              const c = featureColors[feature.color] || featureColors.emerald;
              return (
                <Reveal key={i} delay={i * 80}>
                  <div className="group bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden cursor-default h-full">
                    <div className={`absolute top-0 right-0 w-32 h-32 ${c.light} rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700`} />
                    <div className="relative">
                      <div className={`w-12 h-12 bg-gradient-to-br ${c.bg} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg ${c.shadow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{feature.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════ DASHBOARD ══════ */}
      <section id="dashboard" className="py-20 sm:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Reveal>
            <div className="mb-14">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
                <Globe className="w-3 h-3" /> Live Dashboard
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight">
                Public Health <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Intelligence</span>
              </h2>
              <p className="text-slate-400 max-w-xl">
                Real-time health statistics and AI-powered advisories from health authorities.
              </p>
            </div>
          </Reveal>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {dashboardStats.map((stat, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-1">
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                    <AnimCounter target={stat.value} />
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{stat.label}</p>
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? "text-emerald-400" : "text-red-400"}`}>
                    {stat.trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {stat.trend}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Advisories */}
          <Reveal delay={400}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" /> Latest Health Advisories
              </h3>
              <div className="space-y-3">
                {healthAdvisories.map((adv, i) => (
                  <div key={i} className="group bg-white/5 border border-white/5 rounded-xl p-4 sm:p-5 hover:bg-white/10 hover:border-white/10 transition-all duration-500 cursor-default">
                    <div className="flex items-start gap-4">
                      <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${adv.color === "amber" ? "bg-amber-400 shadow-lg shadow-amber-400/50" : adv.color === "cyan" ? "bg-cyan-400 shadow-lg shadow-cyan-400/50" : "bg-emerald-400 shadow-lg shadow-emerald-400/50"}`} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-1.5">
                          <h4 className="text-white font-bold group-hover:text-emerald-400 transition-colors">{adv.title}</h4>
                          <span className="text-slate-500 text-xs whitespace-nowrap">{adv.date}</span>
                        </div>
                        <p className="text-slate-400 text-sm">{adv.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100/50 to-teal-100/50 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <Reveal>
            <div className="mb-6"><Logo size={56} /></div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Ready to Take Control of
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Your Health?</span>
            </h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
              Join thousands of workers who trust NeuraCare for secure, accessible, and intelligent healthcare management.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={onSignupClick}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300">
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={onLoginClick}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-300">
                <LogIn className="w-5 h-5" /> Sign In
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo size={36} />
              <div>
                <span className="font-bold text-lg">NeuraCare</span>
                <p className="text-xs text-gray-500">Healthcare for Everyone</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
            </div>
            <p className="text-gray-500 text-sm">© 2026 NeuraCare. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes heroIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .hero-title { animation: heroIn 0.8s ease-out forwards; }
        .hero-title-accent { animation: heroIn 0.8s ease-out 0.15s forwards; opacity:0; }
        .hero-desc { animation: heroIn 0.8s ease-out 0.3s forwards; opacity:0; }
      `}</style>
    </div>
  );
};

export default LandingPage;