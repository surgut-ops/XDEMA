// ── app/courses/page.tsx ─────────────────────────────────
// Re-uses the Pricing section + full FAQ
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroBg } from '@/components/sections/HeroBg';
import { Pricing, FAQ } from '@/components/sections';

export default function CoursesPage() {
  return (
    <>
      <HeroBg />
      <Navbar />
      <main className="pt-[66px]">
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

export const metadata = { title: 'Обучение DJ — XDEMA' };
