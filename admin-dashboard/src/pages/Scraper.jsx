import React, { useState, useEffect } from 'react';
import { ChevronDown, Zap, Check, AlertCircle, Loader2 } from 'lucide-react';
import { adminScraperService } from '../api/client';

export default function Scraper() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [jobs, setJobs] = useState([]);
  
  const [formData, setFormData] = useState({
    year: 2023,
    subject_code: '4024',
    session: 'may-june',
    paper_type: 'qp',
    variant: '11'
  });

  const subjects = [
    { code: '4024', name: 'Mathematics' },
    { code: '5054', name: 'Physics' },
    { code: '5070', name: 'Chemistry' },
    { code: '5090', name: 'Biology' },
    { code: '2281', name: 'Economics' },
  ];

  const fetchJobs = async () => {
    try {
      const res = await adminScraperService.listJobs();
      setJobs(res.data.results || res.data || []);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await adminScraperService.createJob(formData);
      setSuccess(`Job ${res.data.id?.slice?.(0,8) || res.data.id} initialized successfully.`);
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start scrape job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', alignItems: 'center', paddingBottom: '60px' }}>
      
      <div style={{ maxWidth: '800px', width: '100%', marginTop: '40px' }}>
        
        <div style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '48px', marginBottom: '48px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#fff' }}>Initialize Extraction</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '40px' }}>Configure the parameters for the neural classification engine.</p>

          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle size={20} />
              <span style={{ fontSize: '14px' }}>{error}</span>
            </div>
          )}

          {success && (
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Check size={20} />
              <span style={{ fontSize: '14px' }}>{success}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
            
            {/* Field 1: Year */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>Examination Year</div>
              <select 
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                style={{ width: '100%', backgroundColor: '#131720', border: '1px solid #293040', borderRadius: '16px', padding: '16px 20px', color: '#fff', fontSize: '14px', appearance: 'none', cursor: 'pointer' }}
              >
                {[2024, 2023, 2022, 2021, 2020].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Field 2: Subject */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>Subject Domain</div>
              <select 
                value={formData.subject_code}
                onChange={(e) => setFormData({...formData, subject_code: e.target.value})}
                style={{ width: '100%', backgroundColor: '#131720', border: '1px solid #293040', borderRadius: '16px', padding: '16px 20px', color: '#fff', fontSize: '14px', appearance: 'none', cursor: 'pointer' }}
              >
                {subjects.map(s => <option key={s.code} value={s.code}>{s.name} ({s.code})</option>)}
              </select>
            </div>

            {/* Field 3: Session */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>Exam Session</div>
              <select 
                value={formData.session}
                onChange={(e) => setFormData({...formData, session: e.target.value})}
                style={{ width: '100%', backgroundColor: '#131720', border: '1px solid #293040', borderRadius: '16px', padding: '16px 20px', color: '#fff', fontSize: '14px', appearance: 'none', cursor: 'pointer' }}
              >
                <option value="may-june">May / June</option>
                <option value="oct-nov">Oct / Nov</option>
                <option value="feb-march">Feb / March</option>
              </select>
            </div>

            {/* Field 4: Variant */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>Variant</div>
              <select 
                value={formData.variant}
                onChange={(e) => setFormData({...formData, variant: e.target.value})}
                style={{ width: '100%', backgroundColor: '#131720', border: '1px solid #293040', borderRadius: '16px', padding: '16px 20px', color: '#fff', fontSize: '14px', appearance: 'none', cursor: 'pointer' }}
              >
                {['11','12','13','21','22','23','31','32','33','41','42','43'].map(v => <option key={v} value={v}>Variant {v}</option>)}
              </select>
            </div>

          </div>

          <button 
            onClick={handleScrape}
            disabled={loading}
            style={{ width: '100%', backgroundColor: loading ? '#293040' : '#1d72f8', border: 'none', color: '#fff', padding: '20px', borderRadius: '16px', fontSize: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 8px 32px rgba(29, 114, 248, 0.4)', transition: 'all 0.2s' }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="#fff" />}
            {loading ? 'Processing...' : 'Scrape & Classify'}
          </button>
        </div>


        {/* Recent Automations */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '1px' }}>RECENT AUTOMATIONS</h3>
          <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>View Archive</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {jobs.slice(0, 4).map((job, i) => (
            <div key={job.id} style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '24px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: job.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(126, 171, 252, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{ width: '24px', height: '24px', borderRadius: '12px', backgroundColor: job.status === 'completed' ? '#10b981' : '#7eabfc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   {job.status === 'completed' ? <Check size={14} color="#131720" strokeWidth={3} /> : <Loader2 size={14} color="#131720" className="animate-spin" />}
                 </div>
              </div>
              <div style={{ flex: 1 }}>
                 <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>{job.subject_code} V{job.variant || '?'} - {job.year} {(job.session || '').toUpperCase()}</div>
                 <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    <span style={{ color: job.status === 'failed' ? '#ef4444' : '#94a3b8', textTransform: 'capitalize' }}>{job.status}</span> • {job.classified_questions || 0} classified
                 </div>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <div style={{ gridColumn: 'span 2', textAlign: 'center', color: '#94a3b8', padding: '40px', border: '1px dashed #293040', borderRadius: '24px' }}>
              No recent automation jobs found.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
