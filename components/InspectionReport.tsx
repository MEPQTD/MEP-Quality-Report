import React from 'react';
import { SlideLayout } from './SlideLayout';
import { AppState } from '../types';

interface InspectionReportProps {
  data: AppState;
  id: string;
}

export const InspectionReport: React.FC<InspectionReportProps> = ({ data, id }) => {
  const { metadata, observations } = data;
  const totalSlides = 1 + observations.length;

  return (
    <div id={id} className="flex flex-col gap-0 items-center bg-white w-fit mx-auto print:p-0">
      {/* Professional Brand Cover */}
      <SlideLayout variant="cover" pageNumber={1} totalPage={totalSlides}>
        <div className="flex-1 flex flex-col relative h-full bg-white overflow-hidden">
          {/* Asymmetrical Brand Geometry */}
          <div className="absolute top-0 right-0 w-[55%] h-full bg-[#247e38] -skew-x-6 translate-x-24 z-0 shadow-2xl"></div>
          <div className="absolute top-1/2 left-0 w-32 h-[1px] bg-slate-100 z-0"></div>
          
          <div className="flex-1 flex flex-col px-24 py-16 relative z-10">
            {/* Minimalist Logo Area */}
            <div className="mb-20">
              <svg className="w-80 h-auto filter grayscale opacity-90 brightness-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1927.56 425.197">
                <defs><clipPath id="cp_cover_v3"><path transform="matrix(1,0,0,-1,0,425.197)" d="M0 425.197H1927.559V0H0Z"/></clipPath></defs>
                <g clipPath="url(#cp_cover_v3)">
                  <path transform="matrix(1,0,0,-1,1814.5791,64.22339)" d="M0 0C-.621 .625-1.232 1.242-1.848 1.861-.967 3.247 .223 5.733 1.6 4.585 3.371 3.1 1.156 1.376 0 0" fill="#ffffff"/>
                  <path transform="matrix(1,0,0,-1,1699.956,396.5163)" d="M0 0H-140.102C-166.688 0-183.299 16.707-183.363 43.883-183.473 97.637-183.393 151.355-183.393 205.098-183.393 244.085-183.408 283.079-183.393 322.073-183.371 351.453-167.049 368.134-138.219 368.145-45.795 368.167 46.625 368.167 139.053 368.145 168.914 368.134 184.928 351.759 184.928 321.269 184.938 229.549 184.664 137.824 185.082 46.096 185.215 16.018 165.195-.939 139.369-.318 92.932 .805 46.467 0 0 0" fill="#ffffff"/>
                  <path transform="matrix(1,0,0,-1,1573.8193,368.7566)" d="M0 0C7.23 19.836 17.662 37.482 29.387 54.357 51.297 85.941 79.174 111.416 109.146 134.746 143.105 161.174 176.984 187.653 205.326 220.624 225.453 244.032 242.857 269.362 258.266 296.154 258.266 303.634 262.637 280.052 262.66 258.703 262.627 237.368 262.605 225.127 262.51 212.89 262.396 200.641 262.27 187.539 254.664 179.788 241.768 179.646 233.402 179.551 225.055 179.72 216.697 179.604 204.369 179.433 199.164 174.256 199.012 161.936 198.875 153.186 198.771 144.43 199.111 135.697 199.473 126.182 204.271 121.648 213.58 121.629 222.168 121.605 230.768 121.986 239.371 121.953 257.295 121.871 264.34 114.594 264.404 96.545 264.467 76.318 264.676 56.07 264.744 35.832 264.803 20.852 263.348 19.359 248.967 19.359 224.387 19.359 199.803 19.34 175.23 19.383 161.156 19.404 155.035 25.576 154.768 39.848 154.354 62.559 153.941 85.279 153.512 108.002 153.346 117.461 149.465 122.314 140.283 123.936 135.195 124.834 129.967 124.834 124.881 123.828 116.592 122.188 112.396 117.832 111.973 109.049 110.896 86.127 110.375 63.158 109.477 40.232 108.926 26.559 101.869 19.74 88.461 19.67 74.197 19.588 59.943 19.359 45.693 19.725 28.49 20.178 13.891 14.654 2.137 1.73 1.523 1.057 .707 .572 0 0" fill="#ffffff"/>
                  {/* Paths simplified for brevity in cover display */}
                </g>
              </svg>
            </div>

            <div className="mt-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-1 bg-[#247e38] rounded-full"></div>
                <span className="text-xs font-black text-[#247e38] tracking-[0.4em] uppercase">Audit Statement</span>
              </div>
              
              <h1 className="text-7xl font-extrabold text-slate-900 leading-[1.05] max-w-[800px] mb-12 font-heading tracking-tighter">
                {metadata.projectName || "Field Compliance Analysis"}
              </h1>

              <div className="grid grid-cols-2 gap-16 pt-10 border-t border-slate-100">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Inspector</p>
                  <p className="text-3xl font-bold text-slate-800 tracking-tight">{metadata.inspectorName || "TBD"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issuance Date</p>
                  <p className="text-3xl font-bold text-slate-800 tracking-tight">{metadata.date || "TBD"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SlideLayout>

      {/* Modern Technical Observation Slides */}
      {observations.map((obs, index) => (
        <SlideLayout 
          key={obs.id} 
          variant="observation" 
          pageNumber={index + 2} 
          totalPage={totalSlides}
          projectName={metadata.projectName}
          reportDate={metadata.date}
        >
          <div className="flex-1 flex flex-col px-14 py-10 bg-white h-full overflow-hidden">
            <div className="flex h-full gap-10">
              
              {/* Image Evidence Container */}
              <div className="flex-[3] bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden p-3 relative shadow-inner">
                {obs.photoUrl ? (
                  <img src={obs.photoUrl} className="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-200" />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-slate-200 opacity-60">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="text-[10px] font-black uppercase tracking-widest">Image documentation pending</p>
                  </div>
                )}
                <div className="absolute top-8 left-8 bg-slate-900 text-white px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest shadow-2xl">
                  OBS #{String(index + 1).padStart(3, '0')}
                </div>
              </div>

              {/* Technical Analysis Panel */}
              <div className="flex-[2] flex flex-col gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h4 className="text-[10px] font-black text-[#247e38] uppercase tracking-[0.25em] whitespace-nowrap">Technical Assessment</h4>
                    <div className="h-[1px] w-full bg-slate-100"></div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-[4px] bg-[#247e38]/10 rounded-full"></div>
                    <p className="text-xl font-bold text-slate-800 leading-[1.6] italic tracking-tight whitespace-pre-wrap break-words">
                      {obs.description || "Analytical data pending verification by lead auditor."}
                    </p>
                  </div>
                </div>

                <div className="mt-auto p-6 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#247e38]/5 rounded-bl-full"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">MEP Standard Compliance</span>
                  <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                    Log generated via MEP Audit Master. Discovered deviations require immediate corrective action as per project specifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SlideLayout>
      ))}
    </div>
  );
};