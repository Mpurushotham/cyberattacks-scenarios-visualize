import React, { useState, useEffect, useCallback } from 'react';
import { ACTOR_ICONS } from '../constants';
import { ActorType, Step, ScenarioLayout, Packet, ConnectionLine } from '../types';
import { Bug, Key, FileText, Globe, ShieldAlert, Zap, Lock, Database, MousePointerClick } from 'lucide-react';

interface SimulationCanvasProps {
  actors: ActorType[];
  currentStep: Step;
  layout: ScenarioLayout;
  actorNames?: Partial<Record<ActorType, string>>;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ actors, currentStep, layout, actorNames }) => {
  const [manualTriggerCount, setManualTriggerCount] = useState(0);
  const [lastClickedActor, setLastClickedActor] = useState<ActorType | null>(null);
  const [clickRippleKey, setClickRippleKey] = useState(0);

  // Reset manual triggers when step changes
  useEffect(() => {
    setManualTriggerCount(0);
    setLastClickedActor(null);
  }, [currentStep.id]);

  // Identify the actor that can initiate an action in this step
  const interactiveActor = currentStep.activePacket?.from;
  
  // Helper to check if actor is part of this scenario
  const isActorVisible = (actor: ActorType) => actors.includes(actor);

  // Helper to get numeric coordinates from percentage strings for SVG lines
  const getCoords = (type: ActorType) => {
    const pos = layout.positions[type];
    if (!pos) return { x: 0, y: 0 };
    return {
      x: parseFloat(pos.left),
      y: parseFloat(pos.top)
    };
  };

  // Helper to check if a connection matches the current packet's path
  const isConnectionActive = (conn: ConnectionLine, packet?: Packet) => {
    if (!packet) return false;
    return conn.from === packet.from && conn.to === packet.to;
  };

  const getPacketColorHex = (colorClass?: string) => {
    if (colorClass?.includes('red')) return '#ef4444';
    if (colorClass?.includes('blue')) return '#3b82f6';
    if (colorClass?.includes('green')) return '#10b981';
    if (colorClass?.includes('purple')) return '#a855f7';
    if (colorClass?.includes('yellow')) return '#eab308';
    return '#94a3b8'; // slate-400
  };

  const handleActorClick = (actor: ActorType) => {
    if (actor === interactiveActor) {
      setManualTriggerCount(prev => prev + 1);
      setLastClickedActor(actor);
      setClickRippleKey(prev => prev + 1);
    }
  };

  return (
    <div className="relative w-full h-[500px] bg-slate-900 rounded-xl border-2 border-slate-700 shadow-2xl overflow-hidden selection:bg-none">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* SVG Connection Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
          </marker>
          <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff" />
          </marker>
        </defs>
        {layout.connections.map((conn, idx) => {
          if (!isActorVisible(conn.from) || !isActorVisible(conn.to)) return null;
          const start = getCoords(conn.from);
          const end = getCoords(conn.to);
          const isActive = isConnectionActive(conn, currentStep.activePacket);
          const activeColor = isActive ? getPacketColorHex(currentStep.activePacket?.color) : '#475569';

          // Randomize flow speed slightly for realistic effect
          const flowDuration = isActive ? `${0.8 + (idx % 3) * 0.2}s` : '1s';

          return (
            <g key={idx}>
              {/* Base Line */}
              <line 
                x1={`${start.x}%`} 
                y1={`${start.y}%`} 
                x2={`${end.x}%`} 
                y2={`${end.y}%`} 
                className={`transition-colors duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}
                stroke={isActive ? activeColor : "#475569"}
                strokeWidth={isActive ? "3" : "2"}
                strokeDasharray={conn.type === 'dashed' ? "5,5" : "0"}
                markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
              />
              
              {/* Animated Flow Line (Only if active) */}
              {isActive && (
                <line 
                  x1={`${start.x}%`} 
                  y1={`${start.y}%`} 
                  x2={`${end.x}%`} 
                  y2={`${end.y}%`} 
                  stroke={activeColor}
                  strokeWidth="4"
                  strokeDasharray="10,10"
                  className="animate-flow opacity-60 mix-blend-screen"
                  strokeLinecap="round"
                  style={{ animationDuration: flowDuration }}
                />
              )}

              {conn.label && (
                <text 
                  x={`${(start.x + end.x) / 2}%`} 
                  y={`${(start.y + end.y) / 2 - 2}%`} 
                  textAnchor="middle" 
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 ${isActive ? 'fill-white' : 'fill-slate-500'}`}
                >
                  {conn.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Render Actors */}
      {actors.map((type) => {
        const pos = layout.positions[type];
        if (!pos) return null;

        const Icon = ACTOR_ICONS[type];
        const state = currentStep.actorStates[type];
        const isInteractive = type === interactiveActor;
        
        // Base visual configuration
        let ringColor = 'ring-slate-500';
        let bgColor = 'bg-slate-800';
        let iconColor = 'text-slate-300';
        let activeClass = ''; 

        if (state?.status === 'infected') {
          ringColor = 'ring-purple-500';
          bgColor = 'bg-slate-900';
          iconColor = 'text-purple-400';
          activeClass = 'animate-pulse'; 
        } else if (state?.status === 'compromised') {
          ringColor = 'ring-red-500';
          bgColor = 'bg-red-950';
          iconColor = 'text-red-400';
          activeClass = 'animate-pulse';
        } else if (state?.status === 'active') { 
          ringColor = 'ring-red-500';
          iconColor = 'text-red-500';
          activeClass = 'animate-active-breathe'; 
        } else if (state?.status === 'offline') {
          ringColor = 'ring-gray-700';
          iconColor = 'text-gray-600';
          bgColor = 'bg-black/50';
        }

        // Interactive Highlight Override
        if (isInteractive) {
           // If it's the sender, make it look actionable
           if (state?.status !== 'compromised' && state?.status !== 'infected') {
              activeClass = 'animate-pulse ring-offset-2 ring-offset-slate-900';
              ringColor = 'ring-indigo-500';
           }
        }

        return (
          <div 
            key={type}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 group ${isInteractive ? 'cursor-pointer' : 'cursor-default'}`}
            style={{ top: pos.top, left: pos.left }}
            onClick={() => handleActorClick(type)}
          >
            {/* Status Pulse for Active/Infected */}
            {(state?.status === 'infected' || state?.status === 'compromised') && (
               <div className={`absolute inset-0 rounded-xl ${ringColor.replace('ring', 'bg')} opacity-20 animate-ping`}></div>
            )}

            {/* Interactive Ripple Effect on Click */}
            {lastClickedActor === type && (
               <div key={clickRippleKey} className={`absolute inset-0 rounded-xl border-indigo-400 animate-ripple pointer-events-none z-0`}></div>
            )}

            {/* Interaction Hint */}
            {isInteractive && (
              <div className="absolute -top-8 animate-bounce opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                 <div className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                   <MousePointerClick size={12} />
                   <span>Click to Trigger</span>
                 </div>
                 <div className="w-2 h-2 bg-indigo-600 transform rotate-45 mx-auto -mt-1"></div>
              </div>
            )}

            {/* Main Actor Card with Hover Effect */}
            <div className={`relative p-4 rounded-xl ${bgColor} ring-2 ${ringColor} ${activeClass} hover-animate-scale transition-colors duration-300`}>
               {/* Connection Points (Purely visual) */}
               <div className="absolute -left-1 top-1/2 w-2 h-2 bg-slate-600 rounded-full transform -translate-y-1/2 group-hover:bg-slate-400 transition-colors" />
               <div className="absolute -right-1 top-1/2 w-2 h-2 bg-slate-600 rounded-full transform -translate-y-1/2 group-hover:bg-slate-400 transition-colors" />
               <div className="absolute left-1/2 -top-1 w-2 h-2 bg-slate-600 rounded-full transform -translate-x-1/2 group-hover:bg-slate-400 transition-colors" />
               <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-slate-600 rounded-full transform -translate-x-1/2 group-hover:bg-slate-400 transition-colors" />

               {/* Status Dot */}
               <div className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 z-10 flex items-center justify-center ${
                 state?.status === 'normal' ? 'bg-emerald-500' : 
                 state?.status === 'offline' ? 'bg-gray-600' : 'bg-red-500'
               }`}>
                 {state?.status === 'active' && <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />}
               </div>
               
              <Icon size={42} className={`${iconColor} transition-colors duration-300 group-hover:text-white`} strokeWidth={1.5} />
            </div>
            
            {/* Actor Label */}
            <div className="mt-4 flex flex-col items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 bg-slate-900/90 px-3 py-1 rounded-md border border-slate-800 shadow-xl backdrop-blur-sm group-hover:text-white group-hover:border-slate-600 transition-all whitespace-nowrap">
                {actorNames?.[type] || type}
              </span>
              
              {state?.label && (
                <div className="animate-bounce mt-1">
                  <span className={`text-[10px] font-bold text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border border-white/10 ${
                    state.status === 'normal' ? 'bg-emerald-600' : 'bg-red-600'
                  }`}>
                    {state.label}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Render Packet */}
      {currentStep.activePacket && (
        <PacketAnimation 
          key={`${currentStep.activePacket.id}-${currentStep.id}-${manualTriggerCount}`}
          packet={currentStep.activePacket} 
          positions={layout.positions} 
          isManualTrigger={manualTriggerCount > 0}
        />
      )}
    </div>
  );
};

// Map Packet types to Icons
const getPacketIcon = (type: string) => {
  switch (type) {
    case 'malware': return Bug;
    case 'key': return Key;
    case 'request': return Globe;
    case 'data': return FileText;
    case 'response': return Database;
    default: return Zap;
  }
}

const PacketAnimation: React.FC<{ packet: Packet; positions: any; isManualTrigger?: boolean }> = ({ packet, positions, isManualTrigger }) => {
  const start = positions[packet.from];
  const end = positions[packet.to];
  const PacketIcon = getPacketIcon(packet.type);

  // Generate randomized latency parameters for realistic feel
  const { duration, delay, jitterX, jitterY } = React.useMemo(() => {
    // If manually triggered, we want instant feedback, so reduce delay significantly
    const baseDelay = isManualTrigger ? 0.05 : Math.random() * 0.5;
    return {
      duration: 2.5 + Math.random() * 0.8, 
      delay: baseDelay,          
      jitterX: (Math.random() - 0.5) * 4,  
      jitterY: (Math.random() - 0.5) * 4   
    };
  }, [packet.id, isManualTrigger]);

  if (!start || !end) return null;

  // Refined styling for packet labels: Subtle background with distinct border
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'malware': return 'bg-red-900/80 text-red-100 border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.2)]';
      case 'data': return 'bg-amber-900/80 text-amber-100 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      case 'request': return 'bg-blue-900/80 text-blue-100 border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.2)]';
      case 'response': return 'bg-emerald-900/80 text-emerald-100 border-emerald-500 shadow-[0_0_10px_rgba(5,150,105,0.2)]';
      case 'key': return 'bg-purple-900/80 text-purple-100 border-purple-500 shadow-[0_0_10px_rgba(147,51,234,0.2)]';
      default: return 'bg-slate-800/80 text-slate-100 border-slate-500';
    }
  };

  return (
    <div
      className="absolute z-50 flex flex-col items-center justify-center pointer-events-none"
      style={{
        top: start.top,
        left: start.left,
        animation: `movePacket ${duration}s cubic-bezier(0.45, 0, 0.55, 1) both ${delay}s` 
      }}
    >
      <style>
        {`
          @keyframes movePacket {
            0% { top: ${start.top}; left: ${start.left}; opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            10% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { top: ${end.top}; left: ${end.left}; opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          }
          @keyframes jitter {
            0%, 100% { transform: translate(0,0); }
            25% { transform: translate(${jitterX}px, ${jitterY}px); }
            75% { transform: translate(${-jitterX}px, ${-jitterY}px); }
          }
        `}
      </style>
      
      {/* Packet Visual with Jitter Effect */}
      <div className="relative group flex flex-col items-center" style={{ animation: `jitter 0.2s linear infinite` }}>
        
        {/* Type Label (Floating Above) - Updated Styling */}
        <div className={`absolute -top-9 mb-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border backdrop-blur-sm transition-all z-20 whitespace-nowrap ${getTypeStyles(packet.type)}`}>
          {packet.type}
        </div>

        {/* Glowing Trail Effect */}
        <div className={`absolute inset-0 rounded-full opacity-50 blur-md ${packet.color || 'bg-blue-500'} animate-pulse`} />
        
        {/* Core Packet */}
        <div className={`relative w-10 h-10 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center ${packet.color || 'bg-blue-600'} border border-white/20 z-10`}>
           <PacketIcon size={20} className="text-white drop-shadow-md" />
           {/* Data bits particle effect */}
           <div className="absolute -inset-1 border border-white/30 rounded-xl animate-pulse-ring" />
        </div>

        {/* Packet Details Card (Tooltip style that moves with it) */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-32 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg p-2 shadow-2xl flex flex-col gap-1 items-center z-20">
            <div className="w-2 h-2 bg-slate-900 border-l border-t border-slate-700 transform rotate-45 absolute -top-1.5 left-1/2 -ml-1"></div>
            <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">
              Payload Content
            </span>
            <div className="w-full h-px bg-slate-800"></div>
            <span className="text-xs font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-1">
              {packet.label || 'Data Packet'}
            </span>
            <div className="flex gap-0.5 mt-1">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className={`w-1 h-1 rounded-full ${i%2===0 ? 'bg-emerald-500' : 'bg-slate-600'} animate-pulse`} style={{animationDelay: `${i*0.1}s`}} />
               ))}
            </div>
            {/* Visual latency indicator (only if not manually triggered) */}
            {!isManualTrigger && delay > 0.3 && (
              <span className="text-[8px] text-red-400 font-mono mt-1 animate-pulse">LATENCY DETECTED</span>
            )}
            {isManualTrigger && (
               <span className="text-[8px] text-indigo-400 font-mono mt-1">MANUAL TRIGGER</span>
            )}
        </div>
      </div>
    </div>
  );
};
