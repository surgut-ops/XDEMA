import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroBg } from '@/components/sections/HeroBg';
import { GallerySection } from '@/components/sections';

export default function GalleryPage() {
  return (
    <>
      <HeroBg />
      <Navbar />
      <main className="pt-[66px] min-h-screen">
        <div className="max-w-[1160px] mx-auto px-4 py-20">
          <h1 className="font-syne font-extrabold text-5xl mb-6">Галерея</h1>
          <GallerySection />
        </div>
      </main>
      <Footer />
    </>
  );
}
