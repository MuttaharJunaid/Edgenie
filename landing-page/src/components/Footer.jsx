import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MessageSquare } from 'lucide-react';

export default function Footer() {
  const styles = {
    footerWrapper: {
      backgroundColor: '#0c1017',
      borderTop: '1px solid #1e2430',
      padding: '80px 0 40px 0',
      marginTop: '100px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      gap: '40px',
      marginBottom: '60px',
    },
    brandCol: {
      maxWidth: '300px',
    },
    logo: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '22px',
      fontWeight: '700',
      color: '#fff',
      letterSpacing: '-0.5px',
      marginBottom: '16px',
      display: 'block'
    },
    brandDesc: {
      color: '#a1a9b8',
      fontSize: '14px',
      lineHeight: '1.6',
      marginBottom: '24px',
    },
    socials: {
      display: 'flex',
      gap: '16px',
    },
    socialIcon: {
      color: '#a1a9b8',
      cursor: 'pointer',
      transition: 'color 0.2s',
    },
    colTitle: {
      color: '#fff',
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '24px',
    },
    linkList: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    linkDesc: {
      color: '#a1a9b8',
      fontSize: '14px',
      textDecoration: 'none',
      transition: 'color 0.2s',
    },
    bottomLine: {
      borderTop: '1px solid #1e2430',
      paddingTop: '32px',
      textAlign: 'center',
    },
    copyright: {
      color: '#6b7280',
      fontSize: '13px',
    }
  };

  return (
    <footer style={styles.footerWrapper}>
      <div className="container">
        <div style={styles.grid}>
          <div style={styles.brandCol}>
            <Link to="/" style={styles.logo}>Edgenie</Link>
            <p style={styles.brandDesc}>
              Powering the future of academic excellence through aware, learning, and adaptive technology.
            </p>
            <div style={styles.socials}>
              <Globe size={18} style={styles.socialIcon} />
              <Mail size={18} style={styles.socialIcon} />
              <MessageSquare size={18} style={styles.socialIcon} />
            </div>
          </div>

          <div>
            <h4 style={styles.colTitle}>Product</h4>
            <ul style={styles.linkList}>
              <li><Link to="/features" style={styles.linkDesc}>Features</Link></li>
              <li><Link to="/pricing" style={styles.linkDesc}>AI Tutor</Link></li>
              <li><Link to="#" style={styles.linkDesc}>Mock Exams</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={styles.colTitle}>Resources</h4>
            <ul style={styles.linkList}>
              <li><Link to="#" style={styles.linkDesc}>Study Guides</Link></li>
              <li><Link to="#" style={styles.linkDesc}>Blog</Link></li>
              <li><Link to="#" style={styles.linkDesc}>Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={styles.colTitle}>Company</h4>
            <ul style={styles.linkList}>
              <li><Link to="/about" style={styles.linkDesc}>About</Link></li>
              <li><Link to="#" style={styles.linkDesc}>Privacy</Link></li>
              <li><Link to="#" style={styles.linkDesc}>Terms</Link></li>
            </ul>
          </div>
        </div>

        <div style={styles.bottomLine}>
          <p style={styles.copyright}>© 2024 Edgenie AI. Built for the modern academic.</p>
        </div>
      </div>
    </footer>
  );
}
