import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, Users, LineChart, Terminal, Settings, HelpCircle, LogOut, Server, Bot } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Infrastructure', path: '/infrastructure', icon: <Server size={20} /> },
    { label: 'AI Scraper', path: '/scraper', icon: <Bot size={20} /> },
    { label: 'Question Bank', path: '/questions', icon: <Database size={20} /> },
    { label: 'Users', path: '/users', icon: <Users size={20} /> },
    { label: 'AI Analytics', path: '/analytics', icon: <LineChart size={20} /> },
    { label: 'System Logs', path: '/logs', icon: <Terminal size={20} /> },
    { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div style={{
      width: '260px',
      backgroundColor: '#0e1218',
      borderRight: '1px solid #293040',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '24px 0'
    }}>
      <div style={{ padding: '0 24px', marginBottom: '40px' }}>
        <h1 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Edgenie Admin</h1>
        <p style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>AI ENGINE V2.4</p>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.label} style={{ marginBottom: '8px' }}>
                <Link to={item.path} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 24px',
                  textDecoration: 'none',
                  color: isActive ? '#fff' : '#94a3b8',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  borderLeft: isActive ? '3px solid #7eabfc' : '3px solid transparent',
                  fontWeight: isActive ? '500' : '400',
                  transition: 'background 0.2s',
                }}>
                  <div style={{ color: isActive ? '#7eabfc' : '#94a3b8' }}>{item.icon}</div>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ padding: '0 24px' }}>
        <button style={{
          width: '100%',
          backgroundColor: '#7eabfc',
          color: '#0e1218',
          border: 'none',
          padding: '12px 0',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '13px',
          marginBottom: '24px',
          cursor: 'pointer'
        }}>
          GENERATE REPORT
        </button>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '16px' }}>
            <Link to="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', textDecoration: 'none' }}>
              <HelpCircle size={18} /> Support
            </Link>
          </li>
          <li>
            <Link to="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', textDecoration: 'none' }}>
              <LogOut size={18} /> Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
