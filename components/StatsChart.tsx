import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Phishing', risk: 90, color: '#f87171' },
  { name: 'Ransomware', risk: 85, color: '#a78bfa' },
  { name: 'DoS', risk: 60, color: '#60a5fa' },
  { name: 'SQLi', risk: 75, color: '#fbbf24' },
  { name: 'MitM', risk: 50, color: '#34d399' },
];

export const StatsChart: React.FC = () => {
  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-[250px] flex flex-col">
      <h4 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Commonality & Impact Score</h4>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
              cursor={{fill: 'rgba(255,255,255,0.05)'}}
            />
            <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};