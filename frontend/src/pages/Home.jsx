import React from 'react';
import Hero from '../components/Hero';
import TrustBadges from '../components/TrustBadges';
import ShopByCategory from '../components/ShopByCategory';
import BusinessSolutions from '../components/BusinessSolutions';
import WhyChooseUs from '../components/WhyChooseUs';
import CTABanner from '../components/CTABanner';

export default function Home() {
  return (
    <main style={{ width: '100%', background: '#f8fafc' }}>
      <Hero />
      <TrustBadges />
      <ShopByCategory />
      <BusinessSolutions />
      <WhyChooseUs />
      <CTABanner />
    </main>
  );
}
