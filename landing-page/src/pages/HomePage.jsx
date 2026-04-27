import React, { useState, useEffect } from 'react';
import { ArrowRight, PlayCircle, Search, Bot, Library } from 'lucide-react';
import { landingService } from '../services/api';

export default function HomePage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    landingService.getPublicStats()
      .then(res => setStats(res.data))
      .catch(console.error);
  }, []);
  const styles = {
    heroSection: {
      paddingTop: '160px',
      paddingBottom: '100px',
      textAlign: 'center',
      background: 'radial-gradient(ellipse at top, rgba(14, 25, 43, 0.8) 0%, #0c1017 60%)',
    },
    heroTitle: {
      fontSize: '72px',
      lineHeight: '1.1',
      fontWeight: '700',
      marginBottom: '24px',
      color: '#fff',
    },
    heroDesc: {
      fontSize: '20px',
      color: '#a1a9b8',
      maxWidth: '600px',
      margin: '0 auto 40px auto',
      lineHeight: '1.6',
    },
    heroActions: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      marginBottom: '60px',
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
      transition: 'background 0.2s',
    },
    trustRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
    },
    avatars: {
      display: 'flex',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '16px',
      marginLeft: '-10px',
      border: '2px solid #0c1017',
    },
    trustText: {
      color: '#a1a9b8',
      fontSize: '14px',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
      padding: '80px 0',
    },
    featureCard: {
      backgroundColor: '#161a22',
      border: '1px solid #1e2430',
      borderRadius: '24px',
      padding: '40px',
      transition: 'transform 0.2s',
    },
    iconBox: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      backgroundColor: '#202633',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '24px',
    },
    featureIcon: {
      color: '#7eabfc',
    },
    cardTitle: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '16px',
      color: '#fff',
    },
    cardDesc: {
      color: '#a1a9b8',
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '32px',
    },
    cardLink: {
      color: '#7eabfc',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'gap 0.2s',
    },
    statsSection: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '100px 0',
      borderTop: '1px solid #1e2430',
      borderBottom: '1px solid #1e2430',
    },
    statBox: {
      textAlign: 'center',
    },
    statNum: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '64px',
      fontWeight: '700',
      marginBottom: '8px',
    },
    statLabel: {
      color: '#a1a9b8',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
    testimonialSection: {
      padding: '120px 0',
      textAlign: 'center',
      position: 'relative',
    },
    quoteIcon: {
      fontSize: '120px',
      color: '#161a22',
      position: 'absolute',
      top: '60px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: -1,
      fontFamily: 'serif',
      fontWeight: 'bold',
      lineHeight: '1',
    },
    quoteText: {
      fontSize: '32px',
      lineHeight: '1.4',
      fontWeight: '500',
      color: '#e2e8f0',
      fontStyle: 'italic',
      maxWidth: '800px',
      margin: '0 auto 40px auto',
    },
    testimonialAuthorRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
    },
    authorPic: {
      width: '48px',
      height: '48px',
      borderRadius: '24px',
    },
    authorName: {
      fontWeight: '700',
      color: '#fff',
      fontSize: '16px',
      textAlign: 'left',
    },
    authorTitle: {
      color: '#a1a9b8',
      fontSize: '14px',
    },
    ctaSection: {
      backgroundColor: '#161a22',
      borderRadius: '32px',
      padding: '80px 24px',
      textAlign: 'center',
      margin: '0 auto',
      maxWidth: '1000px',
      position: 'relative',
      overflow: 'hidden',
    },
    ctaTitle: {
      fontSize: '48px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '20px',
    },
    ctaDesc: {
      color: '#a1a9b8',
      fontSize: '18px',
      maxWidth: '500px',
      margin: '0 auto 40px auto',
    },
    whiteBtn: {
      backgroundColor: '#fff',
      color: '#0c1017',
      fontWeight: '700',
      padding: '16px 32px',
      borderRadius: '30px',
      fontSize: '16px',
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div className="container">
          <h1 className="brand-font" style={styles.heroTitle}>
            Study smarter.<br/>
            <span className="text-gradient">Ace every exam.</span>
          </h1>
          <p style={styles.heroDesc}>
            The high-velocity AI learning companion designed for the modern academic. Master complex topics in half the time.
          </p>
          <div style={styles.heroActions}>
            <button className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }}>Get Started Free</button>
            <button 
              style={styles.secondaryBtn} 
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e2430'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <PlayCircle size={20} /> Watch how it works
            </button>
          </div>
          
          <div style={styles.trustRow}>
            <div style={styles.avatars}>
              <img src="/images/avatar_sarah.png" alt="Student" style={{...styles.avatar, marginLeft: '0'}} />
              <img src="https://i.pravatar.cc/100?img=12" alt="Student" style={styles.avatar} />
              <img src="https://i.pravatar.cc/100?img=15" alt="Student" style={styles.avatar} />
              <div style={{...styles.avatar, backgroundColor: '#2b313a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>
                +10k
              </div>
            </div>
            <span style={styles.trustText}>Trusted by 10k+ students at elite institutions</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container">
        <div style={styles.featuresGrid}>
          {/* Card 1 */}
          <div style={styles.featureCard} className="hover-lift">
            <div style={styles.iconBox}>
              <Search size={24} style={styles.featureIcon} />
            </div>
            <h3 style={styles.cardTitle}>Topical Search</h3>
            <p style={styles.cardDesc}>
              Scan thousands of academic papers and lecture notes instantly. Get cited answers tailored to your curriculum.
            </p>
            <a href="/features" style={styles.cardLink}>
              Learn more <ArrowRight size={16} />
            </a>
          </div>

          {/* Card 2 */}
          <div style={styles.featureCard} className="hover-lift">
            <div style={styles.iconBox}>
              <Bot size={24} style={{...styles.featureIcon, color: '#c084fc'}} />
            </div>
            <h3 style={styles.cardTitle}>AI Tutor</h3>
            <p style={styles.cardDesc}>
              A personalized coach that learns your strengths and weaknesses. Available 24/7 to explain complex concepts.
            </p>
            <a href="/features" style={{...styles.cardLink, color: '#c084fc'}}>
              Learn more <ArrowRight size={16} />
            </a>
          </div>

          {/* Card 3 */}
          <div style={styles.featureCard} className="hover-lift">
            <div style={styles.iconBox}>
              <Library size={24} style={{...styles.featureIcon, color: '#10b981'}} />
            </div>
            <h3 style={styles.cardTitle}>Mock Exams</h3>
            <p style={styles.cardDesc}>
              Generate infinite practice papers based on your syllabus. Real-time feedback and detailed marking schemes.
            </p>
            <a href="/features" style={{...styles.cardLink, color: '#10b981'}}>
              Learn more <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container" style={styles.statsSection}>
        <div style={styles.statBox}>
          <div style={{...styles.statNum, color: '#7eabfc'}}>{stats?.improvement_perc || '98'}%</div>
          <div style={styles.statLabel}>GRADE IMPROVEMENT</div>
        </div>
        <div style={styles.statBox}>
          <div style={{...styles.statNum, color: '#fff'}}>{stats?.topics_mastered ? `${(stats.topics_mastered / 1000).toFixed(1)}k` : '1.4M'}</div>
          <div style={styles.statLabel}>TOPICS MASTERED</div>
        </div>
        <div style={styles.statBox}>
          <div style={{...styles.statNum, color: '#f5a623'}}>{stats?.active_students ? `${(stats.active_students / 1000).toFixed(1)}k` : '45k'}</div>
          <div style={styles.statLabel}>ACTIVE STUDENTS</div>
        </div>
        <div style={styles.statBox}>
          <div style={{...styles.statNum, color: '#c084fc'}}>12s</div>
          <div style={styles.statLabel}>AVG RESPONSE TIME</div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="container" style={styles.testimonialSection}>
        <div style={styles.quoteIcon}>"</div>
        <p style={styles.quoteText}>
          "Edgenie didn't just help me pass; it fundamentally changed how I approach my Medical Degree. The AI tutor breaks down cellular biology into analogies that actually stick."
        </p>
        <div style={styles.testimonialAuthorRow}>
          <img src="/images/avatar_sarah.png" alt="Sarah Chen" style={styles.authorPic} />
          <div>
            <div style={styles.authorName}>Sarah Chen</div>
            <div style={styles.authorTitle}>Oxford University, Medicine Year 3</div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container" style={{ paddingBottom: '40px' }}>
        <div style={styles.ctaSection}>
          <h2 className="brand-font" style={styles.ctaTitle}>Ready to level up?</h2>
          <p style={styles.ctaDesc}>
            Join thousands of students who are reclaiming their time and maximizing their potential with Edgenie.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '16px 24px', borderRadius: '30px', width: '300px', outline: 'none' }} 
              onFocus={(e) => e.target.style.borderColor = '#7eabfc'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
            />
            <button 
              style={styles.whiteBtn} 
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} 
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              onClick={(e) => {
                const input = e.currentTarget.previousSibling;
                if(input.value) {
                  landingService.joinWaitlist({ email: input.value }).then(() => {
                    alert('Successfully joined the waitlist!');
                    input.value = '';
                  }).catch(console.error);
                }
              }}
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
