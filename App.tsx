import React, { useState, useEffect, useRef, Suspense } from 'react';
import { AttackID, Step, AttackCategory } from './types';
import { ATTACK_SCENARIOS } from './constants';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, ShieldCheck, AlertTriangle, Info, Home, Heart, Globe, Lock, Shield, Network, Users, Loader2 } from 'lucide-react';

// Error Boundary to catch lazy loading failures
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-900 rounded-xl border border-red-900/50">
          <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Simulation Module Error</h3>
          <p className="text-slate-400 mb-4 max-w-md">
            Failed to load the simulation component. This might be due to a network issue or an ad-blocker.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy load heavy components with explicit error handling
const SimulationCanvas = React.lazy(() => 
  import('./components/SimulationCanvas')
    .then(module => ({ default: module.SimulationCanvas }))
    .catch(err => {
      console.error("Failed to load SimulationCanvas", err);
      // Return a dummy component so the app doesn't crash immediately before ErrorBoundary catches it
      return { default: () => <div className="text-red-500 p-4 border border-red-500 rounded">Error loading canvas</div> };
    })
);

const QuizComponent = React.lazy(() => 
  import('./components/QuizComponent')
    .then(module => ({ default: module.QuizComponent }))
    .catch(err => {
      console.error("Failed to load QuizComponent", err);
      return { default: () => <div className="text-slate-500 italic">Quiz unavailable</div> };
    })
);

const StatsChart = React.lazy(() => 
  import('./components/StatsChart')
    .then(module => ({ default: module.StatsChart }))
    .catch(err => {
      console.error("Failed to load StatsChart", err);
      return { default: () => <div className="text-slate-500 italic">Stats unavailable</div> };
    })
);

