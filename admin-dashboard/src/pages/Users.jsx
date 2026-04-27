import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Eye, Edit2, Flag, Flame, Users as UsersIcon } from 'lucide-react';
import { adminUsersService, adminDashboardService } from '../api/client';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminUsersService.list(),
      adminDashboardService.getStats()
    ]).then(([uRes, sRes]) => {
      setUsers(uRes.data.results || uRes.data || []);
      setStats(sRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>User Management</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Manage and monitor student learning trajectories</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input 
            type="text" 
            placeholder="Global student search..." 
            style={{ backgroundColor: '#1c212c', border: '1px solid #293040', color: '#fff', padding: '8px 16px 8px 36px', borderRadius: '20px', width: '250px', fontSize: '13px' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '16px' }}>ACTIVE STUDENTS</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#fff', lineHeight: 1 }}>{stats?.total_users || 0}</div>
            <div style={{ fontSize: '14px', color: '#10b981', fontWeight: 'bold' }}>~12%</div>
          </div>
          <div style={{ position: 'absolute', right: '-10px', bottom: '-20px', opacity: 0.1 }}><UsersIcon size={120} /></div>
        </div>
        
        <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '16px' }}>SUBSCRIPTION CONV.</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#f5a623', lineHeight: 1 }}>18.5%</div>
            <div style={{ fontSize: '14px', color: '#10b981', fontWeight: 'bold' }}>~3%</div>
          </div>
          <div style={{ position: 'absolute', right: '10px', top: '10px', opacity: 0.1, fontSize: '100px' }}>★</div>
        </div>

        <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '16px' }}>AVG. STUDY TIME</div>
          <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#c084fc', lineHeight: 1 }}>42m</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px' }}>
        {/* Roster Table */}
        <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Student Roster</h3>
            <div style={{ display: 'flex', gap: '16px', color: '#94a3b8' }}>
              <Filter size={18} style={{ cursor: 'pointer' }} />
              <MoreVertical size={18} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #293040' }}>
                <th style={{ paddingBottom: '16px', fontWeight: '600' }}>NAME</th>
                <th style={{ paddingBottom: '16px', fontWeight: '600' }}>SUBSCRIPTION</th>
                <th style={{ paddingBottom: '16px', fontWeight: '600' }}>STATUS</th>
                <th style={{ paddingBottom: '16px', fontWeight: '600' }}>JOINED DATE</th>
                <th style={{ paddingBottom: '16px', fontWeight: '600' }}>ACTIVITY</th>
                <th style={{ paddingBottom: '16px', fontWeight: '600', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} style={{ borderBottom: i !== users.length-1 ? '1px solid #293040' : 'none' }}>
                  <td style={{ padding: '16px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={`https://i.pravatar.cc/100?img=${(i % 50) + 1}`} alt={u.full_name} style={{ width: '32px', height: '32px', borderRadius: '16px' }} />
                      <div>
                        <div style={{ color: '#fff', fontWeight: '600' }}>{u.full_name || 'Student'}</div>
                        <div style={{ color: '#94a3b8', fontSize: '11px' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 0' }}>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: u.is_premium ? '#c084fc' : '#94a3b8', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>{u.is_premium ? 'PRO' : 'FREE'}</span>
                  </td>
                  <td style={{ padding: '16px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '12px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '3px', backgroundColor: u.is_active ? '#10b981' : '#4b5563' }}></div>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                  <td style={{ padding: '16px 0', color: '#94a3b8' }}>{new Date(u.date_joined).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 0', color: '#94a3b8' }}>Just now</td>
                  <td style={{ padding: '16px 0', textAlign: 'right', color: '#94a3b8' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <Eye size={16} style={{ cursor: 'pointer' }} />
                      <Edit2 size={16} style={{ cursor: 'pointer' }} />
                      <Flag size={16} style={{ cursor: 'pointer' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #293040', color: '#94a3b8', fontSize: '12px' }}>
            <span>Showing {users.length} students</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #293040', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Previous</button>
              <button style={{ backgroundColor: '#293040', color: '#fff', border: '1px solid #293040', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Next</button>
            </div>
          </div>
        </div>

        {/* Side summary */}
        <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '16px', padding: '24px', alignSelf: 'start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid #293040', marginBottom: '24px' }}>
            <img src="https://i.pravatar.cc/100?img=11" alt="Ahmed Ali" style={{ width: '48px', height: '48px', borderRadius: '24px' }} />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Ahmed Ali</h3>
              <p style={{ color: '#c084fc', fontSize: '12px', fontWeight: 'bold' }}>Elite Subscription</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#131720', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: 'rgba(245, 166, 35, 0.1)', padding: '8px', borderRadius: '8px' }}><Flame size={20} color="#f5a623" /></div>
            <div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>STREAK</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>7 Days Live</div>
            </div>
          </div>

          <h4 style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '16px' }}>SUBJECT MASTERY</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>Mathematics</span><span style={{color: '#10b981'}}>92%</span></div>
              <div style={{ height: '4px', backgroundColor: '#293040', borderRadius: '2px' }}><div style={{ height: '100%', width: '92%', backgroundColor: '#10b981', borderRadius: '2px' }}></div></div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>Physics</span><span style={{color: '#7eabfc'}}>74%</span></div>
              <div style={{ height: '4px', backgroundColor: '#293040', borderRadius: '2px' }}><div style={{ height: '100%', width: '74%', backgroundColor: '#7eabfc', borderRadius: '2px' }}></div></div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>Biology</span><span style={{color: '#ef4444'}}>41%</span></div>
              <div style={{ height: '4px', backgroundColor: '#293040', borderRadius: '2px' }}><div style={{ height: '100%', width: '41%', backgroundColor: '#ef4444', borderRadius: '2px' }}></div></div>
            </div>
          </div>

          <div style={{ padding: '16px', backgroundColor: 'rgba(245, 166, 35, 0.05)', border: '1px solid rgba(245, 166, 35, 0.2)', borderRadius: '12px' }}>
            <h4 style={{ fontSize: '10px', color: '#f5a623', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>AI INTERVENTION SUGGESTED</h4>
            <p style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: '1.5', marginBottom: '12px' }}>"Recommend routing to visual interactive modules for Cellular Biology."</p>
            <button style={{ width: '100%', backgroundColor: 'rgba(245, 166, 35, 0.2)', border: 'none', color: '#f5a623', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Apply Override</button>
          </div>
        </div>

      </div>

    </div>
  );
}
