import React, { useState, useRef, useEffect } from 'react';
import { AppState, Discipline, Severity, Observation } from './types';
import { exportToPdf } from './services/pdfService';
import { InspectionReport } from './components/InspectionReport';

const PHARMACY_LOCATIONS = [
  "Albustan Compound Pharmacy", "Digital City Pharmacy", "Diplomatic Main Pharmacy",
  "KAFD 212 Pharmacy", "KAFD 309 Pharmacy", "Fayha Main Pharmacy", "Fayha ER Pharmacy",
  "Fayha First Floor Pharmacy", "Ghadeer Main Pharmacy", "Hamra Main Pharmacy",
  "Hamra ER Pharmacy", "Khobar Main Pharmacy", "Khobar ER Pharmacy",
  "Khobar First Floor Pharmacy", "Khobar Medical Center Pharmacy", "Kharj Main Pharmacy",
  "Kharj ER Pharmacy", "KKIA T3 Pharmacy", "Mohammadiyah Main Pharmacy",
  "Mohammadiyah ER Pharmacy", "Mohammadiyah First Floor Pharmacy", "Narjis Main Pharmacy",
  "Olaya Derma Pharmacy", "Olaya Main Pharmacy", "Olaya Neurology Pharmacy",
  "OSSH Main Pharmacy", "Qassim Main Pharmacy", "Qassim Expansion Pharmacy",
  "Qassim Street Pharmacy", "Buraydah Polyclinic Pharmacy", "Rabigh Pharmacy",
  "Rayan Main Pharmacy", "Rayan ER Pharmacy", "Rayan ObGyn Pharmacy",
  "Rayan Street Pharmacy", "Sewedi Main Pharmacy", "Sewedi ER Pharmacy",
  "Hamza Street Pharmacy", "Sahafa Main Pharmacy", "Sahafa ER Pharmacy",
  "Sahafa First Floor Pharmacy", "Takhassussi Main Pharmacy", "Plastic Surgery Pharmacy",
  "Takhassussi Basement Pharmacy", "Takhassussi OB Pharmacy"
];

const INSPECTORS = [
  "Ahmad Abu Alreesh", "Ahmad Hammam Attia", "Salman Othman"
];

const App: React.FC = () => {
  const [data, setData] = useState<AppState>({
    metadata: {
      projectName: '',
      reportTitle: 'MEP Quality Inspection',
      date: new Date().toISOString().split('T')[0],
      inspectorName: '',
      clientName: '',
      location: ''
    },
    observations: []
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [previewScale, setPreviewScale] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth - 80;
        const scale = Math.min(containerWidth / 1120, 1);
        setPreviewScale(scale);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [name]: value }
    }));
  };

  const addEmptyObservation = () => {
    const newObs: Observation = {
      id: crypto.randomUUID(),
      discipline: Discipline.GENERAL,
      location: '',
      description: '',
      correctiveAction: '',
      severity: Severity.LOW,
      photoUrl: ''
    };
    setData(prev => ({
      ...prev,
      observations: [...prev.observations, newObs]
    }));
  };

  const updateObservation = (id: string, updates: Partial<Observation>) => {
    setData(prev => ({
      ...prev,
      observations: prev.observations.map(o => o.id === id ? { ...o, ...updates } : o)
    }));
  };

  const removeObservation = (id: string) => {
    setData(prev => ({
      ...prev,
      observations: prev.observations.filter(o => o.id !== id)
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;
    const base64Images = await Promise.all(files.slice(0, 30).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });
    }));

    const newEntries: Observation[] = base64Images.map(img => ({
      id: crypto.randomUUID(),
      photoUrl: img,
      discipline: Discipline.GENERAL,
      location: '',
      description: '',
      correctiveAction: '',
      severity: Severity.LOW
    }));

    setData(prev => ({ ...prev, observations: [...prev.observations, ...newEntries] }));
    e.target.value = '';
  };

  const handleExport = async () => {
    setActiveTab('preview');
    setTimeout(async () => {
      await exportToPdf('report-content', `MEP_Audit_${data.metadata.projectName.replace(/\s+/g, '_') || 'Report'}`);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Sleek Navigation Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#247e38] flex items-center justify-center rounded-lg shadow-md shadow-[#247e38]/20">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" /></svg>
             </div>
             <h1 className="font-extrabold text-sm tracking-tight uppercase font-heading text-slate-800">MEP Compliance</h1>
          </div>
          <div className="h-4 w-[1px] bg-slate-200"></div>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button onClick={() => setActiveTab('edit')} className={`px-6 py-1.5 rounded-md text-[11px] font-bold transition-all ${activeTab === 'edit' ? 'bg-white text-[#247e38] shadow-sm' : 'text-slate-500'}`}>EDITOR</button>
            <button onClick={() => setActiveTab('preview')} className={`px-6 py-1.5 rounded-md text-[11px] font-bold transition-all ${activeTab === 'preview' ? 'bg-white text-[#247e38] shadow-sm' : 'text-slate-500'}`}>PREVIEW</button>
          </div>
        </div>

        <button onClick={handleExport} className="bg-[#247e38] text-white px-6 py-2 rounded-lg font-bold text-[11px] shadow-lg shadow-[#247e38]/10 hover:brightness-95 transition-all flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          EXPORT REPORT
        </button>
      </header>

      <main className="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">
        {/* Modern Sidebar UI */}
        <div className={`w-[440px] bg-white border-r border-slate-200 overflow-y-auto ${activeTab === 'preview' ? 'hidden md:block' : 'block'}`}>
          <div className="p-8 space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-black text-[#247e38] uppercase tracking-widest bg-[#247e38]/5 px-2 py-1 rounded">Project Details</span>
              </div>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Pharmacy Location</label>
                  <select name="projectName" value={data.metadata.projectName} onChange={handleMetadataChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium transition-all focus:bg-white focus:shadow-sm">
                    <option value="">Select Project Site...</option>
                    {PHARMACY_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Inspection Date</label>
                    <input type="date" name="date" value={data.metadata.date} onChange={handleMetadataChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Inspector</label>
                    <select name="inspectorName" value={data.metadata.inspectorName} onChange={handleMetadataChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium">
                      <option value="">Choose...</option>
                      {INSPECTORS.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-[#247e38] uppercase tracking-widest bg-[#247e38]/5 px-2 py-1 rounded">Observations ({data.observations.length})</span>
                <button onClick={addEmptyObservation} className="text-[#247e38] hover:bg-[#247e38]/10 p-2 rounded-full transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>

              <div className="space-y-6">
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center gap-3 text-slate-400 hover:border-[#247e38] hover:text-[#247e38] hover:bg-[#247e38]/5 transition-all">
                  <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                  <span className="text-[11px] font-bold tracking-widest uppercase">Batch Upload (Up to 30 Photos)</span>
                </button>
                <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*" />

                {data.observations.map((obs, idx) => (
                  <div key={obs.id} className="relative bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute -left-2 top-4 w-6 h-6 bg-slate-800 text-white flex items-center justify-center text-[10px] font-black rounded shadow-lg">
                      {idx + 1}
                    </div>
                    <button onClick={() => removeObservation(obs.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    
                    <div className="flex flex-col gap-4">
                      <div className="w-full aspect-video bg-slate-50 border border-slate-100 rounded-xl overflow-hidden relative cursor-pointer group/media" onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.onchange = (e) => {
                          const f = (e.target as HTMLInputElement).files?.[0];
                          if(f) {
                            const r = new FileReader();
                            r.onload = (ev) => updateObservation(obs.id, { photoUrl: ev.target?.result as string });
                            r.readAsDataURL(f);
                          }
                        };
                        input.click();
                      }}>
                        {obs.photoUrl ? (
                          <img src={obs.photoUrl} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-300">
                             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                             <span className="text-[9px] font-black uppercase tracking-widest">Select Image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold uppercase tracking-widest border border-white/40 px-3 py-1.5 rounded-full backdrop-blur-sm">Replace</span>
                        </div>
                      </div>
                      <textarea
                        value={obs.description}
                        onChange={(e) => updateObservation(obs.id, { description: e.target.value })}
                        placeholder="Describe the finding technical details..."
                        className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-medium resize-none h-28 leading-relaxed focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Dynamic Preview Canvas */}
        <div ref={previewContainerRef} className={`flex-1 bg-[#F1F5F9] overflow-y-auto p-12 md:p-16 ${activeTab === 'edit' ? 'hidden md:block' : 'block'}`}>
          <div 
            className="mx-auto origin-top transition-all duration-500 ease-out"
            style={{ transform: `scale(${previewScale})`, width: '1120px' }}
          >
             <div className="shadow-[0_40px_120px_-30px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden ring-1 ring-slate-200">
                <InspectionReport data={data} id="report-content" />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;