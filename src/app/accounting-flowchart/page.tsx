
"use client";
import dynamic from 'next/dynamic';
const Flowchart = dynamic(() => import("@/components/flowchart/flowchart").then(m => m.Flowchart), { ssr: false });

export default function AccountingFlowchartPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-10 pt-8 bg-black/40">
      <div className="relative flex flex-col gap-2">
        {/* Decorative Element */}
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/20 blur-3xl rounded-full" />
        
        <h2 className="text-4xl font-black tracking-tight font-headline text-white uppercase italic">
          Operational <span className="text-primary not-italic">Flowchart</span>
        </h2>
        <p className="text-sm text-muted-foreground/80 max-w-2xl font-medium tracking-wide">
          Navigate through LJMA FinancePro's core accounting cycles. 
          Each node represents a critical business process—click to initiate the corresponding workflow.
        </p>
      </div>

      <div className="relative group">
        {/* Container Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
        
        <div className="relative w-full overflow-x-auto rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-sm shadow-2xl">
          <div className="min-w-[1400px] p-8">
            <Flowchart />
          </div>
        </div>
      </div>
    </div>
  );
}
