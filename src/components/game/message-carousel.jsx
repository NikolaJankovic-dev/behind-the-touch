import * as React from "react";
import { useState, useEffect } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import message from "@/assets/images/icons/message.png";

export function MessageCarousel({ activeSlide, setActiveSlide }) {
  const [api, setApi] = useState(null);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setActiveSlide(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel
      opts={{
        align: "center",
      }}
      setApi={setApi}
      className="w-full absolute bottom-40 left-0 right-0 z-10"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/3 lg:basis-1/3 ">
            <div
              className={` text-white flex flex-col justify-end items-center transition-all h-full duration-300 select-none whitespace-nowrap ${
                activeSlide + 1 === index
                  ? "border-b-2 border-white text-2xl opacity-100 p-2"
                  : "text-md opacity-50 p-4"
              }`}
            >
              {activeSlide + 1 === index && (
                <img src={message} alt="message" className="w-8 h-8" />
              )}
              <span className=" font-semibold">
                {index > 0 && index < 4 ? `Message ${index}` : ""}
              </span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
