import heroImg from "@/assets/hero.png";
import { Megaphone } from "lucide-react";
import { useSystemStatus } from "@/context/SystemStatusContext";

export function HeroBanner() {
  const { status } = useSystemStatus();
  
  const coverPhotoUrl = status?.hero_banner_image || heroImg;
  
  const defaultTexts = [
    "Welcome to the Kaizora Command Center! Submit your innovative ideas today.",
    "🏆 Goal of the Month: 100% Quality Assurance Compliance across all departments.",
    "Reminder: The QDM review cycle closes every Friday at 5:00 PM.",
    "💡 Top Kaizen this week generated an estimated $5,000 in operational savings!"
  ];

  const textsToDisplay = (status?.hero_banner_texts && status.hero_banner_texts.length > 0) 
    ? status.hero_banner_texts 
    : defaultTexts;

  return (
    <div className="relative w-full h-48 md:h-64 rounded-[2rem] overflow-hidden shadow-2xl mb-8 flex flex-col justify-end">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${coverPhotoUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#4d148c]/90 via-[#4d148c]/40 to-transparent mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff7e28]/20 to-transparent" />

      {/* Marquee Bar */}
      <div className="relative z-10 bg-black/40 backdrop-blur-md border-t border-white/10 overflow-hidden flex items-center h-12">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/80 to-transparent z-20 flex items-center justify-center pl-4">
          <Megaphone className="w-4 h-4 text-[#ff7e28] animate-pulse" />
        </div>
        
        <div className="whitespace-nowrap animate-marquee flex items-center gap-12 text-sm font-bold text-white/90 pl-16">
          {textsToDisplay.map((text, idx) => (
            <span key={idx} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff7e28]"></span>
              {text}
            </span>
          ))}
        </div>
        
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/80 to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
}
