import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Rocket } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from 'recharts';
import { adminSettingsService } from '../api/client';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [activeModel, setActiveModel] = useState('gpt');
  const [confidenceThreshold, setConfidenceThreshold] = useState(88);
  const [autoApprove, setAutoApprove] = useState(true);
  const [scraperInterval, setScraperInterval] = useState('6h');

  useEffect(() => {
    adminSettingsService.get()
      .then(res => {
        const data = res.data;
        if(data.model) setActiveModel(data.model);
        if(data.confidence_threshold) setConfidenceThreshold(data.confidence_threshold);
        if(data.auto_approve !== undefined) setAutoApprove(data.auto_approve);
        if(data.scraper_interval) setScraperInterval(data.scraper_interval);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = () => {
    adminSettingsService.update({
      model: activeModel,
      confidence_threshold: confidenceThreshold,
      auto_approve: autoApprove,
      scraper_interval: scraperInterval
    }).then(() => alert('Settings saved successfully!')).catch(console.error);
  };

  const chartData = [
    { time: '1', value: 45 }, { time: '2', value: 30 }, { time: '3', value: 55 }, { time: '4', value: 70 },
  ];

  return (
    <div style={{ position: 'relative', height: '100%', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Neural Core</h1>
      <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '600px', lineHeight: '1.6', marginBottom: '40px' }}>
        Fine-tune the cognitive engine driving Edgenie. Balance precision against throughput for optimal student feedback cycles.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Model Selection */}
          <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '32px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#131720', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={20} color="#7eabfc" />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Model Selection</h3>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>Choose the primary inference engine</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div 
                onClick={() => setActiveModel('gpt')}
                style={{ cursor: 'pointer', backgroundColor: activeModel === 'gpt' ? 'rgba(126,171,252,0.05)' : '#131720', border: activeModel === 'gpt' ? '2px solid #7eabfc' : '1px solid #293040', borderRadius: '24px', padding: '24px', transition: 'all 0.2s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>GPT-4-Turbo-Edu</span>
                  <span style={{ backgroundColor: '#293040', color: '#94a3b8', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>OPTIMIZED</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5' }}>Highest reasoning capabilities for complex STEM subjects.</p>
              </div>

              <div 
                onClick={() => setActiveModel('bert')}
                style={{ cursor: 'pointer', backgroundColor: activeModel === 'bert' ? 'rgba(126,171,252,0.05)' : '#131720', border: activeModel === 'bert' ? '2px solid #7eabfc' : '1px solid #293040', borderRadius: '24px', padding: '24px', transition: 'all 0.2s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Custom BERT</span>
                  <span style={{ backgroundColor: '#293040', color: '#94a3b8', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>LOCAL</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5' }}>High-speed classification for standard literature tasks.</p>
              </div>
            </div>
          </div>

          {/* Inference Optimization */}
          <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '32px' }}>Inference Optimization</h3>
            
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>Confidence Threshold</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Minimum probability for auto-classification</div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7eabfc' }}>{(confidenceThreshold / 100).toFixed(2)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={confidenceThreshold} 
                  onChange={(e) => setConfidenceThreshold(e.target.value)} 
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>Speed vs. Accuracy Tradeoff</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Higher accuracy increases token latency</div>
                </div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#fff', letterSpacing: '1px' }}>ACCURACY FOCUS</div>
              </div>
              <div style={{ height: '8px', background: 'linear-gradient(to right, #f5a623, #7eabfc, #293040)', borderRadius: '4px', width: '100%' }}></div>
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '16px', right: '16px', width: '40px', height: '40px', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '6px' }}></div>
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', marginBottom: '8px' }}>System Health</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
               <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>99.98%</div>
               <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>▲ 0.02%</div>
            </div>
            <div style={{ height: '80px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <Bar dataKey="value" fill="#293040" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '32px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <div>
                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>Auto-Approve</div>
                   <div style={{ fontSize: '12px', color: '#94a3b8' }}>Low-risk questions</div>
                </div>
                <div 
                  onClick={() => setAutoApprove(!autoApprove)}
                  style={{ width: '40px', height: '24px', backgroundColor: autoApprove ? '#7eabfc' : '#293040', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                   <div style={{ position: 'absolute', top: '2px', left: autoApprove ? '18px' : '2px', width: '20px', height: '20px', backgroundColor: '#fff', borderRadius: '10px', transition: 'left 0.2s' }}></div>
                </div>
             </div>

             <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '16px' }}>Scraper Interval</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                   <button onClick={() => setScraperInterval('1h')} style={{ backgroundColor: '#131720', border: scraperInterval === '1h' ? '1px solid #7eabfc' : '1px solid #293040', color: '#fff', padding: '10px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer' }}>Every 1h</button>
                   <button onClick={() => setScraperInterval('6h')} style={{ backgroundColor: '#131720', border: scraperInterval === '6h' ? '1px solid #7eabfc' : '1px solid #293040', color: '#fff', padding: '10px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer' }}>Every 6h</button>
                   <button onClick={() => setScraperInterval('12h')} style={{ backgroundColor: '#131720', border: scraperInterval === '12h' ? '1px solid #7eabfc' : '1px solid #293040', color: '#fff', padding: '10px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer' }}>Every 12h</button>
                   <button onClick={() => setScraperInterval('24h')} style={{ backgroundColor: '#131720', border: scraperInterval === '24h' ? '1px solid #7eabfc' : '1px solid #293040', color: '#fff', padding: '10px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer' }}>Daily</button>
                </div>
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#131720', borderRadius: '16px', padding: '16px' }}>
                <Zap size={24} color="#f5a623" />
                <div>
                   <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>EST. LATENCY</div>
                   <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>142ms <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'normal' }}>/ request</span></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>Discard Unsaved Changes</button>
        <button onClick={handleSave} style={{ backgroundColor: '#7eabfc', border: 'none', color: '#131720', padding: '16px 32px', borderRadius: '30px', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(126,171,252,0.3)' }}>
          <Rocket size={20} /> Save & Deploy Changes
        </button>
      </div>
    </div>
  );
}
