// app/page.tsx
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroBg } from '@/components/sections/HeroBg';
import { Hero } from '@/components/sections/Hero';
import { Pricing, Services, GallerySection, Reviews, FAQ, ContactsSection } from '@/components/sections';

export default function HomePage() {
  return (
    <>
      <HeroBg />
      <Navbar />
      <main>
        <Hero />
        <div id="training"><Pricing /></div>
        <div id="services"><Services /></div>
        <div id="gallery"><GallerySection /></div>
        <div id="reviews"><Reviews /></div>
        <div id="faq"><FAQ /></div>
        <div id="contacts"><ContactsSection /></div>
      </main>
      <Footer />
    </>
  );
}
