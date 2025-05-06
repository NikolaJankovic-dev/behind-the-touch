import React from "react";
import { motion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import pack from "@/assets/images/pack.png";
import lines from "@/assets/images/lines.png";
import vector from "@/assets/images/vector.png";

const Info = () => {
  return (
    <motion.div
      key="info"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
        opacity: { duration: 0.8, delay: 0.5 },
        scale: { duration: 0.8, delay: 0.5 }
      }}
      style={{
        backgroundImage: `url(${lines})`,
        backgroundSize: "contain",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <img
        src={vector}
        alt="vector"
        className="absolute top-0 left-0 w-full mt-10 object-contain"
      />
      <Carousel>
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <div
                className="w-full  "
                // style={{ height: window.innerHeight }}
              >
                <img
                  src={pack}
                  alt="pack"
                  className="w-[90%] ml-auto mt-32 h-full object-contain"
                />
              </div>
            </CarouselItem>
            <CarouselItem>...</CarouselItem>
          </CarouselContent>
        </Carousel>
      </Carousel>
    </motion.div>
  );
};

export default Info;
