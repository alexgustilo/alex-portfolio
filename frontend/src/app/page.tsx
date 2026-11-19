import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Skills from "@/components/sections/skills";
import Projects from "@/components/sections/projects";
import Certificates from "@/components/sections/certificates";
import Journey from "@/components/sections/journey";
import Contact from "@/components/sections/contact";

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
