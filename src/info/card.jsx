import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

const Card = ({ item, index, step, setShowNext }) => {
    const [show, setShow] = useState(false);
    const cardRef = useRef(null);
  
    useEffect(() => {
      if (step !== 2) {
        setShow(false);
        return;
      }
  
      const timeout = setTimeout(() => {
        setShow(true);
        if (index === 5) {
          setShowNext(true);
        }
      }, index * 800 + 300); // 1s pauza + indeksirano kašnjenje
  
      return () => clearTimeout(timeout);
    }, [index, step]);
  
    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="text-[2.2vh] text-[#05164E] whitespace-pre-line text-center rounded-2xl py-3 px-4 min-w-full"
        style={{
          backgroundImage: `linear-gradient(135deg, #C4C4C4 0%, #FFFFFF 50%, #C4C4C4 100%)`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {item}
      </motion.div>
    );
  };
  

export default Card;
