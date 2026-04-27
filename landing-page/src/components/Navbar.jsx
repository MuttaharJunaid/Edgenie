import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const styles = {
    navbar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      transition: 'all 0.3s ease',
      backgroundColor: scrolled ? 'rgba(12, 16, 23, 0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      padding: '20px 0',
    },
    navInner: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '22px',
      fontWeight: '700',
      color: '#fff',
      letterSpacing: '-0.5px'
    },
    links: {
      display: 'flex',
      gap: '32px',
      alignItems: 'center',
    },
    navLink: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#a1a9b8',
      transition: 'color 0.2s',
      position: 'relative',
    },
    navLinkActive: {
      color: '#fff',
    },
    activeLine: {
      position: 'absolute',
      bottom: '-6px',
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: '#7eabfc',
      borderRadius: '2px',
    },
    actions: {
      display: 'flex',
      gap: '24px',
      alignItems: 'center',
    },
    login: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#fff',
      transition: 'opacity 0.2s'
    },
    btnBlue: {
      backgroundColor: '#7eabfc',
      color: '#0c1017',
      padding: '10px 20px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'transform 0.2s',
    }
  };

  const navItems = [
    { label: 'Product', path: '/' },
    { label: 'Features', path: '/features' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header style={styles.navbar}>
      <div className="container" style={styles.navInner}>
        <Link to="/" style={styles.logo}>Edgenie</Link>
        <div style={styles.links}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{...styles.navLink, ...(isActive ? styles.navLinkActive : {})}}
                onMouseEnter={(e) => {
                  if (!isActive) e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.target.style.color = '#a1a9b8';
                }}
              >
                {item.label}
                {isActive && <div style={styles.activeLine} />}
              </Link>
            )
          })}
        </div>
        <div style={styles.actions}>
          <Link to="/" style={styles.login} onMouseEnter={e => e.target.style.opacity = '0.7'} onMouseLeave={e => e.target.style.opacity = '1'}>
            Log in
          </Link>
          <Link to="/" style={styles.btnBlue} onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
