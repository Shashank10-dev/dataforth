import React from 'react';
import { Info, ShieldAlert, TerminalSquare } from 'lucide-react';

export type DisclaimerTone = 'formal' | 'casual' | 'technical';

interface DisclaimerProps {
  title: string;
  children: React.ReactNode;
  tone?: DisclaimerTone;
}

export default function Disclaimer({ title, children, tone = 'casual' }: DisclaimerProps) {
  let Icon = Info;
  let colorClass = 'text-[#F59E0B]'; // Amber for casual
  let bgClass = 'bg-cream/40 dark:bg-dark-cream/40';

  if (tone === 'formal') {
    Icon = ShieldAlert;
    colorClass = 'text-sage dark:text-sage';
    bgClass = 'bg-sage/10 dark:bg-sage/10';
  } else if (tone === 'technical') {
    Icon = TerminalSquare;
    colorClass = 'text-powder dark:text-powder';
    bgClass = 'bg-powder/10 dark:bg-powder/10';
  }

  return (
    <div className={`${bgClass} border border-ink/5 dark:border-white/5 rounded-2xl p-5 flex gap-4 text-sm font-sans items-start mt-auto`}>
      <Icon className={`w-5 h-5 ${colorClass} flex-shrink-0 mt-0.5`} />
      <div>
        <p className="font-medium mb-1 text-ink dark:text-white">{title}</p>
        <div className="opacity-70 leading-relaxed text-ink dark:text-white space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}
