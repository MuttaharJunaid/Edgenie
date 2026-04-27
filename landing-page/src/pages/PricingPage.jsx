import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const styles = {
    heroSection: {
      paddingTop: '160px',
      paddingBottom: '80px',
      textAlign: 'center',
    },
    title: {
      fontSize: '64px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '20px',
    },
    subtitle: {
      fontSize: '20px',
      color: '#a1a9b8',
      maxWidth: '600px',
      margin: '0 auto 40px auto',
    },
    toggleRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      marginBottom: '60px',
    },
    toggleLabel: {
      color: '#fff',
      fontWeight: '600',
      fontSize: '14px',
    },
    savePill: {
      backgroundColor: 'rgba(126, 171, 252, 0.1)',
      color: '#7eabfc',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 'bold',
      marginLeft: '8px',
    },
    switchTrack: {
      width: '48px',
      height: '24px',
      backgroundColor: '#2b313a',
      borderRadius: '12px',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background 0.3s',
    },
    switchThumb: {
      width: '20px',
      height: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      position: 'absolute',
      top: '2px',
      left: isAnnual ? '26px' : '2px',
      transition: 'left 0.3s',
    },
    pricingGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
      alignItems: 'start',
      paddingBottom: '100px',
    },
    priceCard: {
      backgroundColor: '#161a22',
      border: '1px solid #1e2430',
      borderRadius: '24px',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    popularCard: {
      backgroundColor: '#161a22',
      border: '2px solid rgba(126, 171, 252, 0.4)',
      boxShadow: '0 0 40px rgba(126, 171, 252, 0.1)',
      borderRadius: '24px',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transform: 'scale(1.02)',
      position: 'relative',
    },
    popularPill: {
      position: 'absolute',
      top: '-14px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#7eabfc',
      color: '#0c1017',
      fontWeight: 'bold',
      fontSize: '10px',
      padding: '6px 16px',
      borderRadius: '20px',
      letterSpacing: '1px',
    },
    tierName: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '8px',
    },
    tierDesc: {
      color: '#a1a9b8',
      fontSize: '14px',
      marginBottom: '32px',
      minHeight: '40px',
    },
    priceRow: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '8px',
      marginBottom: '32px',
    },
    priceBig: {
      fontSize: '56px',
      fontWeight: '700',
      color: '#fff',
      lineHeight: '1',
    },
    pricePeriod: {
      color: '#a1a9b8',
      fontSize: '16px',
    },
    featureList: {
      listStyle: 'none',
      marginBottom: '40px',
      flexGrow: 1,
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
      color: '#e2e8f0',
      fontSize: '14px',
    },
    disabledItem: {
      color: '#4b5563',
      textDecoration: 'line-through',
    },
    btnOutline: {
      width: '100%',
      backgroundColor: 'transparent',
      border: '1px solid #2b313a',
      color: '#fff',
      fontWeight: '600',
      padding: '14px 0',
      borderRadius: '30px',
      transition: 'all 0.2s',
      textAlign: 'center',
    },
    btnSolid: {
      width: '100%',
      backgroundColor: '#7eabfc',
      border: '1px solid #7eabfc',
      color: '#0c1017',
      fontWeight: '700',
      padding: '14px 0',
      borderRadius: '30px',
      transition: 'all 0.2s',
      textAlign: 'center',
    },
    bottomSection: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      gap: '24px',
      borderTop: '1px solid #1e2430',
      paddingTop: '80px',
      paddingBottom: '100px',
    },
    bottomCard: {
      backgroundColor: '#161a22',
      borderRadius: '24px',
      padding: '40px',
      border: '1px solid #1e2430',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    bottomStat: {
      fontSize: '48px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '8px',
      fontFamily: '"Space Grotesk", sans-serif',
      textAlign: 'center',
    },
    bottomLabel: {
      color: '#a1a9b8',
      fontSize: '12px',
      fontWeight: 'bold',
      letterSpacing: '1px',
      textAlign: 'center',
    }
  };

  const getPrice = (monthly) => {
    return isAnnual ? Math.round(monthly * 0.8) : monthly;
  }

  return (
    <div className="container">
      <section style={styles.heroSection}>
        <h1 className="brand-font" style={styles.title}>High-Velocity <span className="text-gradient" style={{color:'#7eabfc'}}>Excellence</span></h1>
        <p style={styles.subtitle}>Choose the plan that fits your academic ambitions. From solo learners to elite high-achievers.</p>
        
        <div style={styles.toggleRow}>
          <span style={styles.toggleLabel}>Monthly</span>
          <div style={styles.switchTrack} onClick={() => setIsAnnual(!isAnnual)}>
            <div style={styles.switchThumb} />
          </div>
          <span style={styles.toggleLabel}>
            Annual <span style={styles.savePill}>SAVE 20%</span>
          </span>
        </div>
      </section>

      <section style={styles.pricingGrid}>
        {/* Free Plan */}
        <div style={styles.priceCard}>
          <h3 style={styles.tierName}>Free</h3>
          <p style={styles.tierDesc}>Essential tools for curious minds.</p>
          <div style={styles.priceRow}>
            <span className="brand-font" style={styles.priceBig}>$0</span>
            <span style={styles.pricePeriod}>/mo</span>
          </div>
          <ul style={styles.featureList}>
            <li style={styles.featureItem}><Check size={18} color="#10b981" /> 5 AI-Generated practice sets</li>
            <li style={styles.featureItem}><Check size={18} color="#10b981" /> Basic progress tracking</li>
            <li style={styles.featureItem}><Check size={18} color="#10b981" /> Community access</li>
            <li style={{...styles.featureItem, ...styles.disabledItem}}><Check size={18} color="#4b5563" /> Deep-scan AI diagnostics</li>
            <li style={{...styles.featureItem, ...styles.disabledItem}}><Check size={18} color="#4b5563" /> Priority 24/7 AI Tutor access</li>
          </ul>
          <button style={styles.btnOutline}>Start Learning</button>
        </div>

        {/* Pro Plan */}
        <div style={styles.popularCard}>
          <div style={styles.popularPill}>MOST POPULAR</div>
          <h3 style={styles.tierName}>Pro</h3>
          <p style={styles.tierDesc}>Maximum performance for high-velocity students.</p>
          <div style={styles.priceRow}>
            <span className="brand-font" style={styles.priceBig}>${getPrice(24)}</span>
            <span style={styles.pricePeriod}>/mo</span>
          </div>
          <ul style={styles.featureList}>
            <li style={styles.featureItem}><Check size={18} color="#10b981" /> Unlimited AI practice sets</li>
            <li style={styles.featureItem}><Check size={18} color="#10b981" /> Deep-scan AI diagnostics</li>
            <li style={styles.featureItem}><Check size={18} color="#10b981" /> Priority 24/7 AI Tutor access</li>
            <li style={styles.featureItem}><Check size={18} color="#10b981" /> Personalized study roadmap</li>
            <li style={styles.featureItem}><Check size={18} color="#10b981" /> Offline mode enabled</li>
          </ul>
          <button style={styles.btnSolid}>Go Pro Now</button>
        </div>

        {/* Elite Plan */}
        <div style={styles.priceCard}>
          <h3 style={styles.tierName}><span style={{color: '#c084fc'}}>Elite</span></h3>
          <p style={styles.tierDesc}>For the top 1%. Institutional strength features.</p>
          <div style={styles.priceRow}>
            <span className="brand-font" style={styles.priceBig}>${getPrice(79)}</span>
            <span style={styles.pricePeriod}>/mo</span>
          </div>
          <ul style={styles.featureList}>
            <li style={styles.featureItem}><Check size={18} color="#10b981" /> Everything in Pro plan</li>
            <li style={styles.featureItem}><Check size={18} color="#10b981" /> Dedicated mentor calls (1/mo)</li>
            <li style={styles.featureItem}><Check size={18} color="#10b981" /> Alpha-test new AI features</li>
            <li style={styles.featureItem}><Check size={18} color="#10b981" /> Advanced group analytics</li>
          </ul>
          <button style={styles.btnOutline}>Contact Sales</button>
        </div>
      </section>

      <section style={styles.bottomSection}>
        <div style={{...styles.bottomCard, alignItems: 'flex-start', textAlign: 'left'}}>
          <h3 className="brand-font" style={{ fontSize: '28px', color: '#fff', fontWeight: 'bold', marginBottom: '16px' }}>Trusted by 10k+ <br/>Elite Performers</h3>
          <p style={{ color: '#a1a9b8', fontSize: '16px', lineHeight: '1.6' }}>Join students from Ivy League and Russell Group institutions who use Edgenie to smash their academic targets.</p>
        </div>
        <div style={styles.bottomCard}>
          <div style={styles.bottomStat}>98%</div>
          <div style={styles.bottomLabel}>SCORE INCREASE</div>
        </div>
        <div style={styles.bottomCard}>
          <div style={{...styles.bottomStat, color: '#c084fc'}}>24/7</div>
          <div style={styles.bottomLabel}>GLOBAL ACCESS</div>
        </div>
      </section>
    </div>
  );
}