type ViewMode = 'home' | 'simulation';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedAttackId, setSelectedAttackId] = useState<AttackID>(AttackID.PHISHING);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deepDiveText, setDeepDiveText] = useState<string>("");
  const timerRef = useRef<number | null>(null);

  const scenario = ATTACK_SCENARIOS[selectedAttackId];
  const currentStep: Step = scenario.steps[currentStepIndex];
  const totalSteps = scenario.steps.length;

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && viewMode === 'simulation') {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < totalSteps - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 3000); 
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, totalSteps, viewMode]);

  // Load AI Deep Dive when attack changes
  useEffect(() => {
    if (viewMode === 'simulation') {
      const fetchDeepDive = async () => {
        setDeepDiveText("Analyzing threat intelligence...");
        try {
          // Dynamic import to split @google/genai SDK from main bundle
          const { generateDeepDive } = await import('./services/geminiService');
          const text = await generateDeepDive(scenario.title);
          setDeepDiveText(text);
        } catch (error) {
          console.error("Failed to load deep dive", error);
          setDeepDiveText("Intelligence unavailable.");
        }
      };
      fetchDeepDive();
      setCurrentStepIndex(0);
      setIsPlaying(false);
    }
  }, [selectedAttackId, scenario.title, viewMode]);

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) setCurrentStepIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(prev => prev - 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const navigateToAttack = (id: AttackID) => {
    setSelectedAttackId(id);
    setViewMode('simulation');
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Group attacks by category
  const groupedAttacks = Object.values(ATTACK_SCENARIOS).reduce((acc, attack) => {
    if (!acc[attack.category]) acc[attack.category] = [];
    acc[attack.category].push(attack);
    return acc;
  }, {} as Record<AttackCategory, typeof ATTACK_SCENARIOS[AttackID][]>);

  const categoryIcons: Record<AttackCategory, React.ReactNode> = {
    'Network': <Network size={14} />,
    'Web': <Globe size={14} />,
    'Malware': <Lock size={14} />,
    'Social': <Users size={14} />,
    'General': <Shield size={14} />
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 z-30 shadow-2xl h-screen sticky top-0">
        <div className="p-6 border-b border-slate-800 bg-slate-950 cursor-pointer flex-shrink-0" onClick={() => setViewMode('home')}>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
               <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">CyberSim</h1>
              <p className="text-xs text-slate-500 font-medium">Visual Threat Learning</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <button
            onClick={() => setViewMode('home')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all border flex items-center gap-3 mb-4 ${
              viewMode === 'home'
                ? 'bg-slate-800 text-white border-slate-700'
                : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Home size={16} />
            Home Dashboard
          </button>
          
          {/* Render grouped categories */}
          {(Object.keys(groupedAttacks) as AttackCategory[]).map((category) => (
            <div key={category} className="mb-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 mb-2 flex items-center gap-2">
                {categoryIcons[category]}
                {category} Attacks
              </h3>
              <div className="space-y-0.5">
                {groupedAttacks[category].map((attack) => (
                  <button
                    key={attack.id}
                    onClick={() => navigateToAttack(attack.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all border-l-2 ml-1 ${
                      viewMode === 'simulation' && selectedAttackId === attack.id
                        ? 'bg-indigo-900/20 border-indigo-500 text-indigo-300'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
                  >
                    {attack.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex-shrink-0">
          <div className="text-xs text-slate-500 space-y-1">
            <p className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               System Operational
            </p>
            <p>Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0B1120]">
        
        {viewMode === 'home' ? (
          <div className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth flex flex-col items-center justify-center text-center">
            
            <div className="max-w-3xl w-full space-y-8 animate-fadeIn">
              
              {/* Hero Section */}
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-full mb-4">
                  <ShieldCheck size={64} className="text-indigo-500" />
                </div>
                <h1 className="text-5xl font-black tracking-tight text-white mb-4">
                  Welcome to CyberSim
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  An interactive, animated simulation platform that visualizes common cyber attacks 
                  to help users understand security vulnerabilities and defense mechanisms.
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-indigo-500/50 transition-colors group cursor-pointer" onClick={() => navigateToAttack(AttackID.MITM)}>
                  <Globe className="text-blue-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                  <h3 className="font-bold text-white mb-2">Network Attacks</h3>
                  <p className="text-sm text-slate-400">Visualize unseen traffic flows like MITM, DoS, and DNS Spoofing.</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-indigo-500/50 transition-colors group cursor-pointer" onClick={() => navigateToAttack(AttackID.RANSOMWARE)}>
                  <Lock className="text-red-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                  <h3 className="font-bold text-white mb-2">Exploits & Malware</h3>
                  <p className="text-sm text-slate-400">See how Ransomware spreads and how Zero-Day exploits breach defenses.</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-indigo-500/50 transition-colors group cursor-pointer" onClick={() => navigateToAttack(AttackID.CSRF)}>
                  <Shield className="text-emerald-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                  <h3 className="font-bold text-white mb-2">Web Vulnerabilities</h3>
                  <p className="text-sm text-slate-400">Understand complex logic bugs like CSRF, SSRF, IDOR and Broken Auth.</p>
                </div>
              </div>

              <button 
                onClick={() => navigateToAttack(AttackID.PHISHING)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-900/20 transition-all hover:scale-105"
              >
                Start Learning <ChevronRight />
              </button>

              {/* Author Footer */}
              <div className="pt-12 mt-12 border-t border-slate-800/50 text-slate-500">
                <div className="flex flex-col items-center gap-3">
                   <div className="flex items-center gap-2 text-sm font-medium">
                     <span>Author:</span>
                     <span className="text-indigo-400 font-bold">Purushotham Muktha</span>
                   </div>
                   <p className="flex items-center gap-2 text-xs opacity-70">
                     Built with <Heart size={12} className="text-pink-500 fill-pink-500 animate-pulse" /> to simplify cyberattacks and share knowledge with the global community.
                   </p>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <>
            {/* Header Area */}
            <header className="px-8 py-6 border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-md shrink-0 flex items-center justify-between z-20">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {scenario.category}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">{scenario.title}</h2>
                <p className="text-slate-400 mt-1 text-sm font-medium">{scenario.shortDescription}</p>
              </div>
              <div className="hidden lg:flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-full border border-indigo-500/20 shadow-lg">
                <Info size={18} className="text-indigo-400" />
                <span className="text-xs text-slate-200 italic max-w-sm">
                  {deepDiveText}
                </span>
              </div>
            </header>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
              <ErrorBoundary>
                <Suspense fallback={
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                    <Loader2 className="animate-spin w-12 h-12 text-indigo-500" />
                    <p className="animate-pulse font-mono text-sm">LOADING MODULES...</p>
                  </div>
                }>
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-[1600px] mx-auto">
                    
                    {/* Simulation Column */}
                    <div className="xl:col-span-8 space-y-6">
                      
                      {/* Visual Stage Container */}
                      <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-2 shadow-2xl">
                        <div className="bg-slate-950 rounded-xl overflow-hidden relative">
                            <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur px-3 py-1 rounded border border-slate-700 text-xs font-mono text-slate-400">
                              LIVE SIMULATION // {scenario.id}
                            </div>
                            <SimulationCanvas 
                              actors={scenario.actors} 
                              currentStep={currentStep} 
                              layout={scenario.layout}
                              actorNames={scenario.actorNames}
                            />
                        </div>
                      </div>
                      
                      {/* Controls & Progress */}
                      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg flex flex-col sm:flex-row items-center gap-6">
                        <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-700/50">
                          <button 
                            onClick={handleReset}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                            title="Reset"
                          >
                            <RotateCcw size={18} />
                          </button>
                          <div className="h-6 w-px bg-slate-700 mx-1"></div>
                          <button 
                            onClick={handlePrev}
                            disabled={currentStepIndex === 0}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors disabled:opacity-30"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="flex items-center justify-center w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-900/30 transition-all active:scale-95"
                          >
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                          </button>
                          <button 
                            onClick={handleNext}
                            disabled={currentStepIndex === totalSteps - 1}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors disabled:opacity-30"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                        
                        <div className="flex-1 w-full space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-white">Step {currentStepIndex + 1}</span>
                            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Simulation Progress</span>
                          </div>
                          <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-500 ease-out relative"
                              style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
                            >
                              <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_10px_white]"></div>
                            </div>
                          </div>
                          <p className="text-sm text-slate-300 pt-1">{currentStep.description}</p>
                        </div>
                      </div>

                      {/* Defense Strategies (Moved Here) */}
                      <div className="bg-slate-800/80 rounded-xl p-6 border border-slate-700 backdrop-blur-sm shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2 border-b border-slate-700 pb-3">
                          <AlertTriangle className="text-amber-500" />
                          Defense Strategies & Prevention
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {scenario.prevention.map((tip, idx) => (
                            <li key={idx} className="flex gap-4 group p-3 rounded-lg bg-slate-900/30 hover:bg-slate-900/60 transition-colors border border-transparent hover:border-slate-700">
                              <div className="min-w-6 h-6 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold group-hover:bg-emerald-500 group-hover:text-white transition-colors mt-0.5">
                                {idx + 1}
                              </div>
                              <span className="text-sm text-slate-300 leading-snug group-hover:text-white transition-colors">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Quiz Section */}
                      <QuizComponent topic={scenario.title} />

                    </div>

                    {/* Info Column */}
                    <div className="xl:col-span-4 space-y-6">
                      
                      {/* Context Card */}
                      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-6 border border-indigo-500/30 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <ShieldCheck size={100} />
                        </div>
                        <h4 className="font-bold text-indigo-200 mb-2 relative z-10">Key Takeaway</h4>
                        <p className="text-sm text-indigo-200/80 leading-relaxed relative z-10">
                          Understanding the flow of data packets between actors is crucial for identifying interception points or injection vectors.
                        </p>
                      </div>

                      {/* Stats Visual */}
                      <StatsChart />

                    </div>
                  </div>
                </Suspense>
              </ErrorBoundary>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;