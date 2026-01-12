
"use client";
import dynamic from 'next/dynamic';
const Flowchart = dynamic(() => import("@/components/flowchart/flowchart").then(m => m.Flowchart), { ssr: false });

export default function AccountingFlowchartPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline text-white">
          Accounting Flowchart
        </h2>
      </div>
      <p className="text-muted-foreground">
        This flowchart outlines the main accounting processes in LJMA FinancePro. Click on a process to begin.
      </p>
      <div className="min-h-[600px] p-6">
        <div className="w-full overflow-x-auto">
          <Flowchart />
        </div>
      </div>
    </div>
  );
}
