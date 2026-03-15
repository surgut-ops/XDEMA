// app/page.tsx
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroBg } from '@/components/sections/HeroBg';
import { Hero } from '@/components/sections/Hero';
import { Pricing } from '@/components/sections/Pricing';
import { Services } from '@/components/sections/Services';
import { GallerySection } from '@/components/sections/GallerySection';
import { Reviews } from '@/components/sections/Reviews';
import { FAQ } from '@/components/sections/FAQ';
import { ContactsSection } from '@/components/sections/ContactsSection';

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
