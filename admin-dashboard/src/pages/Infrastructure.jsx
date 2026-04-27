import React from 'react';
import { Search, Server, Activity, ArrowUpRight, ArrowDownRight, AlignLeft, Globe, Database, AlertCircle, AlertTriangle, ShieldCheck, Bell, Zap } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

export default function Infrastructure() {
  const chartData = [
    { time: '00:00', value: 40 }, { time: '04:00', value: 60 }, { time: '08:00', value: 30 },
    { time: '12:00', value: 50 }, { time: '16:00', value: 80 }, { time: '20:00', value: 45 }
  ];

  const alerts = [
    { type: 'CRITICAL', color: '#ef4444', time: '2m ago', title: 'Auth-Service Timeout', text: 'Cluster Beta experiencing 15% packet loss on API gateway ingress.' },
    { type: 'WARNING', color: '#f5a623', time: '14m ago', title: 'Storage Threshold', text: "Volume 'CDN-Assets-04' reached 88% capacity. Auto-scaling pending." },
    { type: 'SYSTEM', color: '#7eabfc', time: '1h ago', title: 'Deployment Success', text: "AI Model 'Omen-v4.2' successfully pushed to all 3 clusters." },
    { type: 'AUDIT', color: '#10b981', time: '3h ago', title: 'Backup Verified', text: 'Weekly state snapshot verified and encrypted in AP-South region.' }
  ];

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>System Infrastructure</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Real-time monitoring across global node clusters and AI endpoints.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '8px 16px', borderRadius: '20px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: '#10b981' }}></div>
          <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px' }}>ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px' }}>
        
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Traffic Chart */}
          <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Activity size={20} color="#7eabfc" />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Global Traffic Flow</h3>
              </div>
              <div style={{ display: 'flex', gap: '32px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>PEAK TRAFFIC</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7eabfc' }}>1.2 TB/s</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>CURRENT LOAD</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>842 GB/s</div>
                </div>
              </div>
            </div>

            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#131720', border: '1px solid #293040' }}/>
                  <Line type="basis" dataKey="value" stroke="#7eabfc" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Clusters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
             
             <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                   <div style={{ width: '40px', height: '40px', backgroundColor: '#293040', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Server size={18} color="#7eabfc" />
                   </div>
                   <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' }}>US-EAST</div>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>Cluster Alpha</h3>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '32px' }}>Primary Academic Compute</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                   <div style={{ fontSize: '12px', color: '#94a3b8' }}>Uptime</div>
                   <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>99.9%</div>
                </div>
                <div style={{ height: '4px', backgroundColor: '#293040', borderRadius: '2px' }}><div style={{ height: '100%', width: '99.9%', backgroundColor: '#7eabfc', borderRadius: '2px' }}></div></div>
             </div>

             <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                   <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(245,166,35,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Database size={18} color="#f5a623" />
                   </div>
                   <div style={{ backgroundColor: 'rgba(245,166,35,0.1)', color: '#f5a623', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' }}>EU-WEST</div>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>Cluster Beta</h3>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '32px' }}>High-Density Inference</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                   <div style={{ fontSize: '12px', color: '#94a3b8' }}>Load Level</div>
                   <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5a623' }}>94.1%</div>
                </div>
                <div style={{ height: '4px', backgroundColor: '#293040', borderRadius: '2px' }}><div style={{ height: '100%', width: '94.1%', backgroundColor: '#f5a623', borderRadius: '2px' }}></div></div>
             </div>

             <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                   <div style={{ width: '40px', height: '40px', backgroundColor: '#293040', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Globe size={18} color="#94a3b8" />
                   </div>
                   <div style={{ color: '#94a3b8', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' }}>AP-SOUTH</div>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>Cluster Gamma</h3>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '32px' }}>Failover & Edge Storage</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                   <div style={{ fontSize: '12px', color: '#94a3b8' }}>Activity</div>
                   <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>Idle</div>
                </div>
                <div style={{ height: '4px', backgroundColor: '#293040', borderRadius: '2px' }}><div style={{ height: '100%', width: '0%', backgroundColor: '#7eabfc', borderRadius: '2px' }}></div></div>
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
             
             {/* Latency Map */}
             <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <Zap size={16} color="#fff" />
                     <h3 style={{ fontSize: '14px', fontWeight: 'bold' }}>AI Engine Latency</h3>
                   </div>
                   <span style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '0.5px' }}>LAST 24H</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '6px', marginBottom: '16px' }}>
                   {[...Array(30)].map((_, i) => (
                      <div key={i} style={{ aspectRatio: '1', backgroundColor: Math.random() > 0.8 ? '#fcd34d' : Math.random() > 0.6 ? '#60a5fa' : '#334155', borderRadius: '3px', opacity: 0.8 }}></div>
                   ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>
                   <span>LOWER LATENCY (40ms)</span>
                   <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#334155', borderRadius: '2px' }}></div>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#60a5fa', borderRadius: '2px' }}></div>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#fcd34d', borderRadius: '2px' }}></div>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#f5a623', borderRadius: '2px' }}></div>
                   </div>
                   <span>PEAK LOAD (180ms)</span>
                </div>
             </div>

             {/* Error Rate */}
             <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <AlertTriangle size={16} color="#ef4444" />
                     <h3 style={{ fontSize: '14px', fontWeight: 'bold' }}>Error Frequency</h3>
                   </div>
                   <span style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '0.5px' }}>HTTP 4XX/5XX</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '60px', marginBottom: '24px' }}>
                   {[10, 20, 15, 60, 25, 10, 10, 5, 20].map((v, i) => (
                      <div key={i} style={{ flex: 1, backgroundColor: v > 40 ? '#ef4444' : '#293040', height: `${v}%`, borderRadius: '2px' }}></div>
                   ))}
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                   <div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '4px' }}>AVERAGE RATE</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                         <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>0.02%</span>
                         <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>↓ 12%</span>
                      </div>
                   </div>
                   <a href="#" style={{ color: '#94a3b8', fontSize: '12px', textDecoration: 'none', fontWeight: '600' }}>View Logs</a>
                </div>
             </div>

          </div>

        </div>

        {/* Right Sidebar Alerts */}
        <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
             <div style={{ position: 'relative' }}>
                <Bell size={20} color="#f5a623" />
                <div style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '4px' }}></div>
             </div>
             <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>System Alerts</h3>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              {alerts.map((a, i) => (
                 <div key={i} style={{ backgroundColor: '#131720', border: '1px solid #293040', borderRadius: '16px', padding: '16px', borderLeft: `4px solid ${a.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                       <span style={{ fontSize: '9px', fontWeight: 'bold', color: a.color, letterSpacing: '1px' }}>{a.type}</span>
                       <span style={{ fontSize: '10px', color: '#94a3b8' }}>{a.time}</span>
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>{a.title}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.5' }}>{a.text}</p>
                 </div>
              ))}
           </div>

           <button style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid #293040', color: '#94a3b8', padding: '14px', borderRadius: '16px', fontWeight: 'bold', marginTop: '24px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
              View All Activity Log
           </button>
        </div>

      </div>
    </div>
  );
}
