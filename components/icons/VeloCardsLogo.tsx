"use client";
import Image from "next/image";
import { Inter, Outfit, Plus_Jakarta_Sans, DM_Sans, Manrope } from "next/font/google";

// Modern font options - using lighter weights
const logoFont = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500"], // Light to medium weights
});

// Alternative fonts you can try:
//const logoFont = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });
// const logoFont = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });
// const logoFont = Manrope({ subsets: ["latin"], weight: ["300", "400", "500"] });
// const logoFont = Inter({ subsets: ["latin"], weight: ["300", "400", "500"] });

interface VeloCardsLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const VeloCardsLogo = ({ 
  className = "", 
  width = 60, 
  height = 60 
}: VeloCardsLogoProps) => {
  return (
    <div 
      className={`relative ${className}`} 
      style={{ width, height }}
    >
      <Image
        src="/images/velocards-logo.png"
        alt="VeloCards"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );
};

export const VeloCardsLogoWithText = ({ 
  className = "",
  showTagline = true,
  alignment = "bottom" 
}: { 
  className?: string;
  showTagline?: boolean;
  alignment?: "center" | "bottom";
}) => {
  return (
    <div className={`flex ${alignment === "center" ? "items-center" : "items-end"} gap-2 ${className}`}>
      <VeloCardsLogo width={70} height={70} />
      <div className="flex flex-col">
        <span 
          className={`text-2xl font-medium bg-gradient-to-r from-primary via-emerald-500 to-teal-500 bg-clip-text text-transparent ${logoFont.className}`}
          style={{
            letterSpacing: '0.01em',
            lineHeight: '1',
            fontWeight: '500'
          }}
        >
          VeloCards
        </span>
        {showTagline && (
          <span className="text-sm text-gray-600 dark:text-gray-400 font-normal mt-1">
            by DigiStreets
          </span>
        )}
      </div>
    </div>
  );
};