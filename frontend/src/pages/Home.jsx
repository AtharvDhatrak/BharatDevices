import React from 'react';
import Hero from '../components/Hero';
import TrustBadges from '../components/TrustBadges';
import ShopByCategory from '../components/ShopByCategory';
import BusinessSolutions from '../components/BusinessSolutions';
import WhyChooseUs from '../components/WhyChooseUs';
export default function Home() {
  return (
    <main className="home-main">
      <Hero />
      <TrustBadges />
      <ShopByCategory />
      <BusinessSolutions />
      <WhyChooseUs />
    </main>
  );
}
