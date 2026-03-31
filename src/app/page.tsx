import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/sections/HeroSection';
import { PhilosophySection } from '../components/sections/PhilosophySection';
import { GoalSection } from '../components/sections/GoalSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <HeroSection />
      
      <PhilosophySection />
      
      <GoalSection />
      
      <Footer />
    </main>
  );
}
