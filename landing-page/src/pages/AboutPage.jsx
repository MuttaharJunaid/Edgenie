import React from 'react';

export default function AboutPage() {
  const styles = {
    heroSection: {
      paddingTop: '160px',
      paddingBottom: '100px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '60px',
      alignItems: 'center',
    },
    tagPill: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      color: '#a1a9b8',
      fontSize: '12px',
      fontWeight: 'bold',
      letterSpacing: '1px',
      padding: '6px 16px',
      borderRadius: '20px',
      display: 'inline-block',
      marginBottom: '24px',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    heroTitle: {
      fontSize: '64px',
      lineHeight: '1.1',
      fontWeight: '700',
      marginBottom: '24px',
      color: '#fff',
    },
    heroDesc: {
      fontSize: '18px',
      lineHeight: '1.6',
      color: '#a1a9b8',
    },
    imageBox: {
      width: '100%',
      aspectRatio: '1',
      borderRadius: '32px',
      overflow: 'hidden',
    },
    imgCover: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    sectionLine: {
      marginLeft: '0',
      marginBottom: '60px',
      width: '40px',
      height: '2px',
      backgroundColor: '#7eabfc',
    },
    sectionTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: '16px',
    },
    philosophyGrid: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: '24px',
      marginBottom: '24px',
    },
    gridReversed: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.5fr',
      gap: '24px',
      marginBottom: '100px',
    },
    philCardDark: {
      backgroundColor: '#161a22',
      border: '1px solid #1e2430',
      borderRadius: '24px',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden',
    },
    philCardBlue: {
      backgroundColor: '#7eabfc',
      borderRadius: '24px',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    teamSection: {
      paddingBottom: '120px',
    },
    teamHeaderRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: '60px',
    },
    teamGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '24px',
    },
    teamCard: {
      textAlign: 'left',
    },
    teamImage: {
      width: '100%',
      aspectRatio: '3/4',
      borderRadius: '16px',
      objectFit: 'cover',
      marginBottom: '16px',
      backgroundColor: '#1e2430',
      filter: 'grayscale(100%)',
    },
    teamName: {
      color: '#fff',
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '4px',
    },
    teamRole: {
      color: '#7eabfc',
      fontSize: '14px',
      fontWeight: '500',
    },
    ctaDark: {
      backgroundColor: '#161a22',
      border: '1px solid #1e2430',
      borderRadius: '32px',
      padding: '80px',
      textAlign: 'center',
      marginBottom: '100px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    }
  };

  return (
    <div className="container">
      {/* Hero */}
      <section style={styles.heroSection}>
        <div>
          <div style={styles.tagPill}>THE FUTURE OF EDTECH</div>
          <h1 className="brand-font" style={styles.heroTitle}>Mission: <br/><i style={{color:'#7eabfc'}}>Precision</i> in Learning</h1>
          <p style={styles.heroDesc}>
            We aren't just building another study app. We're engineering a high-velocity cognitive engine that adapts to your unique neural patterns.
          </p>
        </div>
        <div style={styles.imageBox}>
          <img src="/images/abstract_wave.png" alt="Abstract rendering" style={styles.imgCover} />
        </div>
      </section>

      {/* Core Philosophy */}
      <section>
        <h2 className="brand-font" style={styles.sectionTitle}>Our Core Philosophy</h2>
        <div style={styles.sectionLine} />
        
        <div style={styles.philosophyGrid}>
          <div style={{...styles.philCardDark, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <h3 style={{...styles.sectionTitle, fontSize: '24px'}}>Velocity Over Volume</h3>
            <p style={{color: '#a1a9b8', fontSize: '16px'}}>We believe in reducing the time to mastery. Our AI identifies exactly where your comprehension gaps exist, eliminating redundant study hours.</p>
          </div>
          <div style={styles.philCardBlue}>
            <h3 className="brand-font" style={{fontSize: '24px', color: '#0c1017', fontWeight: 'bold', marginBottom: '16px'}}>Neural Adaptivity</h3>
            <p style={{color: '#0c1017', fontSize: '16px', opacity: 0.8}}>Personalization isn't just a buzzword; it's our foundational architecture.</p>
          </div>
        </div>

        <div style={styles.gridReversed}>
          <div style={{...styles.philCardDark, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <h3 style={{...styles.sectionTitle, fontSize: '20px'}}>Precision Engineering</h3>
            <p style={{color: '#a1a9b8', fontSize: '14px'}}>Every interface interaction and data point is tuned for cognitive load reduction.</p>
          </div>
          <div style={{...styles.philCardDark, padding: 0}}>
            <img src="/images/world_map.png" alt="Global accessibility" style={{...styles.imgCover, opacity: 0.4}} />
            <div style={{position: 'absolute', top: '40px', left: '40px', maxWidth: '300px'}}>
              <h3 style={{...styles.sectionTitle, fontSize: '24px'}}>Radical Accessibility</h3>
              <p style={{color: '#a1a9b8', fontSize: '16px'}}>We're democratizing high-end coaching by making elite-level pedagogy available to anyone with a screen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={styles.teamSection}>
        <div style={styles.teamHeaderRow}>
          <div>
             <h2 className="brand-font" style={styles.sectionTitle}>The Minds Behind <br/><span style={{color: '#7eabfc'}}>The Code</span></h2>
             <p style={{color: '#a1a9b8', fontSize: '16px'}}>Meet the architects, educators, and engineers redefining academic excellence.</p>
          </div>
        </div>

        <div style={styles.teamGrid}>
          <div style={styles.teamCard}>
             <img src="https://i.pravatar.cc/300?img=11" alt="Dr Elias Vance" style={styles.teamImage} />
             <div style={styles.teamName}>Dr. Elias Vance</div>
             <div style={styles.teamRole}>Chief Executive Architect</div>
          </div>
          <div style={styles.teamCard}>
             <img src="https://i.pravatar.cc/300?img=47" alt="Sarah Thorne" style={styles.teamImage} />
             <div style={styles.teamName}>Sarah Thorne</div>
             <div style={styles.teamRole}>Head of AI Research</div>
          </div>
          <div style={styles.teamCard}>
             <img src="https://i.pravatar.cc/300?img=12" alt="Julian Chen" style={styles.teamImage} />
             <div style={styles.teamName}>Julian Chen</div>
             <div style={styles.teamRole}>Principal UI/UX Lead</div>
          </div>
          <div style={styles.teamCard}>
             <img src="https://i.pravatar.cc/300?img=60" alt="Marcus Reed" style={styles.teamImage} />
             <div style={styles.teamName}>Marcus Reed</div>
             <div style={styles.teamRole}>Director of Cognitive Pedagogy</div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section>
        <div style={styles.ctaDark}>
          <h2 className="brand-font" style={{fontSize: '48px', color: '#fff', fontWeight: 'bold', marginBottom: '16px'}}>Get in Touch</h2>
          <p style={{color: '#a1a9b8', fontSize: '18px', maxWidth: '600px', marginBottom: '40px'}}>Have questions about our enterprise plans, research, or just want to chat? Send us a message.</p>
          <form 
            style={{display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '500px'}}
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const data = Object.fromEntries(fd.entries());
              // Call API
              import('../services/api').then(({ landingService }) => {
                landingService.submitContact(data).then(() => {
                  alert('Message sent successfully!');
                  e.target.reset();
                }).catch(console.error);
              });
            }}
          >
             <input name="name" required placeholder="Your Name" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px 20px', borderRadius: '12px', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#7eabfc'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
             <input type="email" name="email" required placeholder="Your Email" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px 20px', borderRadius: '12px', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#7eabfc'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
             <textarea name="message" required placeholder="How can we help?" rows={4} style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px 20px', borderRadius: '12px', outline: 'none', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#7eabfc'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}></textarea>
             <button type="submit" className="btn-primary" style={{padding: '14px 32px'}}>Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
}
