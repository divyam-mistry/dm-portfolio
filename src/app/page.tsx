import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Work from "@/components/Work";
import ShipLog from "@/components/ShipLog";
import Writing from "@/components/Writing";
import Experience from "@/components/Experience";
import Toolkit from "@/components/Toolkit";
import Record from "@/components/Record";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Work />
        <ShipLog />
        <Writing />
        <Experience />
        <Toolkit />
        <Record />
      </main>
      <Contact />
    </>
  );
}
