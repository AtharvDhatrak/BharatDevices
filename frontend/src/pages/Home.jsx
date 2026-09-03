import React from 'react';
import Hero from '../components/Hero';
import ShopByCategory from '../components/ShopByCategory';

export default function Home() {
  return (
    <main style={{ width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
      <div className="home-content">
        <Hero />
        <ShopByCategory />
      </div>

      <style>{`
        .home-content {
          
          padding: 0 1.5rem;
          width: 100%;
        }

        /* Remove edge gutters on mobile to utilize 100% width */
        @media (max-width: 768px) {
          .home-content {
            padding: 0 0.25rem;
          }
        }
      `}</style>
    </main>
  );
}