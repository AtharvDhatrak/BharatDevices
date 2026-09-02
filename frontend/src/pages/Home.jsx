import React from 'react';
import Hero from '../components/Hero';
import StackedGlass from '../components/StackedGlass';

export default function Home() {
  return (
    <main style={{ width: '100%', minHeight: '100vh' }}>
      {/* Hero Section Container */}
      <div className="responsive-container">
        <Hero />
      </div>

    <div style={{
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%'
}}>

</div>
      {/* Other homepage sections like Categories or Featured Products can go below */}
    </main>
  );
}