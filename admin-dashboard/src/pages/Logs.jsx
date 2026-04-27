import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ToggleRight, Download, ExternalLink, X, Copy, Lightbulb } from 'lucide-react';
import { adminLogsService } from '../api/client';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminLogsService.list()
      .then(res => setLogs(res.data.results || res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  const defaultLogs = [
    { time: '14:02:45.812', type: 'CRITICAL', color: '#ef4444', node: 'NODE-XP-04', msg: 'SocketTimeoutException: Connection pool exhausted', active: true },
    { time: '14:02:42.884', type: 'WARNING', color: '#f5a623', node: 'NODE-XP-01', msg: 'High memory usage detected in embedding cluster (89%)' },
    { time: '14:02:40.112', type: 'INFO', color: '#94a3b8', node: 'SCHEDULER', msg: 'Dispatched 450 jobs to Cluster Alpha' },
    { time: '14:02:35.001', type: 'ERROR', color: '#ef4444', node: 'NODE-XP-09', msg: 'Proxy rotation failed for provider: Unreachable' },
    { time: '14:02:32.421', type: 'INFO', color: '#94a3b8', node: 'AUTH-GATE', msg: 'User admin@edgenie.ai session token verified [ok]' },
    { time: '14:02:29.115', type: 'ERROR', color: '#ef4444', node: 'DATA-PIPE', msg: 'Schema validation failed for batch payload #192A' }
  ];

  const displayLogs = logs.length > 0 ? logs : defaultLogs;

  const jsonSnippet = `{
  "timestamp": "2024-03-31T14:02:45.012Z",
  "level": "CRITICAL",
  "node": "NODE-XP-04",
  "error_code": 503,
  "stack": [
    "at Connection.handshake (net.js:12)",
    "at Socket.onConnect (socket.js:45)",
    "at System.init (lumina_core.cc:102)"
  ],
  "context": {
    "retry_count": 3,
    "is_fatal": true
  }
}`;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', height: '100%' }}>
      
      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Edgenie System Logs</h1>
           </div>
           
           <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '20px', display: 'flex', alignItems: 'center', padding: '6px 16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', marginRight: '8px' }}>Severity:</span>
                <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>All Levels <ChevronDown size={14} /></span>
              </div>
              <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '20px', display: 'flex', alignItems: 'center', padding: '6px 16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', marginRight: '8px' }}>Time:</span>
                <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>Last 1 Hour <ChevronDown size={14} /></span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
                <span style={{ color: '#7eabfc', fontSize: '12px', fontWeight: '600' }}>Live Stream</span>
                <ToggleRight size={32} color="#7eabfc" style={{ fill: 'rgba(126,171,252,0.2)' }} />
              </div>
              <button style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginLeft: '16px' }}>
                 <Download size={14} /> Export CSV
              </button>
           </div>
        </div>

        <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead style={{ backgroundColor: '#131720', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
              <tr style={{ color: '#94a3b8' }}>
                <th style={{ padding: '16px', fontWeight: '600', letterSpacing: '0.5px' }}>TIMESTAMP</th>
                <th style={{ padding: '16px', fontWeight: '600', letterSpacing: '0.5px' }}>EVENT TYPE</th>
                <th style={{ padding: '16px', fontWeight: '600', letterSpacing: '0.5px' }}>NODE ID</th>
                <th style={{ padding: '16px', fontWeight: '600', letterSpacing: '0.5px' }}>MESSAGE</th>
                <th style={{ padding: '16px', fontWeight: '600', letterSpacing: '0.5px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {displayLogs.map((L, i) => {
                const isError = L.type === 'ERROR' || L.type === 'CRITICAL' || L.level === 'error' || L.level === 'critical';
                const isWarn = L.type === 'WARNING' || L.level === 'warning';
                const logColor = isError ? '#ef4444' : isWarn ? '#f5a623' : '#94a3b8';
                const time = L.timestamp ? new Date(L.timestamp).toLocaleTimeString() : L.time;
                return (
                <tr key={i} style={{ backgroundColor: L.active ? 'rgba(239, 68, 68, 0.05)' : 'transparent', borderBottom: '1px solid #293040', borderLeft: L.active ? '3px solid #ef4444' : '3px solid transparent' }}>
                  <td style={{ padding: '16px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{time}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ border: `1px solid ${logColor}`, color: logColor, padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>{(L.level || L.type || 'INFO').toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '16px', color: '#e2e8f0' }}>{L.node || 'SYSTEM'}</td>
                  <td style={{ padding: '16px', color: '#fff', fontWeight: L.active ? 'bold' : 'normal' }}>{L.message || L.msg}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <ExternalLink size={16} color="#94a3b8" style={{ cursor: 'pointer' }} />
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '12px', borderTop: '1px solid #293040', marginTop: 'auto' }}>
            <span>SHOWING 245 ACTIVE LOG STREAMS</span>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ cursor: 'pointer' }}>PREVIOUS</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>1</span>
              <span style={{ cursor: 'pointer' }}>2</span>
              <span style={{ cursor: 'pointer' }}>3</span>
              <span style={{ cursor: 'pointer' }}>NEXT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pane Detail */}
      <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #293040', paddingBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>LOG DETAIL</h3>
          <X size={18} color="#94a3b8" style={{ cursor: 'pointer' }} />
        </div>

        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '16px', marginBottom: '32px' }}>
          <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>EVENT TYPE</div>
          <div style={{ fontSize: '16px', color: '#fff', fontWeight: 'bold' }}>Critical System Failure</div>
        </div>

        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '12px' }}>METADATA</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#131720', border: '1px solid #293040', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>TRACE ID</div>
            <div style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold', fontFamily: 'monospace' }}>TRX-992-BA</div>
          </div>
          <div style={{ backgroundColor: '#131720', border: '1px solid #293040', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>DURATION</div>
            <div style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold' }}>452ms</div>
          </div>
        </div>

        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '12px' }}>STACK TRACE</div>
        <div style={{ backgroundColor: '#131720', border: '1px solid #293040', borderRadius: '16px', padding: '16px', marginBottom: '32px', overflowX: 'auto' }}>
          <pre style={{ margin: 0, color: '#f5a623', fontSize: '12px', fontFamily: 'monospace', lineHeight: '1.5' }}>
            {jsonSnippet}
          </pre>
        </div>

        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '12px' }}>TROUBLESHOOTING</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 'auto' }}>
           <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#e2e8f0', lineHeight: '1.4' }}>
             <Lightbulb size={16} color="#f5a623" style={{ flexShrink: 0, marginTop: '2px' }} />
             <span>Verify the target IP whitelisting in AWS Security Groups.</span>
           </div>
           <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#e2e8f0', lineHeight: '1.4' }}>
             <Lightbulb size={16} color="#f5a623" style={{ flexShrink: 0, marginTop: '2px' }} />
             <span>Check if SSL certificates for Node-XP-04 have expired.</span>
           </div>
        </div>

        <button style={{ width: '100%', border: '1px solid #293040', backgroundColor: '#131720', color: '#fff', padding: '14px', borderRadius: '8px', fontWeight: '600', marginTop: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#293040'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#131720'}>
          <Copy size={16} /> Copy Trace JSON
        </button>
      </div>
    </div>
  );
}
