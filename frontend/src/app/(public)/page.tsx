
import Navbar from "@/components/public/layout/navbar";
import Footer from "@/components/public/layout/footer";
import Hero from "@/components/public/sections/hero";
import About from "@/components/public/sections/about";
import Skills from "@/components/public/sections/skills";
import Projects from "@/components/public/sections/projects";
import Certificates from "@/components/public/sections/certificates";
import Journey from "@/components/public/sections/journey";
import Contact from "@/components/public/sections/contact";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certificates />
        <Journey />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
