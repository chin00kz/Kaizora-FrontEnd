import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Globe, Phone, Mail, Link } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function About() {
  const { data: content, isLoading } = useQuery({
    queryKey: ['system-about'],
    queryFn: () => api.get('/system/about').then(res => res.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  const { about, creators } = content;

  return (
    <div className="max-w-4xl mx-auto space-y-24 py-16 px-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* Detailed Introduction Section */}
      <section className="space-y-10">
        <div className="space-y-4">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
              About <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent italic">Kaizora.</span>
            </h1>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
        </div>

        <div className="prose prose-slate prose-xl max-w-none">
          <p className="text-2xl text-slate-700 leading-relaxed font-medium first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary">
             {about}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
            <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Our Mission</h3>
                <p className="text-slate-500 leading-relaxed font-medium transition-colors hover:text-slate-600">
                    To democratize innovation and empower every team member to contribute to organizational excellence through a data-driven, transparent, and rewarding process.
                </p>
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Core Philosophy</h3>
                <p className="text-slate-500 leading-relaxed font-medium transition-colors hover:text-slate-600">
                    Built on the principles of Kaizen—change for the better. We believe that small, consistent improvements lead to massive long-term impact.
                </p>
            </div>
        </div>
      </section>

      {/* System Vision / Footer */}
      <section className="pt-24 border-t border-slate-100 text-center flex flex-col items-center gap-12">
         <div className="max-w-md">
            <p className="text-slate-400 font-medium italic text-lg leading-relaxed">
                "Continuous improvement is not about where you are, but the direction you are moving."
            </p>
         </div>

         {/* Minimalist Credits - Only visible at the end */}
         <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                Engineering & Design by
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-bold text-slate-500">
                {creators.filter(c => c.is_visible).map((c, i, arr) => (
                    <React.Fragment key={c.nickname}>
                        <a 
                            href={c.social_links?.primary || "#"}
                            target={c.social_links?.primary ? "_blank" : undefined}
                            rel={c.social_links?.primary ? "noopener" : undefined}
                            className="group hover:text-primary transition-all duration-300 tracking-tight"
                        >
                            <span className="group-hover:mr-1 transition-all">{c.nickname.replace(' IT', '')}</span>
                            <span className="text-slate-300 mx-1.5 font-light">:</span>
                            <span className="text-[10px] uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
                                {c.department_name || (c.nickname === 'Chanuka IT' ? 'IT' : 'QDM')}
                            </span>
                        </a>
                        {i < arr.length - 1 && <span className="text-slate-200 uppercase hidden sm:inline">•</span>}
                    </React.Fragment>
                ))}
            </div>
         </div>

         <div className="pt-8 opacity-20">
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em]">
                KAIZORA V1.0.0 • 2026
            </p>
         </div>
      </section>
    </div>
  );
}
