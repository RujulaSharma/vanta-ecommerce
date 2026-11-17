import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { m as motion } from "framer-motion";
import bagsImage from "../assets/category/hero.jpg";

const About = () => (
  <main>
    <section className="mx-auto grid max-w-[1520px] items-stretch px-4 py-6 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="flex flex-col justify-center bg-[var(--vanta-soft)] px-7 py-14 sm:p-14 lg:p-20">
        <h1 className="font-serif text-5xl leading-none tracking-tight sm:text-7xl">About VANTA</h1>
        <p className="mt-6 max-w-md text-base leading-7 text-[var(--vanta-muted)]">
          VANTA brings together handbags, clothing, footwear and jewelry. The collections are built around shape and proportion, from a structured tote to a fluid evening dress.
        </p>
        <Link to="/category" className="mt-8 inline-flex w-fit items-center gap-2 border-b pb-2 text-xs font-semibold uppercase tracking-widest">
          Browse collections <ArrowUpRight size={16} />
        </Link>
      </div>
      <img src={bagsImage} alt="Handbags from the VANTA edit" className="h-full min-h-64 w-full object-cover lg:min-h-[520px]" />
    </section>
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-2 md:items-center md:gap-16 md:py-24"
    >
      <h2 className="font-serif text-4xl leading-tight sm:text-5xl">The handbag edit</h2>
      <div>
        <p className="text-sm leading-7 text-[var(--vanta-muted)]">
          Explore compact shoulder bags, totes for everyday carry and travel styles with room for a weekend away.
        </p>
        <Link to="/category/bags" className="mt-5 inline-flex items-center gap-2 border-b pb-2 text-xs font-semibold uppercase tracking-widest">
          Shop handbags <ArrowUpRight size={16} />
        </Link>
      </div>
    </motion.section>
  </main>
);

export default About;
