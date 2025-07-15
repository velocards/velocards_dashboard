"use client";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

const SignUpPageVisual = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  
  const words = [
    "Students",
    "Professionals",
    "Entrepreneurs",
    "Travelers",
    "Investors",
    "Freelancers",
    "Developers",
    "Creators"
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    let animationTimeout: NodeJS.Timeout;
    let typeInterval: NodeJS.Timeout;
    let currentIndex = 0;
    
    // Wait for next tick to ensure refs are attached
    const timer = setTimeout(() => {
      if (!textRef.current || !cursorRef.current) return;
      
      // Initialize text content
      if (textRef.current) {
        textRef.current.textContent = words[0];
      }
      
      // Blinking cursor animation
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          opacity: 0,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut"
        });
      }

      // Create a timeline for word animations
      const animateWord = () => {
        const nextIndex = (currentIndex + 1) % words.length;
        const nextWord = words[nextIndex];
        
        // Typing out effect
        const tl = gsap.timeline({
          onComplete: () => {
            currentIndex = nextIndex;
            animationTimeout = setTimeout(animateWord, 2000); // Wait 2 seconds before next word
          }
        });
        
        // Fade out and clear current word
        if (textRef.current) {
          tl.to(textRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              if (textRef.current) textRef.current.textContent = "";
            }
          })
          // Type in new word letter by letter
          .set(textRef.current, { opacity: 1 })
          .call(() => {
            if (!textRef.current) return;
          let charIndex = 0;
          // Clear any existing interval
          if (typeInterval) clearInterval(typeInterval);
          
          typeInterval = setInterval(() => {
            if (charIndex < nextWord.length && textRef.current) {
              textRef.current.textContent = nextWord.substring(0, charIndex + 1);
              charIndex++;
            } else {
              clearInterval(typeInterval);
            }
          }, 50);
        });
        }
      };
      
      // Start animation
      animateWord();
    }, 100); // Small delay to ensure DOM is ready
    
    return () => {
      clearTimeout(timer);
      clearTimeout(animationTimeout);
      clearInterval(typeInterval);
      if (textRef.current) gsap.killTweensOf(textRef.current);
      if (cursorRef.current) gsap.killTweensOf(cursorRef.current);
    };
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative h-full min-h-[560px] flex items-center justify-center overflow-hidden rounded-2xl">
      {/* Background - Dashboard Screenshot */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          {/* Gradient overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 z-10" />
          
          {/* Dashboard screenshot - will use different images for light/dark mode */}
          <div 
            className="w-full h-full bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('/images/dashboard-screenshot-${theme === 'dark' ? 'dark' : 'light'}.png')`,
              filter: 'blur(3px)'
            }}
          />
          
          {/* Fallback gradient if no screenshot */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between px-8 py-6">
        {/* Animated Heading at the very top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center"
        >
          <h1 className="text-gray-800 dark:text-white" style={{ fontSize: '3.75rem !important', fontWeight: 'bold', lineHeight: '1.1' }}>
            <span style={{ fontWeight: '300', fontSize: '2.125rem', display: 'block', marginBottom: '0.5rem' }} className="text-gray-700 dark:text-gray-300">Join Thousands of</span>
            <span ref={textRef} className="text-primary" style={{ fontWeight: '700', fontSize: 'inherit' }}>Students</span>
            <span ref={cursorRef} className="text-primary" style={{ fontWeight: '300', fontSize: 'inherit' }}>|</span>
          </h1>
        </motion.div>

        {/* Floating Credit Cards */}
        <div className="relative w-full max-w-md mx-auto mt-12 mb-8">
          {/* First Card - Top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mb-[-60px] ml-8"
          >
            <div className="relative transform rotate-6 hover:rotate-3 transition-transform duration-300">
            {/* Glassmorphic Card */}
            <div className="relative w-80 h-48 rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/10 border border-white/20 shadow-2xl">
              {/* Card shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
              
              {/* Card content */}
              <div className="relative p-6 h-full flex flex-col justify-between">
                {/* Card header */}
                <div className="flex justify-between items-start">
                  <div className="text-white">
                    <p className="text-xs opacity-70">VeloCards</p>
                    <p className="font-semibold">Student Card</p>
                  </div>
                  <div className="text-white text-2xl font-bold opacity-80">
                    VISA
                  </div>
                </div>
                
                {/* Card number */}
                <div className="text-white">
                  <p className="text-lg font-mono tracking-wider">
                    •••• •••• •••• 1234
                  </p>
                </div>
                
                {/* Card footer */}
                <div className="flex justify-between items-end">
                  <div className="text-white">
                    <p className="text-xs opacity-70">Card Holder</p>
                    <p className="text-sm font-medium">YOUR NAME</p>
                  </div>
                  <div className="text-white text-right">
                    <p className="text-xs opacity-70">Expires</p>
                    <p className="text-sm font-medium">12/28</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </div>
          </div>
        </motion.div>

        {/* Second Card - Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mr-8"
        >
          <div className="relative transform -rotate-6 hover:-rotate-3 transition-transform duration-300">
            {/* Glassmorphic Card */}
            <div className="relative w-80 h-48 rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-black/30 to-black/20 border border-white/20 shadow-2xl">
              {/* Card shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
              
              {/* Card content */}
              <div className="relative p-6 h-full flex flex-col justify-between">
                {/* Card header */}
                <div className="flex justify-between items-start">
                  <div className="text-white">
                    <p className="text-xs opacity-70">VeloCards</p>
                    <p className="font-semibold">Business Card</p>
                  </div>
                  <div className="text-white text-2xl font-bold opacity-80">
                    VISA
                  </div>
                </div>
                
                {/* Card number */}
                <div className="text-white">
                  <p className="text-lg font-mono tracking-wider">
                    •••• •••• •••• 5678
                  </p>
                </div>
                
                {/* Card footer */}
                <div className="flex justify-between items-end">
                  <div className="text-white">
                    <p className="text-xs opacity-70">Card Holder</p>
                    <p className="text-sm font-medium">COMPANY NAME</p>
                  </div>
                  <div className="text-white text-right">
                    <p className="text-xs opacity-70">Expires</p>
                    <p className="text-sm font-medium">06/29</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
            </div>
          </div>
        </motion.div>
        </div>
        
        {/* Spacer */}
        <div className="flex-1"></div>
        
        {/* Feature Cards - moved to bottom */}
        <div className="relative w-full max-w-md mx-auto space-y-3 mb-4">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-xl p-3 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Secure Virtual Cards</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Create unlimited cards for safe online shopping</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-xl p-3 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Instant Activation</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Start using your cards immediately after creation</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-xl p-3 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Real-time Analytics</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Track spending and manage budgets effortlessly</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Start your journey to smarter financial management today
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPageVisual;