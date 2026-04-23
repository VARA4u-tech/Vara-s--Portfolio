import { motion } from "framer-motion";

interface Props {
  children: JSX.Element;
  width?: "fit-content" | "100%";
  delay?: number;
  y?: number;
  duration?: number;
}

export const Reveal = ({ children, width = "fit-content", delay = 0.25, y = 75, duration = 0.5 }: Props) => {
  return (
    <div style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        transition={{ duration, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};
