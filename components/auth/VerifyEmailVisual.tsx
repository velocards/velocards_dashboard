"use client";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { IconMail, IconShieldCheck, IconCircleCheck } from "@tabler/icons-react";

const VerifyEmailVisual = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const checkmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const timer = setTimeout(() => {
      // Animate envelope opening
      if (envelopeRef.current) {
        gsap.timeline({ repeat: -1, repeatDelay: 2 })
          .to(envelopeRef.current, {
            rotateX: -30,
            duration: 0.8,
            ease: "power2.inOut"
          })
          .to(envelopeRef.current, {
            rotateX: 0,
            duration: 0.8,
            ease: "power2.inOut"
          });
      }

      // Pulse checkmark
      if (checkmarkRef.current) {
        gsap.to(checkmarkRef.current, {
          scale: 1.1,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut"
        });
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
      if (envelopeRef.current) gsap.killTweensOf(envelopeRef.current);
      if (checkmarkRef.current) gsap.killTweensOf(checkmarkRef.current);
    };
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative h-full min-h-[560px] flex items-center justify-center overflow-hidden rounded-2xl">
      {/* Background - Similar gradient style */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 z-10" />
          
          <div 
            className="w-full h-full bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('/images/dashboard-screenshot-${theme === 'dark' ? 'dark' : 'light'}.png')`,
              filter: 'blur(3px)'
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 w-full h-full flex flex-col justify-center items-center px-8 py-6">
        {/* Animated Email Verification Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-8"
        >
          {/* Outer circle with gradient */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl" />
            <div className="relative w-48 h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full backdrop-blur-xl border border-white/20 flex items-center justify-center">
              
              {/* Email envelope animation */}
              <div ref={envelopeRef} className="relative" style={{ transformStyle: 'preserve-3d' }}>
                <IconMail className="w-24 h-24 text-primary" strokeWidth={1.5} />
                
                {/* Checkmark overlay */}
                <div ref={checkmarkRef} className="absolute -top-2 -right-2">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <IconCircleCheck className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Animated Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center max-w-lg"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Verify Your Email
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            We're processing your email verification. This ensures your account is secure and ready for use.
          </p>
        </motion.div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 gap-6 max-w-2xl w-full"
        >
          {/* Feature 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-xl border border-white/10">
              <IconShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Secure</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">256-bit encryption</p>
          </div>

          {/* Feature 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-xl border border-white/10">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Quick</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Instant verification</p>
          </div>

          {/* Feature 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-xl border border-white/10">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Protected</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Account safety</p>
          </div>
        </motion.div>

        {/* Animated dots loader */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-center mt-8 space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmailVisual;