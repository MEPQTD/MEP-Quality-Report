
import React, { useState, useRef, useEffect } from 'react';
import { AppState, Discipline, Severity, Observation } from './types';
import { exportToPdf } from './services/pdfService';
import { InspectionReport } from './components/InspectionReport';

const PHARMACY_LOCATIONS = [
  "Albustan Compound Pharmacy",
  "Digital City Pharmacy",
  "Diplomatic Main Pharmacy",
  "KAFD 212 Pharmacy",
  "KAFD 309 Pharmacy",
  "Fayha Main Pharmacy",
  "Fayha ER Pharmacy",
  "Fayha First Floor Pharmacy",
  "Ghadeer Main Pharmacy",
  "Hamra Main Pharmacy",
  "Hamra ER Pharmacy",
  "Khobar Main Pharmacy",
  "Khobar ER Pharmacy",
  "Khobar First Floor Pharmacy",
  "Khobar Medical Center Pharmacy",
  "Kharj Main Pharmacy",
  "Kharj ER Pharmacy",
  "KKIA T3 Pharmacy",
  "Mohammadiyah Main Pharmacy",
  "Mohammadiyah ER Pharmacy",
  "Mohammadiyah First Floor Pharmacy",
  "Narjis Main Pharmacy",
  "Olaya Derma Pharmacy",
  "Olaya Main Pharmacy",
  "Olaya Neurology Pharmacy",
  "OSSH Main Pharmacy",
  "Qassim Main Pharmacy",
  "Qassim Expansion Pharmacy",
  "Qassim Street Pharmacy",
  "Buraydah Polyclinic Pharmacy",
  "Rabigh Pharmacy",
  "Rayan Main Pharmacy",
  "Rayan ER Pharmacy",
  "Rayan ObGyn Pharmacy",
  "Rayan Street Pharmacy",
  "Sewedi Main Pharmacy",
  "Sewedi ER Pharmacy",
  "Hamza Street Pharmacy",
  "Sahafa Main Pharmacy",
  "Sahafa ER Pharmacy",
  "Sahafa First Floor Pharmacy",
  "Takhassussi Main Pharmacy",
  "Plastic Surgery Pharmacy",
  "Takhassussi Basement Pharmacy",
  "Takhassussi OB Pharmacy"
];

const INSPECTORS = [
  "Ahmad Abu Alreesh",
  "Ahmad Hammam Attia",
  "Salman Othman"
];

