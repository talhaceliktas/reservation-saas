"use client";

import { CreditCard as CardIcon, Wifi } from "lucide-react";

interface CreditCardWidgetProps {
  cardText: string;
}

export function CreditCardWidget({ cardText }: CreditCardWidgetProps) {
  return (
    <div className="relative w-72 h-44 bg-slate-900 rounded-2xl p-6 text-white shadow-2xl overflow-hidden transform transition-transform group-hover:rotate-2 group-hover:scale-105 duration-500">
      {/* Background Shine Effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-tr from-white/5 to-transparent"></div>

      {/* Icons */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <CardIcon className="w-8 h-8 opacity-90" />
        <Wifi className="w-6 h-6 opacity-60 rotate-90" />
      </div>

      {/* Card Details */}
      <div className="space-y-1 mb-2 relative z-10">
        <div className="text-[10px] opacity-50 tracking-widest font-medium">
          {cardText.toUpperCase()}
        </div>
        <div className="text-lg font-mono tracking-widest text-slate-100 drop-shadow-sm">
          4532 •••• •••• 8890
        </div>
      </div>

      <div className="text-lg font-mono text-slate-100 drop-shadow-sm">
        John Doe
      </div>
    </div>
  );
}
