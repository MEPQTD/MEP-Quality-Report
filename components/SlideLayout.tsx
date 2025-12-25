import React from 'react';

interface SlideLayoutProps {
  children: React.ReactNode;
  pageNumber?: number;
  totalPage?: number;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'cover' | 'observation' | 'summary';
  projectName?: string;
  reportDate?: string;
}

export const SlideLayout: React.FC<SlideLayoutProps> = ({ 
  children, 
  pageNumber, 
  totalPage, 
  className = "",
  style,
  variant = 'observation',
  projectName,
  reportDate
}) => {
  const isCover = variant === 'cover';

  return (
    <div 
      className={`pdf-slide slide-aspect-ratio w-full max-w-[1120px] bg-white relative overflow-hidden flex flex-col border border-slate-100 ${className}`}
      style={style}
    >
      {!isCover && (
        <div className="w-full bg-white border-b border-slate-100 px-14 py-6 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-5">
             <div className="w-1.5 h-10 bg-[#247e38] rounded-full"></div>
             <div>
               <h3 className="text-[10px] font-black text-[#247e38] tracking-[0.35em] uppercase leading-none mb-1.5 font-heading">
                 Compliance Audit
               </h3>
               <p className="text-base font-extrabold text-slate-800 leading-none truncate max-w-[500px] tracking-tight">
                 {projectName || 'Field Verification Details'}
               </p>
             </div>
          </div>
          <div className="text-right">
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Observation Date</span>
             <span className="text-sm font-black text-slate-800 tracking-tight">
               {reportDate || '—'}
             </span>
          </div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col min-h-0 relative">
        {children}
      </div>

      {!isCover && (
        <div className="px-14 py-4 bg-white border-t border-slate-100 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-sm bg-[#247e38]/20 rotate-45"></div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.25em]">Quality Assurance Protocols</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-slate-800 font-heading tracking-[0.2em] uppercase">
               Page {pageNumber} / {totalPage}
             </span>
          </div>
        </div>
      )}
    </div>
  );
};