import React from 'react';
import { Search, Bell, Radio } from 'lucide-react';

export default function TopBar() {
  return (
    <div style={{
      height: '64px',
      borderBottom: '1px solid #293040',
      backgroundColor: '#131720',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input 
            type="text" 
            placeholder="Search system resources..." 
            style={{
              backgroundColor: '#1c212c',
              border: '1px solid #293040',
              color: '#fff',
              padding: '8px 16px 8px 36px',
              borderRadius: '20px',
              width: '300px',
              fontSize: '13px'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '16px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '3px', backgroundColor: '#10b981' }}></div>
          <span style={{ color: '#10b981', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px' }}>SYSTEM OPERATIONAL</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Radio size={20} color="#94a3b8" />
        <div style={{ position: 'relative' }}>
          <Bell size={20} color="#94a3b8" />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', backgroundColor: '#7eabfc', borderRadius: '4px', border: '2px solid #131720' }}></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>Admin Root</div>
            <div style={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Level 5 Access</div>
          </div>
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '18px' }} />
        </div>
      </div>
    </div>
  );
}
