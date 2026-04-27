import React from 'react';
import { PlayCircle, Calendar, CheckSquare, Brain, PieChart, CheckCircle2 } from 'lucide-react';

export default function FeaturesPage() {
  const styles = {
    heroSection: {
      paddingTop: '160px',
      paddingBottom: '100px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      alignItems: 'center',
    },
    heroLeft: {},
    tagLabel: {
      backgroundColor: 'rgba(126, 171, 252, 0.1)',
      color: '#7eabfc',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      letterSpacing: '1px',
      display: 'inline-block',
      marginBottom: '24px',
    },
    heroTitle: {
      fontSize: '72px',
      lineHeight: '1.1',
      fontWeight: '700',
      marginBottom: '24px',
      color: '#fff',
    },
    heroDesc: {
      fontSize: '18px',
      color: '#a1a9b8',
      maxWidth: '480px',
      lineHeight: '1.6',
      marginBottom: '40px',
    },
    heroActions: {
      display: 'flex',
      gap: '16px',
    },
    secondaryBtn: {
      backgroundColor: 'transparent',
      border: '1px solid #2b313a',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      borderRadius: '30px',
      fontWeight: '600',
    },
    heroImageWrapper: {
      position: 'relative',
      borderRadius: '50%',
      overflow: 'hidden',
      aspectRatio: '1',
      maxWidth: '500px',
      margin: '0 auto',
      border: '1px solid rgba(126, 171, 252, 0.2)',
      boxShadow: '0 0 100px rgba(126, 171, 252, 0.1)',
    },
    heroImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    floatingPill: {
      position: 'absolute',
      backgroundColor: '#161a22',
      border: '1px solid #1e2430',
      padding: '12px 24px',
      borderRadius: '30px',
      color: '#fff',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    sectionTitle: {
      fontSize: '48px',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '16px',
      color: '#fff',
    },
    sectionSubtitle: {
      textAlign: 'center',
      color: '#a1a9b8',
      fontSize: '18px',
      marginBottom: '80px',
    },
    grid2x2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      marginBottom: '24px',
    },
    featureCardLg: {
      backgroundColor: '#161a22',
      border: '1px solid #1e2430',
      borderRadius: '24px',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden',
    },
    iconSmall: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      backgroundColor: '#202633',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '20px',
    },
    cardTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '16px',
    },
    cardDesc: {
      color: '#a1a9b8',
      fontSize: '16px',
      lineHeight: '1.6',
      maxWidth: '80%',
    },
    subjectSection: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '60px',
      alignItems: 'center',
      padding: '120px 0',
    },
    subjectCard: {
      backgroundColor: '#161a22',
      border: '1px solid #1e2430',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '16px',
    },
    subjectLabelRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '16px',
    },
    subjectPillText: {
      fontSize: '10px',
      fontWeight: 'bold',
      letterSpacing: '1px',
      padding: '4px 8px',
      borderRadius: '4px',
    },
    subjectQuestion: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: '8px',
    },
    subjectAnswer: {
      fontSize: '14px',
      color: '#a1a9b8',
      fontStyle: 'italic',
    },
    listCheck: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
    },
    listCheckText: {
      color: '#fff',
      fontWeight: '500',
    },
    ctaSection: {
      backgroundColor: '#161a22',
      borderRadius: '32px',
      padding: '80px 24px',
      textAlign: 'center',
      marginBottom: '100px',
    }
  };

  return (
    <div>
      <section className="container" style={styles.heroSection}>
        <div style={styles.heroLeft}>
          <div style={styles.tagLabel}>INTRODUCING AI TUTOR 2.0</div>
          <h1 className="brand-font" style={styles.heroTitle}>Study at the speed of <span className="text-gradient" style={{color:'#7eabfc'}}>Intelligence.</span></h1>
          <p style={styles.heroDesc}>
            Edgenie isn't just an app—it's a high-velocity cognitive partner. Our AI Tutor evolves with you, turning complex exam prep into a streamlined flow state.
          </p>
          <div style={styles.heroActions}>
            <button className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }}>Experience AI Tutor</button>
            <button style={styles.secondaryBtn}>
              <PlayCircle size={20} /> View Demo
            </button>
          </div>
        </div>
        <div style={{position: 'relative'}}>
          <div style={styles.heroImageWrapper}>
            <img src="/images/ai_face.png" alt="AI Avatar" style={styles.heroImage} />
          </div>
          <div style={{...styles.floatingPill, bottom: '40px', left: '0'}}>
            <div style={{ fontSize: '12px', color: '#a1a9b8' }}>Confidence Score<br/><span style={{ fontSize: '20px', color: '#fff' }}>98.4%</span></div>
          </div>
          <div style={{...styles.floatingPill, top: '40px', right: '0'}}>
            <SparklesIcon size={16} color="#7eabfc" /> Active Tutoring
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: '80px' }}>
        <h2 className="brand-font" style={styles.sectionTitle}>Precision Engineering for Students</h2>
        <p style={styles.sectionSubtitle}>We've replaced the generic study experience with a modular system designed for maximum retention.</p>
        
        <div style={styles.grid2x2}>
          <div style={styles.featureCardLg}>
             <div style={styles.iconSmall}><Calendar size={20} color="#7eabfc" /></div>
             <h3 style={styles.cardTitle}>Personalized Study Plans</h3>
             <p style={styles.cardDesc}>
               Adaptive algorithms that analyze your performance patterns to generate daily missions, ensuring you hit peak readiness by exam day.
             </p>
          </div>
          <div style={styles.featureCardLg}>
             <div style={styles.iconSmall}><CheckSquare size={20} color="#f5a623" /></div>
             <h3 style={styles.cardTitle}>Instant Feedback</h3>
             <p style={styles.cardDesc}>
               Scan your handwritten notes or type answers for immediate, granular grading across STEM and Humanities.
             </p>
          </div>
        </div>

        <div style={styles.grid2x2}>
          <div style={styles.featureCardLg}>
             <div style={styles.iconSmall}><Brain size={20} color="#c084fc" /></div>
             <h3 style={styles.cardTitle}>Deep Simplification</h3>
             <p style={styles.cardDesc}>
               Stuck on Quantum Physics or Macroeconomics? Edgenie AI breaks it down into "Explain Like I'm Five" analogies without losing the rigor.
             </p>
          </div>
          <div style={{...styles.featureCardLg, padding: 0}}>
             <img src="/images/neural_graph.png" alt="Visual Knowledge Graphs" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
             <div style={{ position: 'absolute', bottom: '40px', left: '40px', zIndex: 10 }}>
                <div style={styles.tagLabel}>DATA DRIVEN</div>
                <h3 style={styles.cardTitle}>Visual Knowledge Graphs</h3>
                <p style={{...styles.cardDesc, color: '#fff'}}>
                  Watch your knowledge grow. Connect concepts across different subjects with interactive neural maps.
                </p>
             </div>
          </div>
        </div>
      </section>

      <section className="container" style={styles.subjectSection}>
        <div>
          <div style={styles.subjectCard}>
            <div style={styles.subjectLabelRow}>
               <span style={{...styles.subjectPillText, backgroundColor: 'rgba(126, 171, 252, 0.2)', color: '#7eabfc'}}>MATHS</span>
               <span style={{...styles.subjectPillText, backgroundColor: '#dc2626', color: '#fff'}}>HARD</span>
            </div>
            <div style={styles.subjectQuestion}>Solve for the limit of (sin x)/x as x approaches 0.</div>
            <div style={styles.subjectAnswer}>"Edgenie AI explained it using a sandwich theorem visual that finally made it click." — James, 12th Grade</div>
          </div>
          <div style={styles.subjectCard}>
            <div style={styles.subjectLabelRow}>
               <span style={{...styles.subjectPillText, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981'}}>BIOLOGY</span>
               <span style={{...styles.subjectPillText, backgroundColor: '#4b5563', color: '#fff'}}>MEDIUM</span>
            </div>
            <div style={styles.subjectQuestion}>Explain the Krebs Cycle in the context of aerobic respiration.</div>
            <div style={styles.subjectAnswer}>The AI uses an 'Energy Factory' analogy to simplify the enzymatic reactions.</div>
          </div>
        </div>
        <div>
          <h2 className="brand-font" style={{ fontSize: '48px', fontWeight: 'bold', color: '#fff', marginBottom: '24px' }}>Built for Every Subject</h2>
          <p style={{ color: '#a1a9b8', fontSize: '18px', lineHeight: '1.6', marginBottom: '32px' }}>
            Our AI isn't a generalist—it's specialized. Whether it's Calculus, Shakespeare, or Organic Chemistry, Edgenie switches its cognitive model to match the academic rigor required.
          </p>
          <div style={styles.listCheck}>
            <CheckCircle2 color="#7eabfc" size={20} /> <span style={styles.listCheckText}>Step-by-step derivation for STEM</span>
          </div>
          <div style={styles.listCheck}>
            <CheckCircle2 color="#7eabfc" size={20} /> <span style={styles.listCheckText}>Critical analysis for Humanities</span>
          </div>
          <div style={styles.listCheck}>
            <CheckCircle2 color="#7eabfc" size={20} /> <span style={styles.listCheckText}>Vocabulary expansion for Languages</span>
          </div>
        </div>
      </section>

      <section className="container">
        <div style={styles.ctaSection}>
          <h2 className="brand-font" style={{ fontSize: '48px', fontWeight: 'bold', color: '#fff', marginBottom: '20px' }}>Ready to level up?</h2>
          <p style={{ color: '#a1a9b8', fontSize: '18px', marginBottom: '40px' }}>
            Join 50,000+ students mastering their future with Edgenie AI.
          </p>
          <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '18px' }}>Start Your Free Trial</button>
          <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '16px' }}>No credit card required. Cancel anytime.</p>
        </div>
      </section>
    </div>
  );
}

function SparklesIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={props.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}
