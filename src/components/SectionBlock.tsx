import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface SectionBlockProps {
  id: string;
  title: string;
  children: ReactNode;
}

const SectionBlock = ({ id, title, children }: SectionBlockProps) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] }}
      className="max-w-6xl mx-auto px-6 py-16 md:py-32"
    >
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="section-title mb-12"
      >
        {title}.
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
};

export default SectionBlock;
