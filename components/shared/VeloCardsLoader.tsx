"use client";
import { VeloCardsLogo } from "@/components/icons/VeloCardsLogo";

interface VeloCardsLoaderProps {
  message?: string;
}

const VeloCardsLoader = ({ message = "Loading..." }: VeloCardsLoaderProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-n0 dark:bg-bg4 z-[9999]">
      <div 
        className="relative animate-pulse"
        style={{
          filter: "drop-shadow(0 0 20px #20B757) drop-shadow(0 0 40px #10b981)",
          animation: "gradientGlow 3s ease-in-out infinite"
        }}
      >
        <VeloCardsLogo width={180} height={180} />
        
        <style jsx>{`
          @keyframes gradientGlow {
            0%, 100% { 
              filter: drop-shadow(0 0 20px #20B757) drop-shadow(0 0 35px #20B757); 
            }
            25% { 
              filter: drop-shadow(0 0 25px #10b981) drop-shadow(0 0 40px #10b981); 
            }
            50% { 
              filter: drop-shadow(0 0 20px #14b8a6) drop-shadow(0 0 35px #14b8a6); 
            }
            75% { 
              filter: drop-shadow(0 0 25px #10b981) drop-shadow(0 0 40px #10b981); 
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default VeloCardsLoader;