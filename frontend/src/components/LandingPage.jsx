import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, Bell, Shield, UserPlus, LogIn, Activity, Lock, Smartphone, Users, Brain, TrendingUp, TrendingDown, MapPin, AlertTriangle, Target } from 'lucide-react';
// import logo from '../assets/logo.png'

const LandingPage = ({onSignupClick,onLoginClick,setIsLoginOpen}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // check if login query exists
    if (searchParams.has("login")) {
      setIsLoginOpen(true);
    }
  }, [searchParams]);

  // Hero slides data
  const slides = [
    {
      title: "Your Health, Our Priority",
      description: "Comprehensive health monitoring and care coordination for migrant workers worldwide",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=600&fit=crop"
    },
    {
      title: "Connected Community Care",
      description: "Bringing healthcare services directly to your community with mobile health outreach",
      image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=600&fit=crop"
    },
    {
      title: "Always Here for You",
      description: "24/7 access to healthcare professionals and support services wherever you are",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&h=600&fit=crop"
    }
  ];

  // Dashboard stats
  const dashboardStats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "250K+",
      label: "Workers Monitored",
      trend: "+12% this month",
      trendUp: true
    },
    {
      icon: <Target className="w-6 h-6" />,
      value: "98.5%",
      label: "Health Check Compliance",
      trend: "+2.3% improvement",
      trendUp: true
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      value: "47",
      label: "Active Health Alerts",
      trend: "-8 from last week",
      trendUp: false
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      value: "12",
      label: "Regions Covered",
      trend: "+3 new this quarter",
      trendUp: true
    }
  ];

  // Health advisories
  const healthAdvisories = [
    {
      title: "Seasonal Flu Advisory",
      description: "Increased flu activity reported in northern regions. Vaccination recommended.",
      date: "Feb 3, 2026",
      color: "amber"
    },
    {
      title: "Health Screening Drive",
      description: "Free health screenings available at community centers from Feb 10-15.",
      date: "Feb 1, 2026",
      color: "cyan"
    },
    {
      title: "COVID-19 Update",
      description: "Transmission rates continue to decline. Maintain regular health monitoring.",
      date: "Jan 28, 2026",
      color: "emerald"
    }
  ];

  // Features data
  const features = [
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Health Monitoring",
      description: "Track vital signs, symptoms, and health trends with easy-to-use digital tools"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Data Privacy",
      description: "Your health data is encrypted and protected with industry-leading security"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Alerts",
      description: "Receive timely notifications about health advisories and personalized recommendations"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Insights",
      description: "Powered by AI to detect patterns and provide early health warnings"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Care Coordination",
      description: "Seamless communication between you, doctors, and health authorities"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile First",
      description: "Access your health records anytime, anywhere from any device"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Consent Control",
      description: "You decide who sees your data with granular consent management"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Wellness Support",
      description: "Resources and guidance for mental and physical wellbeing"
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              {/* <div className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={logo}   // put your logo path here
                  alt="NeuraCare Logo"
                  className="w-full h-full object-contain"
                />
              </div> */}
              <span className="text-xl md:text-2xl font-bold text-gray-900">
                NeuraCare
              </span>
            </div>




            {/* Auth Buttons */}
            <div className="flex items-center gap-2 md:gap-3">
              <button onClick={onLoginClick} className="flex items-center gap-2 px-3 md:px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
              <button onClick={onSignupClick} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        </div>

      </header>

      {/* Hero Section with Carousel */}
      <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-2xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 md:mb-8">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <button className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors shadow-lg">
                    <UserPlus className="w-5 h-5" />
                    Register Now
                  </button>
                  <button className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white/10 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${index === currentSlide
                  ? 'w-8 bg-amber-500'
                  : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Public Health Dashboard Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  Public Health Dashboard
                </h2>
                <p className="text-slate-400 text-sm md:text-base">
                  Real-time health statistics and advisories from health authorities
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            {dashboardStats.map((stat, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-700/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-500 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-300 text-sm mb-3">
                  {stat.label}
                </div>
                <div className={`flex items-center gap-1 text-xs ${stat.trendUp ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                  {stat.trendUp ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Latest Health Advisories */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
              Latest Health Advisories
            </h3>
            <div className="space-y-4">
              {healthAdvisories.map((advisory, index) => (
                <div
                  key={index}
                  className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4 md:p-5 hover:bg-slate-700/50 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${advisory.color === 'amber' ? 'bg-amber-500' :
                        advisory.color === 'cyan' ? 'bg-cyan-500' :
                          'bg-emerald-500'
                      }`}></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="text-white font-semibold text-base md:text-lg group-hover:text-amber-400 transition-colors">
                          {advisory.title}
                        </h4>
                        <span className="text-slate-400 text-xs md:text-sm whitespace-nowrap">
                          {advisory.date}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm md:text-base">
                        {advisory.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Platform Features
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Health Management
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to monitor, manage, and protect your health data in one secure platform
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:bg-emerald-600 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <span className="text-xl font-bold">NeuraCare</span>
          </div>
          <p className="text-gray-400">
            © 2026 MigraHealth. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;