"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Phone, Instagram, Twitter, Facebook } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const DEFAULT_LOGO_URL = "https://res.cloudinary.com/dvz91qth6/image/upload/v1740261394/one-vibe-logo_t9v6v9.png";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1 .05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
  </svg>
);

export function Footer() {
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'festival') : null, [firestore]);
  const { data: settings } = useDoc(settingsRef);

  const logoUrl = settings?.logoUrl || DEFAULT_LOGO_URL;
  const instagramUrl = settings?.instagramUrl || '#';
  const twitterUrl = settings?.twitterUrl || '#';
  const facebookUrl = settings?.facebookUrl || '#';
  const tiktokUrl = settings?.tiktokUrl || '#';

  if (!mounted) return null;

  return (
    <footer className="bg-black pt-12 pb-8 text-white relative overflow-hidden font-display border-t border-white/5 mt-10">
      <div className="max-w-7xl mx-auto relative z-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-12">
          
          {/* LOGO & RÉSEAUX */}
          <div className="space-y-6">
            <div className="relative h-14 w-auto flex items-center">
              <img 
                src={logoUrl} 
                alt="ONE VIBE" 
                className="h-14 w-auto object-contain brightness-110" 
              />
            </div>
            <p className="text-[11px] text-white/60 font-black leading-relaxed italic uppercase tracking-tight max-w-xs">
              L'EXPERIENCE MULTIDIMENSIONNELLE ULTIME. <br />MUSIQUE • CREATIVITÉ • DIGITAL.
            </p>
            <div className="flex items-center gap-4">
              {[
                { url: instagramUrl, icon: <Instagram className="w-5 h-5" /> },
                { url: twitterUrl, icon: <Twitter className="w-5 h-5" /> },
                { url: facebookUrl, icon: <Facebook className="w-5 h-5" /> },
                { url: tiktokUrl, icon: <TikTokIcon className="w-5 h-5" /> }
              ].map((social, i) => (
                <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic border-l-2 border-secondary pl-4">CONTACT</h3>
            <ul className="space-y-5">
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <Mail className="w-5 h-5 text-secondary" />
                </div>
                <a href="mailto:konektrevolution@gmail.com" className="text-[11px] font-black uppercase text-white/80 hover:text-secondary transition-colors italic tracking-tight truncate">konektrevolution@gmail.com</a>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <Phone className="w-5 h-5 text-secondary" />
                </div>
                <a href="https://wa.me/243994472599" target="_blank" className="text-[11px] font-black uppercase text-white/80 hover:text-secondary transition-colors italic tracking-tight">+243 994 472 599</a>
              </li>
            </ul>
          </div>

          {/* PRO ACTION */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic border-l-2 border-secondary pl-4">PRO</h3>
            <div className="flex flex-col gap-4">
              <Button asChild className="h-12 bg-white text-black text-[10px] font-black uppercase tracking-[0.1em] rounded-xl hover:scale-105 transition-all shadow-xl italic border-none">
                <Link href="/exposants">RÉSERVER UN STAND</Link>
              </Button>
              <p className="text-[9px] font-bold text-white/30 uppercase italic">Boostez votre marque au cœur de l'énergie kinoise.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic">
            © 2027 ONE VIBE FEST • KINSHASA
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black italic opacity-20 text-white">
            EXPERIENCE • CREATIVITY • FUTURE
          </div>
        </div>
      </div>
    </footer>
  );
}