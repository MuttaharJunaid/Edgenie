import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';
import { adminAIStatsService } from '../api/client';

export default function AiAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAIStatsService.get()
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  const kpis = [
    { label: 'GLOBAL ACCURACY', value: stats?.accuracy || '98.4%', perc: '↑ 1.2%', color: '#10b981' },
    { label: 'AVG. LATENCY', value: stats?.latency || '240ms', perc: '↓ 12ms', color: '#10b981' },
    { label: 'HALLUCINATION RATE', value: stats?.hallucination_rate || '0.12%', perc: '↑ 0.01%', color: '#ef4444' },
    { label: 'TOKENS / SEC', value: stats?.tokens_per_sec || '14.2k', perc: 'STABLE', color: '#94a3b8' }
  ];

  const accuracyData = [
    { name: 'APR 01', ai: 96, avg: 92 }, { name: 'APR 08', ai: 97, avg: 92 },
    { name: 'APR 15', ai: 99, avg: 91 }, { name: 'APR 22', ai: 97, avg: 90 },
    { name: 'APR 30', ai: 98.4, avg: 92 }
  ];

  const subjects = stats?.subjects || [
    { name: 'Maths', val: 99.1, color: '#7eabfc' },
    { name: 'Biology', val: 97.8, color: '#10b981' },
    { name: 'Physics', val: 98.5, color: '#c084fc' },
    { name: 'Chemistry', val: 96.2, color: '#f5a623' }
  ];

  const models = stats?.models || [
    { v: 'v2.4.0-stable', date: 'Apr 12, 2024', acc: '98.42%', stat: 'Active', statColor: '#10b981' },
    { v: 'v2.3.8-patch', date: 'Mar 28, 2024', acc: '97.91%', stat: 'Archived', statColor: '#94a3b8' },
    { v: 'v2.5.0-beta', date: 'In Training', acc: '98.15%*', stat: 'Testing', statColor: '#7eabfc' }
  ];

  const anomalous = stats?.anomalous || [
    { type: 'LOGIC ERROR', time: '2m ago', color: '#f5a623', text: '"Explain why the square root of -1 is a real number in Newtonian..."', subj: 'Advanced Physics' },
    { type: 'LATENCY SPIKE', time: '14m ago', color: '#f5a623', text: '"Provide a 10,000 word summary of the Cretaceous extinction event..."', subj: 'Biology' },
    { type: 'HALLUCINATION', time: '42m ago', color: '#ef4444', text: '"Who was the prime minister of the Roman Republic in 44BC?"', subj: 'History' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>AI Engine Analytics</h1>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8' }}>
          CURRENT MODEL <span style={{ color: '#fff' }}>{stats?.current_model || 'v2.4 (Production)'}</span>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '24px' }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '16px' }}>{k.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: '11px', color: k.color, fontWeight: 'bold' }}>{k.perc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Trend */}
        <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>Accuracy Trend</h3>
              <p style={{ color: '#94a3b8', fontSize: '12px' }}>Model performance over the last 30 days</p>
            </div>
            <div style={{ display: 'flex', backgroundColor: '#131720', borderRadius: '16px', padding: '4px' }}>
              <button style={{ backgroundColor: 'transparent', color: '#94a3b8', border: 'none', padding: '6px 16px', borderRadius: '12px', fontSize: '11px', cursor: 'pointer' }}>7D</button>
              <button style={{ backgroundColor: '#293040', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '12px', fontSize: '11px', cursor: 'pointer' }}>30D</button>
              <button style={{ backgroundColor: 'transparent', color: '#94a3b8', border: 'none', padding: '6px 16px', borderRadius: '12px', fontSize: '11px', cursor: 'pointer' }}>90D</button>
            </div>
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <Tooltip contentStyle={{ backgroundColor: '#131720', border: '1px solid #293040' }}/>
                <Line type="natural" dataKey="ai" stroke="#10b981" strokeWidth={3} dot={false} />
                <Line type="natural" dataKey="avg" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* subjects */}
        <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '32px' }}>Subject Breakdown</h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center' }}>
            {subjects.map((s, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: s.color }}></div>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{s.val}%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#293040', borderRadius: '3px' }}>
                  <div style={{ height: '100%', width: `${s.val}%`, backgroundColor: s.color, borderRadius: '3px' }}></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#94a3b8', fontStyle: 'italic', marginTop: '24px' }}>CALCULATED OVER 1.2M QUERIES</div>
        </div>
      </div>

      {/* Row 3 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        {/* Heatmap */}
        <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>Latency Heatmap</h3>
          <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '24px' }}>Regional response times for Topical Search</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px', marginBottom: '24px' }}>
            {[...Array(24)].map((_, i) => (
              <div key={i} style={{ aspectRatio: '1', borderRadius: '4px', backgroundColor: Math.random() > 0.8 ? '#f5a623' : Math.random() > 0.6 ? '#6ee7b7' : '#10b981', opacity: Math.random() * 0.5 + 0.5 }}></div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>
            <span>FAST (&lt;100MS)</span>
            <div style={{ display: 'flex', gap: '4px' }}>
               <div style={{ width: '12px', height: '8px', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
               <div style={{ width: '12px', height: '8px', backgroundColor: '#6ee7b7', borderRadius: '2px' }}></div>
               <div style={{ width: '12px', height: '8px', backgroundColor: '#fcd34d', borderRadius: '2px' }}></div>
               <div style={{ width: '12px', height: '8px', backgroundColor: '#f5a623', borderRadius: '2px' }}></div>
            </div>
            <span>CONGESTED</span>
          </div>
        </div>

        {/* History */}
        <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>Model Version History</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ color: '#94a3b8', textAlign: 'left' }}>
                <th style={{ paddingBottom: '16px', fontWeight: '500' }}>VERSION</th>
                <th style={{ paddingBottom: '16px', fontWeight: '500' }}>DEPLOYMENT</th>
                <th style={{ paddingBottom: '16px', fontWeight: '500' }}>CORE ACCURACY</th>
                <th style={{ paddingBottom: '16px', fontWeight: '500' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m, i) => (
                <tr key={i} style={{ borderBottom: i !== models.length-1 ? '1px solid #293040' : 'none' }}>
                  <td style={{ padding: '16px 0', fontWeight: '600', color: '#fff' }}>{m.v}</td>
                  <td style={{ padding: '16px 0', color: '#94a3b8' }}>{m.date}</td>
                  <td style={{ padding: '16px 0', color: '#fff' }}>{m.acc}</td>
                  <td style={{ padding: '16px 0' }}>
                    <span style={{ border: `1px solid ${m.statColor}`, color: m.statColor, padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>{m.stat}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anomalous */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Anomalous Submissions</h3>
        <a href="#" style={{ color: '#fff', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>View All Reports <Activity size={14} /></a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {anomalous.map((a, i) => (
          <div key={i} style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '16px', padding: '24px', borderTop: `4px solid ${a.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px' }}>{a.type}</span>
              <span style={{ color: '#94a3b8', fontSize: '11px' }}>{a.time}</span>
            </div>
            <p style={{ fontSize: '15px', color: '#e2e8f0', fontStyle: 'italic', marginBottom: '24px', lineHeight: '1.5', minHeight: '45px' }}>{a.text}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ color: '#94a3b8', fontSize: '12px' }}>Subject: <span style={{ color: '#10b981' }}>{a.subj}</span></span>
               <Activity size={16} color="#94a3b8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
