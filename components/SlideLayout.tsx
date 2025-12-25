
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
      className={`pdf-slide slide-aspect-ratio w-full max-w-[1120px] bg-white relative overflow-hidden flex flex-col shadow-xl print:shadow-none print:border-none border border-slate-100 ${className}`}
      style={style}
    >
      {!isCover && (
        <div className="w-full bg-white border-b border-slate-100 px-12 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-1 h-6 bg-[#50C878] rounded-full"></div>
             <div>
               <h3 className="text-[10px] font-extrabold text-[#50C878] tracking-[0.2em] uppercase leading-none mb-1 font-heading">
                 Quality Report
               </h3>
               <p className="text-sm font-bold text-[#333333] leading-none truncate max-w-[600px]">
                 {projectName || 'Pharmacy Audit Details'}
               </p>
             </div>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Inspection Date</span>
             <span className="text-xs font-bold text-[#333333] tracking-tighter">
               {reportDate || 'N/A'}
             </span>
          </div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col min-h-0 relative">
        {children}
      </div>

      {!isCover && (
        <div className="px-12 py-3 bg-[#F5F5F5] border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Footer labels removed as requested */}
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            </span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-bold text-[#333333] font-heading tracking-widest">
               PAGE {pageNumber} / {totalPage}
             </span>
          </div>
        </div>
      )}
    </div>
  );
};
