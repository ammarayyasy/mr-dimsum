import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Dishes from "@/components/Dishes";
import Services from "@/components/Services";
import News from "@/components/News";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col">
        <Hero />
        <About />
        <Dishes />
        <Services />
        <News />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
