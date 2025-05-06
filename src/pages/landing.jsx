import React from "react";
import landing from "@/assets/images/landing.png";
import { motion } from "motion/react";
const Landing = ({ step }) => {
  return (
      <motion.div
      className="w-full h-full"
      style={{
        backgroundImage: `url(${landing})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      ></motion.div>
  );
};

export default Landing;
