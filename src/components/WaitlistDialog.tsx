'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, X, CheckCircle2, Loader2, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface WaitlistDialogProps {
  buttonClassName?: string;
  label?: string;
}

export function WaitlistDialog({ buttonClassName, label = "RÉSERVER MON BILLET" }: WaitlistDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const firestore = useFirestore();
  const { toast } = useToast();

  const registrationsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'registrations');
  }, [firestore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationsRef) return;
    setIsSubmitting(true);

    const submissionData = {
      name: formData.name,
      phone: formData.phone,
      type: 'WAITLIST',
      createdAt: new Date().toISOString(),
      ticketCode: `OVF-WAIT-${Math.floor(1000 + Math.random() * 9000)}`
    };

    try {
      await addDoc(registrationsRef, submissionData);
      setStep('SUCCESS');
      toast({ title: "Inscription validée", description: "Vous serez averti dès l'ouverture de la billetterie." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de vous inscrire." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className={cn("h-14 md:h-18 px-10 md:px-14 text-[12px] md:text-[16px] font-black rounded-2xl bg-secondary text-black uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(240,230,210,0.3)] hover:scale-105 transition-all border-none italic group", buttonClassName)}
      >
        {label} <Ticket className="ml-2 md:ml-4 w-6 md:w-8 h-6 md:h-8 group-hover:rotate-12 transition-transform" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-2xl text-white"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {step === 'FORM' ? (
                <div className="space-y-10">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto border border-secondary/20">
                      <Ticket className="w-8 h-8 text-secondary" />
                    </div>
                    <h2 className="text-[26px] font-black uppercase italic tracking-tighter leading-tight">
                      LISTE <span className="text-secondary">D'ATTENTE</span>
                    </h2>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.3em] italic">
                      Soyez les premiers à réserver vos billets
                    </p>
                    <div className="w-12 h-1 bg-secondary/30 mx-auto rounded-full" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-black tracking-widest text-white/40 ml-1 flex items-center gap-2">
                          <User className="w-3 h-3" /> Nom Complet
                        </label>
                        <Input 
                          placeholder="Votre nom" 
                          required 
                          className="bg-black/50 border-white/10 h-14 text-sm rounded-2xl focus:border-secondary/50 transition-all italic font-medium"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-black tracking-widest text-white/40 ml-1 flex items-center gap-2">
                          <Phone className="w-3 h-3" /> Numéro WhatsApp
                        </label>
                        <Input 
                          placeholder="+243 ..." 
                          required 
                          type="tel"
                          className="bg-black/50 border-white/10 h-14 text-sm rounded-2xl focus:border-secondary/50 transition-all italic font-medium"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <Button 
                      disabled={isSubmitting}
                      type="submit" 
                      className="w-full h-14 bg-secondary text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-secondary/20 border-none mt-6 hover:scale-[1.02] transition-all"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {isSubmitting ? "INSCRIPTION..." : "VALIDER MA RÉSERVATION"}
                    </Button>
                    <p className="text-center text-[8px] text-white/20 uppercase font-black tracking-widest italic">
                      Priorité garantie pour l'ouverture de la billetterie.
                    </p>
                  </form>
                </div>
              ) : (
                <div className="text-center space-y-10 py-6">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-500/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-3">
                    <h2 className="text-[22px] font-black uppercase italic text-white tracking-tighter">C'EST ENREGISTRÉ !</h2>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest italic leading-relaxed">
                      Merci <span className="text-secondary">{formData.name}</span>. Notre équipe vous contactera <br /> en priorité dès que les pass seront disponibles.
                    </p>
                  </div>

                  <Button 
                    onClick={() => setIsOpen(false)} 
                    className="w-full h-14 bg-white/5 border border-white/10 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                  >
                    FERMER
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}