import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { User, Stethoscope, Landmark, X } from "lucide-react";

export default function SignupRoleModal({ open, onClose, onSelectRole }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      // Mount the component
      setShouldRender(true);
      // Trigger animation after a brief delay for DOM to settle
      const animateTimer = setTimeout(() => {
        setIsAnimating(true);
      }, 50);

      // Prevent body scroll
      document.body.style.overflow = "hidden";

      return () => {
        clearTimeout(animateTimer);
      };
    } else {
      // Start exit animation
      setIsAnimating(false);

      // Unmount after animation completes
      const unmountTimer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = "unset";
      }, 350);

      return () => {
        clearTimeout(unmountTimer);
      };
    }
  }, [open]);

  if (!shouldRender) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
      {/* Enhanced Backdrop with smooth fade and blur */}
      <div
        onClick={onClose}
        className={`
                    absolute inset-0 
                    bg-gradient-to-br from-black/60 via-black/50 to-black/60
                    backdrop-blur-md
                    transition-all duration-[400ms] ease-out
                    ${
                      isAnimating
                        ? "opacity-100 backdrop-blur-md"
                        : "opacity-0 backdrop-blur-none"
                    }
                `}
      />

      {/* Modal Container with scale and fade animation */}
      <div
        className={`
                    relative z-10 w-full max-w-4xl
                    bg-white rounded-2xl sm:rounded-3xl shadow-2xl
                    overflow-hidden
                    max-h-[95vh] sm:max-h-[90vh]
                    transform transition-all duration-[400ms] ease-out
                    ${
                      isAnimating
                        ? "opacity-100 scale-100 translate-y-0 rotate-0"
                        : "opacity-0 scale-95 translate-y-12 rotate-1"
                    }
                `}
        style={{
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      >
        {/* Decorative gradient at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-slate-500" />

        {/* Content Container - Scrollable without visible scrollbar */}
        <div
          className="p-5 sm:p-8 md:p-10 overflow-y-hidden max-h-[95vh] sm:max-h-[90vh]"
          style={{
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE and Edge */,
            WebkitOverflowScrolling: "touch" /* Smooth scrolling on iOS */,
          }}
        >
          {/* Hide scrollbar for Chrome, Safari and Opera */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Close Button with enhanced hover */}
          <button
            onClick={onClose}
            className="
                            absolute top-3 right-3 sm:top-4 sm:right-4 z-20
                            p-2 rounded-xl
                            text-gray-400 hover:text-gray-600
                            bg-transparent hover:bg-gray-100
                            transition-all duration-200
                            hover:rotate-90 hover:scale-110
                            active:scale-95
                        "
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Header with staggered animation */}
          <div
            className={`
                            text-center mb-8 sm:mb-10 md:mb-12
                            transition-all duration-500 delay-100
                            ${
                              isAnimating
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-4"
                            }
                        `}
          >
            {/* Animated Icon */}
            <div
              className={`
                                inline-flex items-center justify-center 
                                w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-100 to-emerald-50
                                rounded-xl sm:rounded-2xl mb-4 sm:mb-5 shadow-lg
                                transition-all duration-700
                                ${
                                  isAnimating
                                    ? "opacity-100 scale-100 rotate-0"
                                    : "opacity-0 scale-0 rotate-180"
                                }
                            `}
            >
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Create an account as
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Select the role that best fits you to get started with
              personalized healthcare management
            </p>
          </div>

          {/* Role Cards Grid with staggered entrance */}
          <div className=" flex justify-center md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            <RoleCard
              icon={<User className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />}
              title="Migrant Worker"
              description="Access health records, get AI-powered guidance, and manage your care coordination"
              color="emerald"
              isVisible={isAnimating}
              delay={150}
              onClick={() => onSelectRole("worker")}
              
            />
            <RoleCard
              icon={
                <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              }
              title="Healthcare Provider"
              description="Monitor patients, coordinate care, and leverage AI-powered diagnostic tools"
              color="blue"
              isVisible={isAnimating}
              delay={250}
              onClick={() => onSelectRole("doctor")}
            />
          </div>

          {/* Footer with fade-in */}
          <div
            className={`
                            mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-gray-200 text-center
                            transition-all duration-500 delay-500
                            ${
                              isAnimating
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-4"
                            }
                        `}
          >
            <p className="text-xs sm:text-sm text-gray-500 px-4">
              By creating an account, you agree to our{" "}
              <a
                href="#"
                className="text-emerald-600 hover:text-emerald-700 underline transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-emerald-600 hover:text-emerald-700 underline transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function RoleCard({
  icon,
  title,
  description,
  color = "emerald",
  isVisible,
  delay = 0,
  onClick,
}) {
  const colorClasses = {
    emerald: {
      iconBg:
        "bg-emerald-100 text-emerald-600 group-hover:bg-white/20 group-hover:text-white",
      border:
        "border-gray-200 group-hover:border-emerald-500 group-hover:shadow-emerald-500/20",
      gradient: "from-emerald-500 to-teal-600",
      glow: "group-hover:shadow-emerald-500/50",
      text: "text-emerald-600 group-hover:text-white",
    },
    blue: {
      iconBg:
        "bg-blue-100 text-blue-600 group-hover:bg-white/20 group-hover:text-white",
      border:
        "border-gray-200 group-hover:border-blue-500 group-hover:shadow-blue-500/20",
      gradient: "from-blue-500 to-cyan-600",
      glow: "group-hover:shadow-blue-500/50",
      text: "text-blue-600 group-hover:text-white",
    },
    slate: {
      iconBg:
        "bg-slate-100 text-slate-600 group-hover:bg-white/20 group-hover:text-white",
      border:
        "border-gray-200 group-hover:border-slate-500 group-hover:shadow-slate-500/20",
      gradient: "from-slate-600 to-slate-700",
      glow: "group-hover:shadow-slate-500/50",
      text: "text-slate-600 group-hover:text-white",
    },
  };

  const colors = colorClasses[color];

  return (
    <button
      onClick={onClick}
      className={`
                group relative w-full text-left 
                p-5 sm:p-6 rounded-xl sm:rounded-2xl
                border-2 ${colors.border} bg-white
                transform transition-all duration-[400ms] ease-out
                hover:shadow-2xl ${colors.glow}
                hover:scale-[1.03] hover:-translate-y-1
                active:scale-[0.98] active:translate-y-0
                focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                ${
                  isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95"
                }
            `}
      style={{
        transitionDelay: `${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {/* Gradient overlay on hover with smooth transition */}
      <div
        className={`
                    absolute inset-0 rounded-xl sm:rounded-2xl 
                    opacity-0 group-hover:opacity-100
                    bg-gradient-to-br ${colors.gradient}
                    transition-all duration-500
                    group-hover:scale-105
                `}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon with pulse effect on hover */}
        <div
          className={`
                        inline-flex items-center justify-center 
                        w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl mb-3 sm:mb-4
                        transition-all duration-500
                        ${colors.iconBg}
                        group-hover:scale-110 group-hover:rotate-6
                    `}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 group-hover:text-white mb-2 sm:mb-3 transition-colors duration-300">
          {title}
        </h3>

        {/* Description - Hidden on mobile */}
        <p className="hidden sm:block text-xs sm:text-sm text-gray-600 group-hover:text-white/95 leading-relaxed mb-3 sm:mb-4 transition-colors duration-300">
          {description}
        </p>

        {/* CTA with arrow */}
        <div
          className={`flex items-center font-semibold text-xs sm:text-sm transition-all duration-300 ${colors.text}`}
        >
          <span>Get started</span>
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </div>

      {/* Animated shine effect on hover */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent rotate-45 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-xl sm:rounded-t-2xl" />
      </div>
    </button>
  );
}
