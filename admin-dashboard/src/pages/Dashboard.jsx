import React, { useState, useEffect } from 'react';
import { GraduationCap, Brain, HelpCircle, DollarSign, ExternalLink } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';
import { adminDashboardService } from '../api/client';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    adminDashboardService.getStats()
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  const kpis = [
    { label: 'ACTIVE STUDENTS', value: data?.total_users || '0', perc: '+12%', icon: <GraduationCap size={16} color="#7eabfc" />, iconBg: 'rgba(126, 171, 252, 0.1)', diffColor: '#10b981' },
    { label: 'AI ACCURACY', value: data?.global_accuracy ? `${data.global_accuracy}%` : '0%', perc: '+0.4%', icon: <Brain size={16} color="#c084fc" />, iconBg: 'rgba(192, 132, 252, 0.1)', diffColor: '#10b981' },
    { label: 'QUESTIONS CLASSIFIED', value: data?.total_questions || '0', perc: '+12 today', icon: <HelpCircle size={16} color="#f5a623" />, iconBg: 'rgba(245, 166, 35, 0.1)', diffColor: '#94a3b8' },
    { label: 'REVENUE (MRR)', value: '$0', perc: '+0%', icon: <DollarSign size={16} color="#10b981" />, iconBg: 'rgba(16, 185, 129, 0.1)', diffColor: '#10b981' }
  ];

  const chartData = [
    { time: '08:00', value: 45 }, { time: '', value: 30 }, { time: '', value: 35 }, { time: '12:00', value: 20 },
    { time: '', value: 50 }, { time: '', value: 30 }, { time: '16:00', value: 25 }, { time: '', value: 40 },
    { time: '', value: 60 }, { time: '20:00', value: 30 }, { time: '', value: 48 }, { time: 'NOW', value: 0 }
  ];

  const scrapers = data?.active_scrapers || [];

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Engine Overview</h1>
      <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Real-time performance metrics and neural engine health across global education nodes.</p>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: k.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {k.icon}
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', color: k.diffColor, fontWeight: 'bold' }}>
                {k.perc}
              </div>
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '4px' }}>{k.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* System Health Graph */}
        <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>System Health</h3>
              <p style={{ color: '#94a3b8', fontSize: '12px' }}>Real-time latency and uptime performance</p>
            </div>
            <div style={{ display: 'flex', backgroundColor: '#131720', borderRadius: '8px', padding: '4px' }}>
              <button style={{ backgroundColor: '#293040', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Live</button>
              <button style={{ backgroundColor: 'transparent', color: '#94a3b8', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>24h</button>
            </div>
          </div>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7eabfc" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#7eabfc" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <Tooltip cursor={{ fill: '#293040' }} contentStyle={{ backgroundColor: '#131720', border: '1px solid #293040' }}/>
                <Bar dataKey="value" fill="url(#colorValue)" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="url(#colorValue)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth */}
        <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>User Growth</h3>
          <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '24px' }}>Conversion by source channel</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span>Organic Search</span>
                <span style={{ fontWeight: 'bold' }}>42%</span>
              </div>
              <div style={{ height: '4px', backgroundColor: '#293040', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: '42%', backgroundColor: '#7eabfc', borderRadius: '2px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span>Social Media</span>
                <span style={{ fontWeight: 'bold' }}>28%</span>
              </div>
              <div style={{ height: '4px', backgroundColor: '#293040', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: '28%', backgroundColor: '#c084fc', borderRadius: '2px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span>Referral Program</span>
                <span style={{ fontWeight: 'bold' }}>18%</span>
              </div>
              <div style={{ height: '4px', backgroundColor: '#293040', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: '18%', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span>Direct Traffic</span>
                <span style={{ fontWeight: 'bold' }}>12%</span>
              </div>
              <div style={{ height: '4px', backgroundColor: '#293040', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: '12%', backgroundColor: '#f5a623', borderRadius: '2px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Scraper Status */}
      <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Active Scraper Status</h3>
            <p style={{ color: '#94a3b8', fontSize: '12px' }}>Live feed of AI data ingestion nodes</p>
          </div>
          <a href="#" style={{ color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            View Network Map <ExternalLink size={14} />
          </a>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ color: '#94a3b8', borderBottom: '1px solid #293040' }}>
              <th style={{ paddingBottom: '16px', fontWeight: '600', letterSpacing: '0.5px' }}>NODE ID</th>
              <th style={{ paddingBottom: '16px', fontWeight: '600', letterSpacing: '0.5px' }}>REGION</th>
              <th style={{ paddingBottom: '16px', fontWeight: '600', letterSpacing: '0.5px' }}>TASK DENSITY</th>
              <th style={{ paddingBottom: '16px', fontWeight: '600', letterSpacing: '0.5px' }}>STATUS</th>
              <th style={{ paddingBottom: '16px', fontWeight: '600', letterSpacing: '0.5px', textAlign: 'right' }}>UPTIME</th>
            </tr>
          </thead>
          <tbody>
            {scrapers.map((s, idx) => {
              const statusColor = s.status === 'ONLINE' ? '#10b981' : s.status === 'BUSY' ? '#f5a623' : '#94a3b8';
              return (
              <tr key={idx} style={{ borderBottom: idx !== scrapers.length - 1 ? '1px solid #293040' : 'none' }}>
                <td style={{ padding: '16px 0', fontWeight: '500' }}>{s.source || s.id}</td>
                <td style={{ padding: '16px 0', color: '#94a3b8' }}>{s.region || 'US-EAST-1'}</td>
                <td style={{ padding: '16px 0' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1,2,3,4].map(bar => (
                      <div key={bar} style={{ width: '6px', height: '16px', borderRadius: '2px', backgroundColor: bar <= (s.density || 3) ? statusColor : '#293040' }}></div>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '16px 0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', color: statusColor }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '3px', backgroundColor: statusColor }}></div>
                    {s.status === 'completed' ? 'ONLINE' : (s.status?.toUpperCase() || 'ONLINE')}
                  </div>
                </td>
                <td style={{ padding: '16px 0', textAlign: 'right', color: '#94a3b8' }}>{s.uptime || '99.98%'}</td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

    </div>
  );
}