const App: React.FC = () => {
  const [data, setData] = useState<AppState>({
    metadata: {
      projectName: '',
      reportTitle: 'Quality Inspection Report',
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

  // Scaling logic to fit preview
  useEffect(() => {
    const handleResize = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth - 96; // larger padding for professional look
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
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const selectedFiles = files.slice(0, 30);
    
    const readAsDataURL = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.readAsDataURL(file);
      });
    };

    const base64Images = await Promise.all(selectedFiles.map(readAsDataURL));

    const newEntries: Observation[] = base64Images.map(img => ({
      id: crypto.randomUUID(),
      photoUrl: img,
      discipline: Discipline.GENERAL,
      location: '',
      description: '',
      correctiveAction: '',
      severity: Severity.LOW
    }));

    setData(prev => ({
      ...prev,
      observations: [...prev.observations, ...newEntries]
    }));
    
    e.target.value = '';
  };

  const handleExport = async () => {
    setActiveTab('preview');
    setTimeout(async () => {
      await exportToPdf('report-content', `Audit_${data.metadata.projectName.replace(/\s+/g, '_') || 'Report'}`);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#333333] overflow-hidden font-sans">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-[#50C878] text-white p-2.5 rounded-2xl shadow-lg shadow-[#50C878]/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-[#333333] uppercase leading-none mb-1 font-heading">Quality Report</h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase leading-none">Pharmacy Compliance</p>
          </div>
        </div>
        
        <div className="flex gap-2 bg-[#F5F5F5] p-1.5 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('edit')}
            className={`px-8 py-2 rounded-xl font-bold text-xs transition-all ${activeTab === 'edit' ? 'bg-white text-[#50C878] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            EDIT AUDIT
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`px-8 py-2 rounded-xl font-bold text-xs transition-all ${activeTab === 'preview' ? 'bg-white text-[#50C878] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            VIEW REPORT
          </button>
        </div>

        <button 
          onClick={handleExport}
          className="bg-[#50C878] hover:bg-[#3db064] text-white px-8 py-3 rounded-2xl font-black text-xs shadow-xl shadow-[#50C878]/20 transition-all flex items-center gap-2 group"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          DOWNLOAD PDF
        </button>
      </header>

      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-85px)]">
        <div className={`w-full md:w-[420px] bg-white border-r border-slate-200 overflow-y-auto ${activeTab === 'preview' ? 'hidden md:block' : 'block'}`}>
          <div className="p-10 space-y-12">
            <section>
              <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                <span className="flex-shrink-0">Basic information</span>
                <div className="flex-1 h-[1px] bg-slate-100"></div>
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pharmacy</label>
                  <select 
                    name="projectName" 
                    value={data.metadata.projectName} 
                    onChange={handleMetadataChange}
                    className="w-full bg-[#F5F5F5] border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold focus:border-[#50C878] focus:ring-4 focus:ring-[#50C878]/5 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Pharmacy...</option>
                    {PHARMACY_LOCATIONS.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Inspection Date</label>
                    <input 
                      type="date"
                      name="date" 
                      value={data.metadata.date} 
                      onChange={handleMetadataChange}
                      className="w-full bg-[#F5F5F5] border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold focus:border-[#50C878] focus:ring-4 focus:ring-[#50C878]/5 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Inspector</label>
                    <select 
                      name="inspectorName" 
                      value={data.metadata.inspectorName} 
                      onChange={handleMetadataChange}
                      className="w-full bg-[#F5F5F5] border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold focus:border-[#50C878] focus:ring-4 focus:ring-[#50C878]/5 transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Select Inspector...</option>
                      {INSPECTORS.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-4 flex-1">
                   <span className="flex-shrink-0">Observations ({data.observations.length})</span>
                   <div className="flex-1 h-[1px] bg-slate-100"></div>
                </h2>
                <button 
                  onClick={addEmptyObservation}
                  className="ml-4 text-white bg-[#50C878] hover:bg-[#3db064] p-2.5 rounded-xl transition-all shadow-lg shadow-[#50C878]/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-3 py-12 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 hover:border-[#50C878] hover:text-[#50C878] hover:bg-[#50C878]/5 transition-all group relative"
                >
                  <div className="w-14 h-14 rounded-full bg-[#F5F5F5] group-hover:bg-white flex items-center justify-center transition-colors shadow-sm">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-black tracking-widest uppercase block mb-1">Upload Audit Media</span>
                    <span className="text-[10px] opacity-60 font-medium">Batch support up to 30 images</span>
                  </div>
                </button>

                {data.observations.map((obs, idx) => (
                  <div key={obs.id} className="p-6 bg-[#F5F5F5]/40 border border-slate-100 rounded-[2rem] space-y-5 relative group hover:bg-white hover:border-[#50C878]/20 transition-all shadow-sm">
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-[#333333] text-white rounded-2xl flex items-center justify-center text-xs font-black shadow-lg">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    
                    <button 
                      onClick={() => removeObservation(obs.id)} 
                      className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-xl"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    
                    <div className="flex gap-6">
                      <div className="w-32 h-32 bg-white border border-slate-100 rounded-3xl overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner group/photo relative">
                        {obs.photoUrl ? (
                          <>
                            <img src={obs.photoUrl} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                               <button 
                                 onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    input.onchange = (e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0];
                                        if(file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => updateObservation(obs.id, { photoUrl: event.target?.result as string });
                                            reader.readAsDataURL(file);
                                        }
                                    };
                                    input.click();
                                 }}
                                 className="text-white bg-white/10 backdrop-blur-md p-2 rounded-lg"
                               >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                               </button>
                            </div>
                          </>
                        ) : (
                          <button 
                            onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = async (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if(file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => updateObservation(obs.id, { photoUrl: event.target?.result as string });
                                        reader.readAsDataURL(file);
                                    }
                                };
                                input.click();
                            }}
                            className="text-slate-300 hover:text-[#50C878] flex flex-col items-center gap-2"
                          >
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </button>
                        )}
                      </div>

                      <div className="flex-1 space-y-4">
                        <textarea 
                          value={obs.description} 
                          onChange={(e) => updateObservation(obs.id, { description: e.target.value })}
                          placeholder="Technical description of findings..."
                          className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-4 focus:ring-[#50C878]/5 focus:border-[#50C878] font-medium min-h-[128px] resize-none leading-relaxed transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div 
          ref={previewContainerRef}
          className={`flex-1 overflow-y-auto bg-slate-200 p-12 md:p-20 ${activeTab === 'edit' ? 'hidden md:block' : 'block'}`}
        >
          <div 
            className="origin-top transition-all duration-700 ease-in-out"
            style={{ 
              transform: `scale(${previewScale})`,
              width: '1120px',
              marginLeft: 'auto',
              marginRight: 'auto',
              filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.12))'
            }}
          >
             <InspectionReport data={data} id="report-content" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
