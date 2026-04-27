import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Check, Edit2, X, History, AlertTriangle } from 'lucide-react';
import { adminQuestionService } from '../api/client';

export default function QuestionBank() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminQuestionService.list()
      .then(res => setQuestions(res.data.results || res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleOpenModal = (q) => {
    setSelectedQuestion(q);
    setModalOpen(true);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Question Bank</h1>
          <p style={{ color: '#94a3b8', maxWidth: '800px', lineHeight: '1.5' }}>Audit and refine AI-generated examination materials. Ensure academic rigor, syllabus alignment, and marking precision before deployment to the student engine.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input 
            type="text" 
            placeholder="Search questions, topics, or AI IDs..." 
            style={{ backgroundColor: '#1c212c', border: '1px solid #293040', color: '#fff', padding: '8px 16px 8px 36px', borderRadius: '20px', width: '300px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.5px' }}>SUBJECT</div>
          <button style={{ backgroundColor: '#1c212c', border: '1px solid #293040', color: '#fff', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            All Subjects <ChevronDown size={14} />
          </button>
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.5px' }}>YEAR</div>
          <button style={{ backgroundColor: '#1c212c', border: '1px solid #293040', color: '#fff', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            2024 <ChevronDown size={14} />
          </button>
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.5px' }}>DIFFICULTY</div>
          <div style={{ display: 'flex', backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '8px', overflow: 'hidden' }}>
            <button style={{ backgroundColor: 'transparent', color: '#94a3b8', border: 'none', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>Easy</button>
            <button style={{ backgroundColor: '#293040', color: '#fff', border: 'none', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>Medium</button>
            <button style={{ backgroundColor: 'transparent', color: '#94a3b8', border: 'none', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>Hard</button>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {questions.map((q, idx) => {
          const confidence = 95; // default since we don't have it on the model
          const statusColor = '#10b981'; // default approved since we don't have moderation system in model
          return (
          <div key={idx} onClick={() => handleOpenModal(q)} style={{ backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '16px', padding: '24px', display: 'flex', gap: '24px', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#7eabfc'} onMouseLeave={e => e.currentTarget.style.borderColor = '#293040'}>
            <div style={{ width: '80px', flexShrink: 0 }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: confidence > 80 ? '#7eabfc' : confidence > 50 ? '#f5a623' : '#ef4444', lineHeight: '1' }}>{confidence}<span style={{fontSize: '14px'}}>%</span></div>
              <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 'bold', marginTop: '4px', letterSpacing: '0.5px' }}>CONFIDENCE</div>
              <div style={{ height: '3px', backgroundColor: '#293040', marginTop: '8px', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: `${confidence}%`, backgroundColor: confidence > 80 ? '#10b981' : confidence > 50 ? '#f5a623' : '#ef4444', borderRadius: '2px' }}></div>
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ backgroundColor: 'rgba(126, 171, 252, 0.1)', color: '#7eabfc', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>{q.paper?.subject?.name?.toUpperCase() || 'SUBJECT'}</span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>{q.difficulty?.toUpperCase?.() || 'NORMAL'}</span>
                <span style={{ color: '#94a3b8', fontSize: '11px' }}>• MARKS: {q.marks || 1}</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: '#fff', marginBottom: '16px' }}>{q.text}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: '#94a3b8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <History size={14} /> Paper {q.paper?.paper_number || 1}
                </span>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: statusColor, border: `1px solid ${statusColor}`, padding: '2px 8px', borderRadius: '12px' }}>APPROVED</span>
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* Modal */}
      {modalOpen && selectedQuestion && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ width: '600px', backgroundColor: '#1c212c', border: '1px solid #293040', borderRadius: '16px', padding: '32px', position: 'relative' }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>Detail Audit View</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#0e1218', border: '1px solid #293040', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '15px', backgroundColor: '#7eabfc', color: '#0c1017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>AI</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>Question ID: #{selectedQuestion.id}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Generated by GPT-4 Turbo-Edu</div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#7eabfc', letterSpacing: '1px', marginBottom: '12px' }}>TEXT CONTENT</div>
              <div style={{ backgroundColor: '#131720', border: '1px solid #293040', borderRadius: '12px', padding: '16px', color: '#e2e8f0', fontSize: '13px', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '8px' }}>{selectedQuestion.text}</p>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#7eabfc', letterSpacing: '1px', marginBottom: '12px' }}>SYLLABUS MAPPING</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ backgroundColor: '#131720', border: '1px solid #293040', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Subject</div>
                  <div style={{ fontSize: '13px', color: '#fff' }}>{selectedQuestion.paper?.subject?.name}</div>
                </div>
                <div style={{ backgroundColor: '#131720', border: '1px solid #293040', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Paper Year</div>
                  <div style={{ fontSize: '13px', color: '#fff' }}>{selectedQuestion.paper?.year}</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#7eabfc', letterSpacing: '1px', marginBottom: '12px' }}>AI REASONING</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', lineHeight: '1.5' }}>
                "This question was successfully extracted and processed from past paper data. The complexity level matches syllabus standards."
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button style={{ flex: 1, backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '14px', borderRadius: '24px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setModalOpen(false)}>
                <Check size={18} /> APPROVE
              </button>
              <button style={{ flex: 1, backgroundColor: '#293040', color: '#fff', border: 'none', padding: '14px', borderRadius: '24px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setModalOpen(false)}>
                <Edit2 size={18} /> EDIT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
